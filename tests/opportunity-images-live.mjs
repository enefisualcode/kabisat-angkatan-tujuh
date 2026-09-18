import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { origin, post, upload, complete, cancel } from './opportunity-test-client.mjs';

const admin=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SECRET_KEY,{auth:{persistSession:false}});
const anon=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false}});
const marker=`Multi-image test ${randomUUID()}`;
const sessions=[];
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aV5kAAAAASUVORK5CYII=','base64');
function form(count,type='job') {
  const form=new FormData();
  for(const [key,value] of Object.entries({type,title:`${marker} ${count}`,description:'Temporary fixture',location:'Bogor',whatsapp:'6281234567890',submittedBy:'Test',company:'Test',employmentType:'Full Time',requirements:'Test',ownerName:'Test',category:'Test',imageTypes:JSON.stringify(Array(count).fill('image/png'))})) form.set(key,value);
  return form;
}
async function start(count,type) {
  const response=await post('/api/opportunities/submissions',form(count,type));
  assert.equal(response.status,201,`Session start failed: ${await response.clone().text()}`);
  const session=await response.json(); sessions.push(session); return session;
}
async function sessionPaths(session) {
  const result=await admin.from('opportunity_upload_sessions').select('image_paths').eq('id',session.id).single(); assert.ifError(result.error); return result.data.image_paths;
}
function actionId(html) { const match=html.match(/name="(\$ACTION_ID_[^"]+)"/); assert.ok(match,'Action form exists'); return match[1]; }
async function action(id,fields,cookie='') {
  const data=new FormData();data.set(id,''); for(const [key,value] of Object.entries(fields)) data.set(key,value);
  return fetch(origin+'/admin/karier-usaha',{method:'POST',headers:{Origin:origin,Cookie:cookie},body:data,redirect:'manual'});
}
try {
  assert.equal((await post('/api/opportunities/submissions',form(6))).status,400);
  const badType=form(1); badType.set('imageTypes','["image/svg+xml"]'); assert.equal((await post('/api/opportunities/submissions',badType)).status,400);
  console.log('PASS >5 files and non-image manifest rejected');

  for(const count of [1,5]) {
    const session=await start(count,count===1?'job':'business');
    const paths=await sessionPaths(session);
    // Five files at 3 MiB each prove this never depends on a 15 MiB HTTP request.
    const bytes=count===5 ? Buffer.concat([png,Buffer.alloc(3*1024*1024-png.length)]) : png;
    // Upload reverse order; the final gallery must follow chosen order, not completion order.
    for(let index=count-1;index>=0;index--) assert.equal((await upload(session,index,new File([bytes],`${index}.png`,{type:'image/png'}))).status,200);
    assert.equal((await complete(session)).status,201);
    assert.equal((await complete(session)).status,201,'Finalization retry is idempotent');
    const row=await admin.from('opportunities').select('*,opportunity_images(*)').eq('id',session.id).single(); assert.ifError(row.error);
    assert.equal(row.data.status,'pending'); assert.equal(row.data.published_at,null);
    const images=row.data.opportunity_images.sort((a,b)=>a.sort_order-b.sort_order);
    assert.deepEqual(images.map(image=>image.storage_path),paths);
    assert.deepEqual(images.map(image=>image.sort_order),Array.from({length:count},(_,i)=>i));
    assert.equal(row.data.image_url,paths[0]);
    const metadata=await anon.from('opportunity_images').select('*').eq('opportunity_id',session.id); assert.ifError(metadata.error); assert.equal(metadata.data.length,0);
    for(const image of images) {
      assert.equal((await fetch(`${origin}/api/opportunities/${session.id}/image?image=${image.id}`)).status,404);
      assert.ok((await anon.storage.from('opportunity-images').download(image.storage_path)).error);
    }
    assert.ifError((await admin.from('opportunities').update({status:'published'}).eq('id',session.id)).error);
    const published=await anon.from('opportunity_images').select('*').eq('opportunity_id',session.id); assert.ifError(published.error);assert.equal(published.data.length,count);
    const detail=await fetch(`${origin}/karier-usaha/${row.data.slug}`); assert.equal(detail.status,200); const html=await detail.text();
    assert.ok(html.includes('Galeri foto')); for(const image of images) assert.ok(html.includes(image.id));
    for(const image of images) assert.equal((await fetch(`${origin}/api/opportunities/${session.id}/image?image=${image.id}`)).status,200);
    const list=await (await fetch(origin+'/karier-usaha')).text();assert.ok(list.includes(`/api/opportunities/${session.id}/image?image=${images[0].id}`));
    await cancel(session); // Completed session cancellation must never delete committed files.
    assert.ifError((await admin.storage.from('opportunity-images').download(paths[0])).error);
    console.log(`PASS ${count} photo submission, sort order, pending isolation, published gallery and cover, idempotency`);
  }

  const partial=await start(2);
  const paths=await sessionPaths(partial);
  assert.equal((await upload(partial,0,new File([png],'valid.png',{type:'image/png'}))).status,200);
  assert.equal((await upload(partial,1,new File([Buffer.alloc(3*1024*1024+1)],'big.png',{type:'image/png'}))).status,400);
  assert.equal((await upload(partial,1,new File(['hello'],'text.txt',{type:'text/plain'}))).status,400);
  assert.equal((await upload(partial,1,new File(['forged'],'fake.png',{type:'image/png'}))).status,400);
  assert.equal((await complete(partial)).status,409);
  assert.equal((await admin.from('opportunities').select('id').eq('id',partial.id).maybeSingle()).data,null);
  // Simulate a child-row constraint failure using only our fixture's manifest.
  assert.ifError((await admin.from('opportunity_upload_sessions').update({image_paths:[paths[0],paths[0]]}).eq('id',partial.id)).error);
  assert.equal((await complete(partial)).status,409);
  assert.equal((await admin.from('opportunities').select('id').eq('id',partial.id).maybeSingle()).data,null,'Parent rolled back if child insert fails');
  assert.ifError((await admin.from('opportunity_upload_sessions').update({image_paths:paths}).eq('id',partial.id)).error);
  assert.equal((await cancel(partial)).status,200);
  assert.ok((await admin.storage.from('opportunity-images').download(paths[0])).error);
  console.log('PASS oversized/non-image/forged files, incomplete submission, atomic rollback, partial upload cleanup');

  const loginHtml=await (await fetch(origin+'/admin/karier-usaha')).text();
  const login=await action(actionId(loginHtml),{password:process.env.OPPORTUNITY_ADMIN_PASSWORD});assert.equal(login.status,303);
  const cookie=login.headers.getSetCookie().map(value=>value.split(';')[0]).join('; ');
  for(const session of sessions.slice(0,2)) {
    const listing=await (await fetch(origin+'/admin/karier-usaha?status=published',{headers:{Cookie:cookie}})).text();
    const article=listing.split('<article').find(part=>part.includes(session.id));assert.ok(article);
    const images=await admin.from('opportunity_images').select('*').eq('opportunity_id',session.id);assert.ifError(images.error);
    for(const image of images.data) {
      assert.ok(article.includes(image.id),'Admin preview includes all images');
      assert.equal((await fetch(`${origin}/admin/karier-usaha/image/${session.id}?image=${image.id}`,{headers:{Cookie:cookie}})).status,200);
    }
    const deleteForm=[...article.matchAll(/<form[\s\S]*?<\/form>/g)].map(match=>match[0]).find(form=>form.includes('Hapus'));assert.ok(deleteForm);
    const denied=await action(actionId(deleteForm),{id:session.id});assert.ok(denied.headers.get('location').includes('error=session'));
    const deletion=await action(actionId(deleteForm),{id:session.id},cookie);assert.ok(deletion.headers.get('location').includes('done=deleted'));
    assert.equal((await admin.from('opportunities').select('id').eq('id',session.id).maybeSingle()).data,null);
    assert.equal((await admin.from('opportunity_images').select('*').eq('opportunity_id',session.id)).data.length,0);
    for(const path of await sessionPaths(session)) assert.ok((await admin.storage.from('opportunity-images').download(path)).error);
  }
  console.log('PASS admin preview, admin-only Delete, all files removed, image metadata cascades');
} finally {
  for(const session of sessions) {
    const paths=await sessionPaths(session);
    if(paths.length) assert.ifError((await admin.storage.from('opportunity-images').remove(paths)).error);
    assert.ifError((await admin.from('opportunities').delete().eq('id',session.id)).error);
    assert.ifError((await admin.from('opportunity_upload_sessions').delete().eq('id',session.id)).error);
  }
  console.log('Cleaned up only this run\'s fixture rows, manifests and files.');
}
