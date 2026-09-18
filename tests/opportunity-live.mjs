// Run against the local app with .env.local. Only this run's UUID fixtures are removed.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { submitForm } from './opportunity-test-client.mjs';

const origin = 'http://localhost:3100';
const key = process.env.SUPABASE_SECRET_KEY;
assert.ok(key && process.env.OPPORTUNITY_ADMIN_PASSWORD, 'Configure local server credentials first.');
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, { auth: { persistSession: false } });
const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { persistSession: false } });
const marker = `KABISAT integration ${randomUUID()}`;
const titles = [`${marker} job`, `${marker} business`];
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aV5kAAAAASUVORK5CYII=', 'base64');
function form(type) {
  const data = new FormData();
  for (const [key, value] of Object.entries({type, title:`${marker} ${type}`, description:'Temporary integration fixture; automatically removed.', location:'Bogor', whatsapp:'6281234567890', submittedBy:'Automated test', company:'Test', employmentType:'Full Time', requirements:'Test', ownerName:'Test', category:'Kuliner', status:'published'})) data.set(key,value);
  data.set('image', new File([png], 'fixture.png', {type:'image/png'}));
  return data;
}
async function submit(data) { return submitForm(data); }
function actionId(html) {
  const match = html.match(/name="(\$ACTION_ID_[^"]+)"/);
  assert.ok(match, 'Server action form exists'); return match[1];
}
async function action(id, fields, cookie = '') {
  const data = new FormData(); data.set(id, '');
  for (const [key, value] of Object.entries(fields)) data.set(key,value);
  return fetch(`${origin}/admin/karier-usaha`, {method:'POST', headers:{Origin:origin, Cookie:cookie}, body:data, redirect:'manual'});
}
const checks = [];
function pass(label) { checks.push(label); console.log(`PASS ${label}`); }
try {
  for (const type of ['job','business']) {
    const response = await submit(form(type));
    assert.equal(response.status, 201, `Submission ${type}: ${await response.text()}`);
  }
  pass('job + business submission with real Storage upload');
  const { data: rows, error } = await admin.from('opportunities').select('*').in('title', titles);
  assert.ifError(error); assert.equal(rows.length,2);
  for (const row of rows) { assert.equal(row.status,'pending'); assert.equal(row.published_at,null); assert.ok(row.slug && row.image_url); }
  const ids = rows.map(row => row.id);
  const pending = await anon.from('opportunities').select('*').in('id',ids);
  assert.ifError(pending.error); assert.equal(pending.data.length,0);
  for (const row of rows) {
    assert.ok((await anon.storage.from('opportunity-images').download(row.image_url)).error);
    assert.equal((await fetch(`${origin}/api/opportunities/${row.id}/image`)).status,404);
    const detail = await fetch(`${origin}/karier-usaha/${row.slug}`);
    const html = await detail.text(); assert.ok(detail.status === 404 || html.includes('NEXT_HTTP_ERROR_FALLBACK;404'));
  }
  pass('pending rows, detail pages, and images hidden from public');
  const invalidUrl = form('job'); invalidUrl.set('applicationUrl','javascript:alert(1)');
  assert.equal((await submit(invalidUrl)).status,400);
  const invalidImage = form('job'); invalidImage.set('image',new File(['fake'], 'fake.png',{type:'image/png'}));
  assert.equal((await submit(invalidImage)).status,400);
  pass('invalid URL and forged image rejected by real endpoint');
  const job = rows.find(row => row.type === 'job');
  const business = rows.find(row => row.type === 'business');
  assert.equal((await fetch(`${origin}/admin/karier-usaha/image/${job.id}`)).status,401);
  const loginHtml = await (await fetch(`${origin}/admin/karier-usaha`)).text();
  const loginResult = await action(actionId(loginHtml), { password: process.env.OPPORTUNITY_ADMIN_PASSWORD });
  assert.equal(loginResult.status,303);
  const cookie = loginResult.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
  assert.ok(cookie.includes('kabisat-opportunity-admin='));
  const adminHtml = await (await fetch(`${origin}/admin/karier-usaha`,{headers:{Cookie:cookie}})).text();
  assert.ok(adminHtml.includes(marker));
  assert.equal((await fetch(`${origin}/admin/karier-usaha/image/${job.id}`,{headers:{Cookie:cookie}})).status,200);
  const actionIds = [...adminHtml.matchAll(/name="(\$ACTION_ID_[^"]+)"/g)].map(match=>match[1]);
  assert.ok(actionIds.length >= 2);
  const moderateId = actionIds[1]; // First form is logout, subsequent forms moderate.
  const unauthorized = await action(moderateId,{id:job.id,status:'published'});
  assert.ok(unauthorized.status >= 400);
  assert.equal((await admin.from('opportunities').select('status').eq('id',job.id).single()).data.status,'pending');
  pass('admin login, private preview, and unauthorized moderation blocked');
  assert.equal((await action(moderateId,{id:job.id,status:'published'},cookie)).status,303);
  assert.equal((await action(moderateId,{id:business.id,status:'rejected'},cookie)).status,303);
  const visible = await anon.from('opportunities').select('*').in('id',ids);
  assert.ifError(visible.error); assert.equal(visible.data.length,1); assert.equal(visible.data[0].id,job.id); assert.ok(visible.data[0].published_at);
  const rejected = await admin.from('opportunities').select('status,published_at').eq('id',business.id).single();
  assert.equal(rejected.data.status,'rejected'); assert.equal(rejected.data.published_at,null);
  const publicHtml = await (await fetch(`${origin}/karier-usaha`)).text();
  assert.ok(publicHtml.includes(job.title)); assert.ok(!publicHtml.includes(business.title));
  const detail = await fetch(`${origin}/karier-usaha/${job.slug}`);
  assert.equal(detail.status,200); assert.ok((await detail.text()).includes(job.title));
  const image = await fetch(`${origin}/api/opportunities/${job.id}/image`);
  assert.equal(image.status,200); assert.equal(image.headers.get('content-type'),'image/png');
  assert.equal((await fetch(`${origin}/api/opportunities/${business.id}/image`)).status,404);
  assert.ok((await anon.storage.from('opportunity-images').download(business.image_url)).error);
  pass('publish/reject actions, published list, slug detail, and image visibility');
} finally {
  const { data, error } = await admin.from('opportunities').select('id,image_url').in('title',titles);
  assert.ifError(error);
  for (const row of data) {
    if (row.image_url) assert.ifError((await admin.storage.from('opportunity-images').remove([row.image_url])).error);
    assert.ifError((await admin.from('opportunities').delete().eq('id',row.id)).error);
  }
  console.log('Cleaned up only this run\'s fixtures and uploaded images.');
}
console.log(`${checks.length} live integration groups passed.`);
