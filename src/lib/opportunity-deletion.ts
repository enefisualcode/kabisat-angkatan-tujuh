// Orchestrates the two services without credentials. Called only by the admin action.
export type DeletionResult = "deleted" | "storage-error" | "database-error" | "image-reference-error";

export async function deleteOpportunityRecord(imagePaths: string[], operations: {
  removeImage: (path: string) => Promise<void>;
  deleteRow: () => Promise<void>;
  clearImageReference: (paths: string[]) => Promise<void>;
}): Promise<DeletionResult> {
  const removed: string[] = [];
  for (const path of [...new Set(imagePaths)]) {
    try { await operations.removeImage(path); removed.push(path); }
    catch {
      if (removed.length) {
        try { await operations.clearImageReference(removed); }
        catch { return "image-reference-error"; }
      }
      return "storage-error";
    }
  }
  try { await operations.deleteRow(); return "deleted"; }
  catch {
    // Storage and Postgres cannot share a transaction. Preserve the row for retry,
    // but remove its now-stale image reference if the database is reachable.
    if (removed.length) {
      try { await operations.clearImageReference(removed); }
      catch { return "image-reference-error"; }
    }
    return "database-error";
  }
}
