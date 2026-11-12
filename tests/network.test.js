import test from 'node:test';
import assert from 'node:assert/strict';
import { connect } from '../src/network.js';

test('multiplayer recovers if its server starts after the page was opened',async t=>{
  const oldWindow=globalThis.window,oldSource=globalThis.EventSource;
  globalThis.window={addEventListener(){}};
  const sources=[];globalThis.EventSource=class{constructor(){sources.push(this);}close(){}};
  t.after(()=>{globalThis.window=oldWindow;globalThis.EventSource=oldSource;});
  t.mock.timers.enable({apis:['setTimeout']});
  let attempts=0;
  t.mock.method(globalThis,'fetch',async url=>{
    if(url==='/api/status'){attempts++;if(attempts===1)throw new Error('server not started');return Response.json({online:true});}
    return Response.json({id:'visitor',token:'session'},{status:201});
  });
  let status;const api=connect({state:{name:'test',color:'#eaa06c'},onStatus:n=>status=n,onPlayers(){},onChat(){}});
  await new Promise(setImmediate);assert.equal(status,null);
  t.mock.timers.tick(4000);await new Promise(setImmediate);
  assert.equal(sources.length,1);sources[0].onopen();assert.equal(api.online,true);assert.equal(api.id,'visitor');
});
test('static GitHub Pages stays offline without repeatedly requesting a server',async t=>{
  const old=globalThis.window;globalThis.window={addEventListener(){}};t.after(()=>globalThis.window=old);t.mock.timers.enable({apis:['setTimeout']});
  let requests=0;t.mock.method(globalThis,'fetch',async()=>{requests++;return new Response('not found',{status:404});});
  connect({state:{},onStatus(){},onPlayers(){},onChat(){}});await new Promise(setImmediate);t.mock.timers.tick(20000);await new Promise(setImmediate);assert.equal(requests,1);
});
