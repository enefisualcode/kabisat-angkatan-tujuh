import test from 'node:test';
import assert from 'node:assert/strict';
import { validateImages, MAX_IMAGE_BYTES } from '../src/lib/opportunity-validation.ts';
import { orderedImages, opportunityImages, opportunityStoragePaths } from '../src/lib/opportunity-images.ts';
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aV5kAAAAASUVORK5CYII=', 'base64');
const photo = () => new File([png], 'photo.png', {type:'image/png'});
test('accept one through ten images', async () => { await validateImages([photo()]); await validateImages(Array.from({length:5},photo)); await validateImages(Array.from({length:10},photo)); });
test('reject more than ten', async () => { await assert.rejects(validateImages(Array.from({length:11},photo)), /10 foto/); });
test('reject oversized image among otherwise valid images', async () => {
  await assert.rejects(validateImages([photo(),new File([new Uint8Array(MAX_IMAGE_BYTES+1)],'big.png',{type:'image/png'})]), /3 MB/);
});
test('reject non-image and forged image among otherwise valid images', async () => {
  await assert.rejects(validateImages([photo(),new File(['text'],'text.txt',{type:'text/plain'})]));
  await assert.rejects(validateImages([photo(),new File(['text'],'fake.png',{type:'image/png'})]));
});
test('cover and gallery follow sort_order without mutating the input', () => {
  const rows = [{id:'second',storage_path:'b.png',sort_order:1},{id:'first',storage_path:'a.png',sort_order:0}];
  assert.equal(orderedImages(rows)[0].id,'first'); assert.equal(rows[0].id,'second');
  const images = opportunityImages({id:'posting',image_url:'old.png',opportunity_images:rows});
  assert.equal(images.length,2); assert.equal(images[0].url,'/api/opportunities/posting/image?image=first');
  assert.equal(opportunityImages({id:'posting',opportunity_images:rows},true)[0].url,'/admin/karier-usaha/image/posting?image=first');
});
test('legacy path and missing photo stay compatible', () => {
  assert.equal(opportunityImages({id:'posting',image_url:'old.png'})[0].url,'/api/opportunities/posting/image');
  assert.deepEqual(opportunityImages({id:'posting',image_url:null}),[]);
  assert.deepEqual(opportunityStoragePaths({image_url:'a.png',opportunity_images:[{storage_path:'a.png'},{storage_path:'b.png'}]}),['a.png','b.png']);
  assert.deepEqual(opportunityStoragePaths({image_url:'https://example.com/image.jpg'}),[]);
});
