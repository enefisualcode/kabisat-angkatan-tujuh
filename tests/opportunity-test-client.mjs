export const origin = 'http://localhost:3100';
export function post(path, body, method = 'POST') {
  return fetch(origin + path, {method,headers:{Origin:origin},body});
}
export function tokenForm(session) { const form=new FormData(); form.set('token',session.token); return form; }
export function upload(session, order, file) {
  const form=tokenForm(session); form.set('order',String(order)); form.set('image',file);
  return post(`/api/opportunities/submissions/${session.id}/images`,form);
}
export function complete(session) {
  const form=tokenForm(session); form.set('submissionId',session.id); return post('/api/opportunities',form);
}
export function cancel(session) { return post(`/api/opportunities/submissions/${session.id}`,tokenForm(session),'DELETE'); }
export async function submitForm(form) {
  const files=form.getAll('image').filter(value=>value instanceof File && value.size);
  form.delete('image'); form.set('imageTypes',JSON.stringify(files.map(file=>file.type)));
  const start=await post('/api/opportunities/submissions',form);
  if(!start.ok) return start;
  const session=await start.json();
  for(let i=0;i<files.length;i++) {
    const result=await upload(session,i,files[i]);
    if(!result.ok) { await cancel(session); return result; }
  }
  return complete(session);
}
