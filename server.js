import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { walkable } from './src/game.js';

export function createVillageServer(){
  const sessions=new Map(), streams=new Map();const root=resolve('dist');
  const publicPlayers=()=>[...sessions.values()].map(({id,name,color,x,z,angle})=>({id,name,color,x,z,angle}));
  function emit(res,data){if(!res.destroyed&&!res.writableEnded)res.write(`data: ${JSON.stringify(data)}\n\n`);}
  function broadcast(data){for(const res of streams.values())emit(res,data);}
  const peers=()=>broadcast({kind:'players',players:publicPlayers()});
  const reply=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data));};
  const cleanName=n=>typeof n==='string'?n.replace(/[<>\x00-\x1f]/g,'').trim().slice(0,12)||'여행자':'여행자';
  const server=createServer(async(req,res)=>{
    try{
      const url=new URL(req.url,'http://localhost');
      if(req.method==='GET'&&url.pathname==='/api/status')return reply(res,200,{online:true});
      if(req.method==='GET'&&url.pathname==='/api/events'){
        const token=url.searchParams.get('token');const s=sessions.get(token);if(!s)return reply(res,401,{error:'Unknown session'});
        streams.get(token)?.end();streams.set(token,res);
        res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive','X-Accel-Buffering':'no'});emit(res,{kind:'players',players:publicPlayers()});
        req.on('close',()=>{if(streams.get(token)===res)streams.delete(token);});return;
      }
      if(req.method==='POST'&&url.pathname.startsWith('/api/')){
        if(req.headers.origin){let origin;try{origin=new URL(req.headers.origin);}catch{return reply(res,403,{error:'Invalid origin'});}if(origin.host!==req.headers.host)return reply(res,403,{error:'Cross-origin write denied'});}
        let body='',size=0;for await(const chunk of req){size+=chunk.length;if(size>4096)return reply(res,413,{error:'Body too large'});body+=chunk;}
        let data;try{data=JSON.parse(body);}catch{return reply(res,400,{error:'Invalid JSON'});}if(!data||typeof data!=='object')return reply(res,400,{error:'Object required'});
        if(url.pathname==='/api/join'){
          if(sessions.size>=40)return reply(res,503,{error:'Village full'});
          const token=randomUUID(),id=randomUUID();sessions.set(token,{id,name:cleanName(data.name),color:/^#[0-9a-f]{6}$/i.test(data.color)?data.color:'#eaa06c',x:0,z:5,angle:0,seen:Date.now(),chatAt:0,moveAt:0});reply(res,201,{id,token});peers();return;
        }
        const s=sessions.get(data.token);if(!s)return reply(res,401,{error:'Unknown session'});s.seen=Date.now();
        if(url.pathname==='/api/move'){
          if(!walkable(data.x,data.z)||!Number.isFinite(data.angle))return reply(res,400,{error:'Invalid position'});
          if(Date.now()-s.moveAt<65)return reply(res,429,{error:'Too many updates'});s.moveAt=Date.now();
          Object.assign(s,{x:data.x,z:data.z,angle:data.angle,name:data.name===undefined?s.name:cleanName(data.name)});if(/^#[0-9a-f]{6}$/i.test(data.color))s.color=data.color;
          reply(res,200,{ok:true});peers();return;
        }
        if(url.pathname==='/api/chat'){
          if(typeof data.text!=='string'||!data.text.trim()||data.text.length>140)return reply(res,400,{error:'Message must be 1–140 characters'});
          if(Date.now()-s.chatAt<1000)return reply(res,429,{error:'Wait before sending again'});s.chatAt=Date.now();broadcast({kind:'chat',name:s.name,text:data.text.trim()});return reply(res,200,{ok:true});
        }
        return reply(res,404,{error:'Not found'});
      }
      if(req.method!=='GET'&&req.method!=='HEAD')return reply(res,405,{error:'Method not allowed'});
      let pathname;try{pathname=decodeURIComponent(url.pathname);}catch{return reply(res,400,{error:'Invalid path'});}
      const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
      if(!path.startsWith(root+sep)||pathname.includes('\\')||pathname.split('/').some(x=>x.startsWith('.')))return reply(res,404,{error:'Not found'});
      const allowed={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
      const type=allowed[extname(path)];if(!type)return reply(res,404,{error:'Not found'});
      try{const data=await readFile(path);res.writeHead(200,{'Content-Type':type,'X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);}catch{return reply(res,404,{error:'Run npm run build first'});}
    }catch{if(!res.headersSent)reply(res,400,{error:'Request failed'});else res.end();}
  });
  const timer=setInterval(()=>{let changed=false;for(const[token,s]of sessions){if(Date.now()-s.seen>30000){streams.get(token)?.end();streams.delete(token);sessions.delete(token);changed=true;}else if(streams.has(token))streams.get(token).write(': heartbeat\n\n');}if(changed)peers();},10000);timer.unref();server.on('close',()=>clearInterval(timer));return server;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const port=Number(process.env.PORT)||3000;createVillageServer().listen(port,'0.0.0.0',()=>console.log(`모스라이트 마을: http://localhost:${port}`));}
