import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TREES, BUILDINGS } from './game.js';

const mats=new Map();
function mat(color){if(!mats.has(color))mats.set(color,new T.MeshStandardMaterial({color,roughness:0.92}));return mats.get(color);}
function mesh(geo,color,parent,x=0,y=0,z=0){const m=new T.Mesh(geo,mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
const box=(p,c,x,y,z,w,h,d)=>mesh(new T.BoxGeometry(w,h,d),c,p,x,y,z);
const ball=(p,c,x,y,z,r,s=12)=>mesh(new T.SphereGeometry(r,s,8),c,p,x,y,z);
const cyl=(p,c,x,y,z,a,b,h,n=12)=>mesh(new T.CylinderGeometry(a,b,h,n),c,p,x,y,z);
function group(parent,x=0,y=0,z=0){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return g;}
function label(text){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#fffdf0';ctx.beginPath();ctx.roundRect(6,6,500,110,35);ctx.fill();ctx.fillStyle='#485e48';ctx.font='600 44px sans-serif';ctx.textAlign='center';ctx.fillText(text,256,79);const tex=new T.CanvasTexture(c);const sprite=new T.Sprite(new T.SpriteMaterial({map:tex,depthTest:false}));sprite.scale.set(3.1,.78,1);return sprite;}

export function setCharacterColor(g,color){if(g.userData.color===color)return;if(!g.userData.ownBodyMaterial){g.children[0].material=g.children[0].material.clone();g.userData.ownBodyMaterial=true;}g.children[0].material.color.set(color);g.userData.color=color;}
export function character(color='#eaa06c',animal=null){
  const g=new T.Group();
  cyl(g,color,0,.68,0,.3,.36,.65);ball(g,animal?'#f4dfb9':'#f7d8b2',0,1.32,0,.43);
  ball(g,'#453d37',-.14,1.36,.38,.035);ball(g,'#453d37',.14,1.36,.38,.035);
  ball(g,'#edac9b',-.26,1.23,.33,.065);ball(g,'#edac9b',.26,1.23,.33,.065);
  if(animal){
    for(const x of [-.3,.3]){if(animal==='rabbit') {const ear=ball(g,'#f4dfb9',x,1.9,0,.18);ear.scale.y=2.2; const inner=ball(g,'#dfa6a3',x,1.92,.12,.09);inner.scale.y=2.4;}else ball(g,'#bc9775',x,1.66,0,.19);}
    ball(g,'#fff4dc',0,1.18,.38,.14);ball(g,'#58433c',0,1.27,.51,.043);
  }else {const hair=ball(g,'#664e39',0,1.52,-.05,.43);hair.scale.y=.65;cyl(g,'#e6d39a',0,1.68,0,.49,.49,.09);cyl(g,'#e6d39a',0,1.81,0,.29,.34,.23);}
  box(g,'#605544',-.18,.17,0,.2,.28,.28);box(g,'#605544',.18,.17,0,.2,.28,.28);
  const arms=[ball(g,animal?'#f4dfb9':'#f7d8b2',-.4,.76,0,.13),ball(g,animal?'#f4dfb9':'#f7d8b2',.4,.76,0,.13)];
  g.userData.arms=arms;return g;
}
export function createRoofGeometry(){const shape=new T.Shape();shape.moveTo(-2.25,0);shape.lineTo(2.25,0);shape.lineTo(0,1.6);shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:3.8,bevelEnabled:false});geo.translate(0,0,-1.9);return geo;}
function house(parent,x,z,color,roof,name,scale=1){
  const g=group(parent,x,0,z);g.scale.setScalar(scale);
  box(g,'#e7d7ad',0,.15,0,4.3,.3,3.6);box(g,color,0,1.65,0,3.9,3,3.1);
  mesh(createRoofGeometry(),roof,g,0,3.2,0);
  box(g,'#9b7354',.65,.9,1.59,.88,1.8,.12);ball(g,'#f4d980',.9,.85,1.69,.06);
  for(const a of [-1.15,1.15]){box(g,'#f9e9c7',a,1.9,1.6,.9,.95,.13);box(g,'#9cc9cb',a,1.9,1.69,.7,.74,.08);box(g,'#f9e9c7',a,1.9,1.75,.06,.8,.05);box(g,'#f9e9c7',a,1.9,1.75,.8,.06,.05);}
  box(g,'#a87d58',1.15,4.1,-.7,.5,1.4,.55);
  const sign=label(name);sign.position.set(0,4.9,0);sign.scale.multiplyScalar(.65);g.add(sign);
  for(let i=0;i<3;i++)box(g,'#c9b58b',.65,.08-i*.01,2+i*.48,1.3,.15,.4);
}
export function decoration(type){const g=new T.Group();
  if(type==='bench'){for(const x of [-.65,.65]){box(g,'#536452',x,.36,0,.13,.72,.55);box(g,'#536452',x,.85,-.24,.12,.9,.12);}box(g,'#bd8e5f',0,.65,0,1.8,.15,.62);box(g,'#c99a69',0,1.1,-.27,1.8,.4,.12);}
  if(type==='flower'){cyl(g,'#d09579',0,.2,0,.28,.2,.4);for(let i=0;i<5;i++){const a=i*2.4;const x=Math.cos(a)*.18,z=Math.sin(a)*.18;cyl(g,'#6a975b',x,.5,z,.025,.025,.55,5);for(let j=0;j<5;j++)ball(g,i%2?'#f7d683':'#f1b6bf',x+Math.cos(j*1.26)*.1,.8,z+Math.sin(j*1.26)*.1,.085,6);ball(g,'#d7a45b',x,.83,z,.06,6);}}
  if(type==='lamp'){cyl(g,'#546557',0,1.2,0,.06,.09,2.4);box(g,'#f9dba3',0,2.5,0,.4,.5,.4);const cap=cyl(g,'#526453',0,2.85,0,0,.4,.3,4);cap.rotation.y=Math.PI/4;}
  return g;
}

export function createWorld(container){
  const scene=new T.Scene();scene.background=new T.Color('#beddda');scene.fog=new T.Fog('#beddda',55,110);
  const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;container.append(renderer.domElement);
  const camera=new T.PerspectiveCamera(38,1,.1,180);camera.position.set(24,27,32);
  const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,0,0);controls.enableDamping=true;controls.minDistance=15;controls.maxDistance=57;controls.minPolarAngle=.3;controls.maxPolarAngle=1.28;controls.enablePan=false;controls.mouseButtons.LEFT=T.MOUSE.ROTATE;controls.touches.ONE=T.TOUCH.ROTATE;
  const hemi=new T.HemisphereLight('#fff7dd','#6a998c',2.5);scene.add(hemi);
  const sun=new T.DirectionalLight('#ffebc4',3.5);sun.position.set(-12,24,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-24,right:24,top:24,bottom:-24,near:.5,far:70});sun.shadow.normalBias=.035;scene.add(sun);
  const sea=mesh(new T.PlaneGeometry(220,220),'#75bcbc',scene,0,-.5,0);sea.rotation.x=-Math.PI/2;sea.receiveShadow=false;
  cyl(scene,'#d4b98b',0,-.55,0,16.5,16,1.1,64);cyl(scene,'#f1deb2',0,-.05,0,16,16.4,.48,64);cyl(scene,'#a7bf79',0,.16,0,14.9,15,.28,64);
  const ground=new T.Mesh(new T.PlaneGeometry(31,31),new T.MeshBasicMaterial({visible:false}));ground.rotation.x=-Math.PI/2;ground.position.y=.32;scene.add(ground);
  const root=group(scene,0,.31,0);
  // Sandy paths meet at the fountain square.
  box(root,'#dfcba1',0,.015,3.8,2.35,.035,17);box(root,'#dfcba1',0,.02,-1.8,15.2,.035,1.8);
  cyl(root,'#dfcba1',0,.03,0,3.2,3.2,.07,40);
  house(root,-5,-4,'#f0dfbf','#8eaa99','도토리 잡화점');house(root,5,-5,'#ecd0ac','#cf866b','바람의 집');house(root,0,-9,'#dce2c6','#7e9e93','여행자 안내소',.7);
  // Fountain with a little water, lily pads and a stone rim.
  cyl(root,'#b0b7a2',0,.23,0,1.3,1.4,.44,24);cyl(root,'#78bab7',0,.47,0,1.13,1.13,.04,32);cyl(root,'#c5c8b0',0,.82,0,.22,.33,.8);cyl(root,'#d9d8bc',0,1.2,0,.65,.4,.18);ball(root,'#96cbc8',0,1.4,0,.2);
  const fruits=[];const canopies=[];
  TREES.forEach((t,i)=>{const g=group(root,t.x,0,t.z);const scale=1+(i%3)*.12;g.scale.setScalar(scale);cyl(g,'#947556',0,1.1,0,.18,.28,2.2,8);const crown=group(g,0,0,0);for(const [x,y,z,r] of [[0,2.7,0,1.1],[-.65,2.4,0,.78],[.65,2.45,.1,.85],[0,3.25,-.1,.77]])ball(crown,i%2?'#7d9f62':'#88aa6d',x,y,z,r);canopies.push(crown);const f=group(g);for(const [x,y,z]of[[-.65,2.35,.7],[.5,2.7,.72],[.1,3.2,.6]]){ball(f,'#e5a06d',x,y,z,.17);cyl(f,'#5b7e48',x,y+.17,z,.025,.025,.1,5);}fruits.push(f);});
  // Picket fences, a vegetable garden and friendly details.
  for(const start of [-9,4])for(let i=0;i<6;i++){const x=start+i*.85;box(root,'#ede4c9',x,.62,-7,.12,1.22,.14);box(root,'#ede4c9',x+0.4,.53,-7,.85,.1,.12);box(root,'#ede4c9',x+0.4,.93,-7,.85,.1,.12);}
  for(let row=0;row<3;row++)for(let col=0;col<4;col++){const x=5+col*.6,z=2.1+row*.6;box(root,'#987957',x,.03,z,.52,.06,.52);const leaf=ball(root,'#669655',x,.24,z,.2,8);leaf.scale.y=.55;ball(root,row%2?'#dd9a5b':'#b4b673',x,.19,z,.12,8);}
  const seed=(n)=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};
  for(let i=0;i<150;i++){const a=seed(i)*Math.PI*2,r=4+seed(i+300)*10.4,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(x)<1.6||Math.abs(z+1.8)<1.2||BUILDINGS.some(b=>Math.hypot(x-b.x,z-b.z)<3))continue;const g=group(root,x,0,z);if(i%3===0){const d=decoration('flower');d.scale.setScalar(.55);g.add(d);}else{for(let j=0;j<3;j++){const blade=mesh(new T.ConeGeometry(.045,.3,3),'#7d9f62',g,j*.07,.14,0);blade.rotation.z=(j-1)*.3;}}}
  const bench=decoration('bench');bench.position.set(-3.8,0,3.3);root.add(bench);bench.rotation.y=.4;
  for(const x of [-2.2,2.2]){const lamp=decoration('lamp');lamp.position.set(x,0,6);root.add(lamp);}
  // Dock extends out over the sea.
  for(let i=0;i<12;i++)box(root,'#b6976b',0,-.18,13+i*.46,2.5,.19,.4);
  for(const x of [-1.1,1.1])for(const z of [13.2,15,17.8])cyl(root,'#9c7a52',x,-.13,z,.1,.12,1.2,8);
  const clouds=[];for(let i=0;i<7;i++){const g=group(scene,-33+i*11,14+(i%3)*2,-22-(i%2)*9);for(let j=0;j<4;j++){const b=ball(g,'#f3f4e8',j*1.5,Math.sin(j)*.5,0,1.5);b.scale.set(1.6,.45,.8);b.castShadow=false;}clouds.push(g);}
  const foam=[];for(let i=0;i<35;i++){const a=i/35*Math.PI*2;const g=mesh(new T.PlaneGeometry(.8+seed(i)*1.3,.055),'#d3e7d7',scene,Math.cos(a)*18,-.46,Math.sin(a)*18);g.rotation.x=-Math.PI/2;g.rotation.z=-a;foam.push(g);}
  const npcs=[{id:'momo',name:'모모',animal:'rabbit',color:'#b6a1c9',x:-3,z:1.7,text:'어서 와! 이 섬에서는 서두를 필요 없어. 나무 가까이에서 E를 누르면 열매를 딸 수 있어. 가구를 놓고 너만의 자리를 만들어 봐.'},{id:'bori',name:'보리',animal:'bear',color:'#83a8a0',x:7.5,z:0,text:'내 텃밭 구경 왔구나! 열매 하나는 잎사귀 25개야. 주머니에 모은 잎사귀로 벤치나 꽃을 놓아 보면 어때?'},{id:'lulu',name:'루루',animal:'rabbit',color:'#ddb078',x:-6,z:6,text:'바닷바람이 참 좋지? 오른쪽 위 사진 버튼으로 오늘의 섬을 남겨 봐. 낮과 밤 버튼으로 별이 뜨는 마을도 볼 수 있어.'}];
  npcs.forEach(n=>{n.mesh=character(n.color,n.animal);n.mesh.position.set(n.x,.31,n.z);n.mesh.rotation.y=.5;scene.add(n.mesh);const name=label(n.name);name.position.y=2.65;name.scale.multiplyScalar(.45);n.mesh.add(name);});
  const raycaster=new T.Raycaster();const pointer=new T.Vector2();
  const starsGeo=new T.BufferGeometry();const pts=[];for(let i=0;i<180;i++)pts.push((seed(i)-.5)*140,22+seed(i+190)*35,(seed(i+900)-.5)*140);starsGeo.setAttribute('position',new T.Float32BufferAttribute(pts,3));const stars=new T.Points(starsGeo,new T.PointsMaterial({color:'#fff3c7',size:.14}));scene.add(stars);stars.visible=false;
  function resize(){const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}window.addEventListener('resize',resize);resize();
  return {scene,root,renderer,camera,controls,npcs,fruits,
    pick(event){const r=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);return raycaster.intersectObject(ground)[0]?.point;},
    setNight(night){scene.background.set(night?'#243c52':'#beddda');scene.fog.color.copy(scene.background);hemi.intensity=night?1.05:2.5;sun.intensity=night?.65:3.5;sun.color.set(night?'#a8bfef':'#ffebc4');stars.visible=night;},
    animate(time){controls.update();clouds.forEach((g,i)=>{g.position.x+=.0008*(i%2?1:-1);});canopies.forEach((g,i)=>g.rotation.z=Math.sin(time*.7+i)*.025);foam.forEach((m,i)=>m.scale.x=1+Math.sin(time+i)*.2);npcs.forEach((n,i)=>{n.mesh.position.y=.31+Math.sin(time*1.7+i)*.025;});renderer.render(scene,camera);}
  };
}
