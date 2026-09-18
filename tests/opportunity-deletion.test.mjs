import test from 'node:test';
import assert from 'node:assert/strict';
import { deleteOpportunityRecord } from '../src/lib/opportunity-deletion.ts';

function operations(failures = []) {
  const calls = [];
  const operation = name => async () => { calls.push(name); if (failures.includes(name)) throw new Error('Service unavailable'); };
  return { calls, removeImage: operation('storage'), deleteRow: operation('database'), clearImageReference: operation('repair') };
}
test('image is removed before row', async () => {
  const ops = operations();
  assert.equal(await deleteOpportunityRecord(['fixture/photo.png'], ops), 'deleted');
  assert.deepEqual(ops.calls, ['storage', 'database']);
});
test('without image only row is deleted', async () => {
  const ops = operations();
  assert.equal(await deleteOpportunityRecord([], ops), 'deleted');
  assert.deepEqual(ops.calls, ['database']);
});
test('storage failure must not mutate the database', async () => {
  const ops = operations(['storage']);
  assert.equal(await deleteOpportunityRecord(['fixture/photo.png'], ops), 'storage-error');
  assert.deepEqual(ops.calls, ['storage']);
});
test('database failure after image removal repairs stale reference and reports failure', async () => {
  const ops = operations(['database']);
  assert.equal(await deleteOpportunityRecord(['fixture/photo.png'], ops), 'database-error');
  assert.deepEqual(ops.calls, ['storage', 'database', 'repair']);
});
test('repair failure is reported explicitly for retry, never as success', async () => {
  const ops = operations(['database', 'repair']);
  assert.equal(await deleteOpportunityRecord(['fixture/photo.png'], ops), 'image-reference-error');
  assert.deepEqual(ops.calls, ['storage', 'database', 'repair']);
});
test('database failure without image does not touch Storage', async () => {
  const ops = operations(['database']);
  assert.equal(await deleteOpportunityRecord([], ops), 'database-error');
  assert.deepEqual(ops.calls, ['database']);
});
test('delete all distinct files before row', async () => {
  const calls = [];
  const result = await deleteOpportunityRecord(['a.png','b.png','a.png'], {
    removeImage: async path => { calls.push(path); }, deleteRow: async () => { calls.push('row'); }, clearImageReference: async () => { throw new Error('Unexpected repair'); },
  });
  assert.equal(result,'deleted'); assert.deepEqual(calls,['a.png','b.png','row']);
});
test('partial Storage failure keeps row and repairs only removed image references', async () => {
  const calls = [];
  const result = await deleteOpportunityRecord(['a.png','b.png','c.png'], {
    removeImage: async path => { calls.push(path); if(path==='b.png') throw new Error('Storage failed'); },
    deleteRow: async () => { throw new Error('Row must not be deleted'); },
    clearImageReference: async paths => { calls.push(paths); },
  });
  assert.equal(result,'storage-error'); assert.deepEqual(calls,['a.png','b.png',['a.png']]);
});
