import test from 'node:test';
import assert from 'node:assert/strict';
import { createVillageServer } from '../server.js';

test('server authenticates movement, broadcasts visitors and delivers safe chat', async t => {
  const server=createVillageServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
  t.after(()=>{server.closeAllConnections();server.close();});
  const base=`http://127.0.0.1:${server.address().port}`;
  const post=(path,data)=>fetch(base+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});
  const status=await fetch(base+'/api/status');assert.equal(status.status,200);
  const joined=await post('/api/join',{name:'가을',color:'#8fae9a'});assert.equal(joined.status,201);const session=await joined.json();assert.ok(session.token);
  assert.equal((await post('/api/move',{token:'fake',x:2,z:3})).status,401);
  assert.equal((await post('/api/move',{token:session.token,x:200,z:3})).status,400);
  assert.equal((await post('/api/move',{token:session.token,x:2,z:3,angle:1})).status,200);
  const ctrl=new AbortController();t.after(()=>ctrl.abort());
  const stream=await fetch(base+`/api/events?token=${session.token}`,{signal:ctrl.signal});assert.equal(stream.status,200);const reader=stream.body.getReader();
  const first=new TextDecoder().decode((await reader.read()).value);assert.ok(first.includes('"x":2'));assert.ok(!first.includes(session.token));
  const chat=await post('/api/chat',{token:session.token,text:'안녕 <img src=x onerror=alert(1)>'});assert.equal(chat.status,200);
  const next=new TextDecoder().decode((await reader.read()).value);assert.ok(next.includes('"kind":"chat"'));assert.ok(next.includes('안녕'));
  assert.equal((await post('/api/chat',{token:session.token,text:'too fast'})).status,429);
  ctrl.abort();
});
test('server rejects cross-site writes and large or invalid payloads', async t => {
  const server=createVillageServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>{server.closeAllConnections();server.close();});const base=`http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(base+'/api/join',{method:'POST',headers:{origin:'https://evil.example'},body:'{}'})).status,403);
  assert.equal((await fetch(base+'/api/join',{method:'POST',body:'{broken'})).status,400);
  assert.equal((await fetch(base+'/api/join',{method:'POST',body:JSON.stringify({name:'a'.repeat(5000)})})).status,413);
  assert.equal((await fetch(base+'/package.json')).status,404);
});
