import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSubmission, validateImageContent, validateImage, MAX_IMAGE_BYTES, normalizeInstagramUrl, normalizeWebsiteUrl } from '../src/lib/opportunity-validation.ts';
import { filterJobs, filterBusinesses } from '../src/lib/opportunity-filters.ts';

function form(type = 'job', extra = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ type, title: 'Peluang Alumni', description: 'Deskripsi', location: 'Bogor', whatsapp: '0812-3456-7890', submittedBy: 'Alumni', company: 'Perusahaan', employmentType: 'Full Time', requirements: 'Komunikatif', ownerName: 'Pemilik', category: 'Kuliner', ...extra })) data.set(key, value);
  return data;
}
test('job submission forces pending and normalizes WhatsApp', () => {
  const row = validateSubmission(form('job', { status: 'published', published_at: new Date().toISOString() }));
  assert.equal(row.status, 'pending'); assert.equal(row.published_at, null); assert.equal(row.whatsapp, '6281234567890'); assert.equal(row.company, 'Perusahaan');
});
test('business submission maps fields without job fields', () => {
  const row = validateSubmission(form('business', { website: 'example.com' }));
  assert.equal(row.owner_name, 'Pemilik'); assert.equal(row.category, 'Kuliner'); assert.equal(row.company, undefined);
  assert.equal(row.website, 'https://example.com');
});
test('Instagram formats normalize to the canonical profile URL', () => {
  for (const value of ['nabilfalah', '@nabilfalah', 'instagram.com/nabilfalah', 'www.instagram.com/nabilfalah', 'https://instagram.com/nabilfalah', 'https://www.instagram.com/nabilfalah']) {
    assert.equal(normalizeInstagramUrl(value), 'https://instagram.com/nabilfalah');
    assert.equal(validateSubmission(form('business', { instagram: value })).instagram, 'https://instagram.com/nabilfalah');
  }
});
test('website formats normalize to complete URLs', () => {
  for (const value of ['nabilfalah.cloud', 'www.nabilfalah.cloud', 'https://nabilfalah.cloud', 'http://nabilfalah.cloud', 'https://www.nabilfalah.cloud']) {
    assert.equal(normalizeWebsiteUrl(value), value.startsWith('http') ? value : `https://${value}`);
    assert.equal(validateSubmission(form('business', { website: value })).website, normalizeWebsiteUrl(value));
  }
});
test('required, length, WhatsApp and employment validation', () => {
  for (const extra of [{title:''}, {description:'x'.repeat(10001)}, {whatsapp:'abc'}, {employmentType:'CEO'}, {type:'invalid'}]) assert.throws(() => validateSubmission(form('job', extra)));
});
test('unsafe/malformed URLs rejected in every URL field', () => {
  for (const value of ['javascript:alert(1)', 'not a url', 'https://user:password@example.com', 'data:text/html,hello']) {
    assert.throws(() => validateSubmission(form('job', { applicationUrl: value })));
    assert.throws(() => validateSubmission(form('business', { website: value })));
  }
  for (const value of ['https://example.com/nabilfalah', 'https://evil.example/nabilfalah', '@bad name']) assert.throws(() => validateSubmission(form('business', { instagram: value })));
});
test('date validation rejects rollover dates and accepts valid leap dates', () => {
  for (const deadline of ['2026-02-30', '2026-13-01', 'tomorrow']) assert.throws(() => validateSubmission(form('job', { deadline })));
  assert.equal(validateSubmission(form('job', {deadline:'2028-02-29'})).deadline, '2028-02-29');
});
test('reject SVG, oversized, empty and forged images', async () => {
  assert.throws(() => validateImage(new File(['<svg/>'], 'test.svg', {type:'image/svg+xml'})));
  assert.throws(() => validateImage(new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], 'big.png', {type:'image/png'})));
  assert.throws(() => validateImage(new File([], 'empty.png', {type:'image/png'})));
  await assert.rejects(validateImageContent(new File(['not an image'], 'fake.png', {type:'image/png'})));
});
test('accept valid PNG fixture', async () => {
  const bytes = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aV5kAAAAASUVORK5CYII=', 'base64');
  await validateImageContent(new File([bytes], 'valid.png', {type:'image/png'}));
});
test('search and employment/category filters combine correctly', () => {
  const jobs = [{ title: 'Desainer', company: 'Studio', location: 'Bogor', employmentType: 'Full Time' }, { title: 'Desainer', company: 'Karya', location: 'Jakarta', employmentType: 'Freelance' }];
  assert.equal(filterJobs(jobs, ' DESAINER ', 'Semua').length, 2);
  assert.equal(filterJobs(jobs, 'Bogor', 'Freelance').length, 0);
  assert.equal(filterJobs(jobs, 'karya', 'Freelance').length, 1);
  const businesses = [{ businessName: 'Dapur', ownerName: 'Aisyah', location: 'Bogor', category: 'Kuliner' }];
  assert.equal(filterBusinesses(businesses, 'AISYAH', 'Kuliner').length, 1);
  assert.equal(filterBusinesses(businesses, '', 'Jasa').length, 0);
});
