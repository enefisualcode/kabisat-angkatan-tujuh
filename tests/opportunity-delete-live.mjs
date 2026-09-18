// Run with a local production app on port 3100 and matching environment.
// Only unique fixtures created by this run are deleted.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

assert.ok(process.env.OPPORTUNITY_ADMIN_PASSWORD?.length >= 32, 'Admin password must have at least 32 characters.');
const origin = 'http://localhost:3100';
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {auth:{persistSession:false}});
const fixtures = [];
function actionId(html) {
  const id = html.match(/name="(\$ACTION_ID_[^"]+)"/);
  assert.ok(id, 'Expected server action form'); return id[1];
}
async function action(id, fields, cookie = '') {
  const data = new FormData(); data.set(id, '');
  for (const [key,value] of Object.entries(fields)) data.set(key,value);
  return fetch(`${origin}/admin/karier-usaha`, {method:'POST',headers:{Origin:origin,Cookie:cookie},body:data,redirect:'manual'});
}
try {
  const loginHtml = await (await fetch(`${origin}/admin/karier-usaha`)).text();
  const login = await action(actionId(loginHtml), {password:process.env.OPPORTUNITY_ADMIN_PASSWORD});
  assert.equal(login.status,303);
  const cookie = login.headers.getSetCookie().map(value=>value.split(';')[0]).join('; ');
  assert.ok(cookie.includes('kabisat-opportunity-admin='));
  for (const scenario of [
    {status:'pending',image:'none'},
    {status:'published',image:'present'},
    {status:'rejected',image:'present'},
    {status:'pending',image:'missing'},
  ]) {
    const id = randomUUID();
    const path = scenario.image === 'none' ? null : `${id}/${randomUUID()}.png`;
    fixtures.push({id,path});
    if (scenario.image === 'present') {
      const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aV5kAAAAASUVORK5CYII=', 'base64');
      assert.ifError((await client.storage.from('opportunity-images').upload(path,png,{contentType:'image/png'})).error);
    }
    assert.ifError((await client.from('opportunities').insert({id,type:'job',title:`Delete fixture ${id}`,description:'Temporary automated fixture',image_url:path})).error);
    if (scenario.status !== 'pending') assert.ifError((await client.from('opportunities').update({status:scenario.status}).eq('id',id)).error);
    const listing = await (await fetch(`${origin}/admin/karier-usaha?status=${scenario.status}`,{headers:{Cookie:cookie}})).text();
    const article = listing.split('<article').find(part=>part.includes(`Delete fixture ${id}`));
    assert.ok(article,'Fixture visible in admin tab');
    const forms = [...article.matchAll(/<form[\s\S]*?<\/form>/g)].map(match=>match[0]);
    const deleteForm = forms.find(form=>form.includes('Hapus'));
    assert.ok(deleteForm,'Delete button rendered');
    const deleteId = actionId(deleteForm);
    const denied = await action(deleteId,{id});
    assert.equal(denied.status,303); assert.ok(denied.headers.get('location').includes('error=session'));
    assert.ok((await client.from('opportunities').select('id').eq('id',id).single()).data);
    if (scenario.image === 'present') assert.ifError((await client.storage.from('opportunity-images').download(path)).error);
    const deleted = await action(deleteId,{id},cookie);
    assert.equal(deleted.status,303); assert.ok(deleted.headers.get('location').includes('done=deleted'));
    const row = await client.from('opportunities').select('id').eq('id',id).maybeSingle();
    assert.ifError(row.error); assert.equal(row.data,null);
    if (path) assert.ok((await client.storage.from('opportunity-images').download(path)).error);
    const repeated = await action(deleteId,{id},cookie);
    assert.equal(repeated.status,303); assert.ok(repeated.headers.get('location').includes('delete-missing'));
    console.log(`PASS admin-only deletion: ${scenario.status}, image=${scenario.image}; repeated delete handled`);
  }
} finally {
  for (const fixture of fixtures) {
    if (fixture.path) assert.ifError((await client.storage.from('opportunity-images').remove([fixture.path])).error);
    assert.ifError((await client.from('opportunities').delete().eq('id',fixture.id)).error);
  }
  console.log('Cleaned up only this run\'s rows and images.');
}
