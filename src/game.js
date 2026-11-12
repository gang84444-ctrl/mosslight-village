export const SHOP = { flower: { name: '들꽃 화분', price: 30, icon: '✿' }, bench: { name: '나무 벤치', price: 80, icon: '▤' }, lamp: { name: '별빛 가로등', price: 100, icon: '☼' } };
export const TREES = [ [-10,-5],[-8,-9],[-4,-11],[2,-11],[7,-9],[11,-5],[12,1],[-12,1],[-10,7],[9,7] ].map(([x,z],i)=>({id:`tree-${i}`,x,z}));
export const BUILDINGS = [{x:-5,z:-4,r:2.8},{x:5,z:-5,r:2.8},{x:0,z:-9,r:2}];
export const OBSTACLES = [...BUILDINGS,...TREES.map(t=>({...t,r:0.7})),{x:0,z:0,r:1.35}];
export function createState() { return { version:1, name:'여행자', color:'#eaa06c', coins:120, fruit:0, player:{x:0,z:5}, harvested:{}, decor:[], talked:[], claimed:false }; }
export function walkable(x,z,obstacles=OBSTACLES) {
  return Number.isFinite(x) && Number.isFinite(z) && x*x+z*z<14.7**2 && !obstacles.some(o=>Math.hypot(x-o.x,z-o.z)<o.r+0.35);
}
export function move(s,dx,dz,obstacles=OBSTACLES) {
  const {x,z}=s.player;
  if(walkable(x+dx,z,obstacles)) s.player.x+=dx;
  if(walkable(s.player.x,z+dz,obstacles)) s.player.z+=dz;
}
export function harvest(s,t,now=Date.now()) {
  if(Math.hypot(s.player.x-t.x,s.player.z-t.z)>2.6 || (s.harvested[t.id]!==undefined && now-s.harvested[t.id]<60000)) return false;
  s.harvested[t.id]=now; s.fruit++; s.coins+=25; return true;
}
export function place(s,type,x,z,obstacles=OBSTACLES) {
  const item=SHOP[type];
  if(!item || s.coins<item.price || !walkable(x,z,obstacles) || s.decor.length>=80 || s.decor.some(d=>Math.hypot(d.x-x,d.z-z)<1.3)) return false;
  s.coins-=item.price; s.decor.push({type,x,z}); return true;
}
export function restore(raw) {
  const s=createState(); let v;
  try { v=JSON.parse(raw); } catch { return s; }
  if(!v || typeof v!=='object') return s;
  for(const key of ['coins','fruit']) if(Number.isSafeInteger(v[key])&&v[key]>=0&&v[key]<=1e7) s[key]=v[key];
  if(typeof v.name==='string') s.name=v.name.replace(/[<>\x00-\x1f]/g,'').slice(0,12)||s.name;
  if(/^#[0-9a-f]{6}$/i.test(v.color)) s.color=v.color;
  if(v.player&&walkable(v.player.x,v.player.z)) s.player={x:v.player.x,z:v.player.z};
  if(Array.isArray(v.decor)) s.decor=v.decor.filter(d=>d&&SHOP[d.type]&&walkable(d.x,d.z)).slice(0,80).map(({type,x,z})=>({type,x,z}));
  if(v.harvested&&typeof v.harvested==='object') for(const t of TREES) if(Number.isFinite(v.harvested[t.id])) s.harvested[t.id]=v.harvested[t.id];
  if(Array.isArray(v.talked)) s.talked=[...new Set(v.talked.filter(x=>['momo','bori','lulu'].includes(x)))];
  s.claimed=v.claimed===true; return s;
}
