// Maintenance: node --env-file=.env.local scripts/cleanup-opportunity-uploads.mjs
// Safe to schedule hourly with server-side env. No secret values are printed.
import { createClient } from '@supabase/supabase-js';
if (!process.env.SUPABASE_SECRET_KEY) throw new Error('Server credential required.');
const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {auth:{persistSession:false}});
const cutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString();
const {data,error} = await client.from('opportunity_upload_sessions').select('id,status,image_paths').lt('expires_at',cutoff).order('expires_at').limit(100);
if(error) throw new Error('Cannot read expired upload sessions.');
let cleaned=0, failed=0;
for(const session of data) {
  try {
    if(session.status !== 'completed') {
      const claim = await client.from('opportunity_upload_sessions').update({status:'cancelled'}).eq('id',session.id).neq('status','completed').select('image_paths').maybeSingle();
      if(claim.error) throw new Error('Cannot claim session');
      if(claim.data?.image_paths.length) {
        const removed=await client.storage.from('opportunity-images').remove(claim.data.image_paths);
        if(removed.error) throw new Error('Storage cleanup failed');
      }
    }
    const result=await client.from('opportunity_upload_sessions').delete().eq('id',session.id).lt('expires_at',cutoff);
    if(result.error) throw new Error('Cannot finish cleanup');
    cleaned++;
  } catch { failed++; console.error('Cleanup needs retry for session',session.id); }
}
console.log(JSON.stringify({cleaned,failed}));
if(failed) process.exitCode=1;
