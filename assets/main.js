
(function(){
const A={"cloth": "assets/tex/cloth.jpg", "detail": "assets/tex/paper_detail.jpg", "nrm": "assets/tex/paper_normal.jpg", "ragn": "assets/tex/rag_normal.jpg", "rag": "assets/tex/rag.jpg", "wood": "assets/tex/wood.jpg", "glass": "assets/props/glass.webp", "market": "assets/props/market.webp", "night": "assets/props/night.webp", "post": "assets/props/post.webp", "tide": "assets/props/tide.webp", "work": "assets/props/work.webp"};let META;
const D=Math.PI/180,TAN=Math.tan(30*D),R=3,H=3.3,FL=.05,$=id=>document.getElementById(id),html=document.documentElement;
const PH=matchMedia('(pointer:coarse)').matches,PORT=innerWidth/innerHeight<.9;
const CH=[
{n:'The Workbench',num:'one',wall:'#c9973f',floor:'#4a7862',ink:'#7a4d14',sx:-.6,t:"Hello, I'm Odile!",b:["I'm a *paper engineer*. I fold, score",'and glue little worlds that stand','up when you open a book.','','Every one of them started flat, on','this table: *4,000 sheets* so far.']},
{n:'The Tide Book',num:'two',wall:'#3f7f7b',floor:'#d6c29a',ink:'#24585a',sx:-.62,t:'My first book',b:["A lighthouse keeper's daughter, a",'boat with a paper sail and *forty-*','*one waves* that all had to fold flat.','','It took me a year to make the sea','lie down. Published *2014*.']},
{n:'The Night Orchard',num:'three',wall:'#3d4672',floor:'#3f553b',ink:'#2e3766',sx:-.62,t:'Bedtime books',b:['Lanterns that open when the page','does. An owl who turns his head','when you pull the tab.','','Small hands are rough, so every','hinge is tested *500 times*.']},
{n:'Market Street',num:'four',wall:'#c4583f',floor:'#a59b90',ink:'#8c3523',sx:.62,t:'Commissions',b:["A street of shops for a bakery's",'*hundredth birthday*. A tram for a','museum. A whole town for a wedding.','','If it can be drawn, it can','usually be *folded*.']},
{n:'The Glasshouse',num:'five',wall:'#8aa27a',floor:'#b8744e',ink:'#45603c',sx:.62,t:'Workshops',b:['Every spring I teach folding in an','old glasshouse. Bring scissors,','leave with a *fern that stands up*.','','Saturdays, March to May.','Ages *6 to 96*.']},
{n:'The Post Room',num:'six',wall:'#c27a86',floor:'#3e6a68',ink:'#8a3a4c',sx:-.62,t:'Write to me',b:['Commissions, workshops, or just','a letter. I read every one and I','always *reply on paper*.','','*hello@foldworld.studio*','Studio 3, Rope Walk Yard']}];
const CARDS={
odile0:['Odile Penhallow','Paper engineer, ex-architect, keeper of one very good pair of scissors. She has made *nineteen* pop-up books since 2014.'],
lamp:['The arm lamp','Rescued from a skip in 2012. Every book in this room was cut under it, mostly after dark.'],
cat:['Mouse, studio cat','Head of quality control. Has sat on every prototype. Approves of *none* of them.'],
shelf:['The take-apart shelf','Old pop-up books bought at fairs, taken apart very gently, and put back together. That is how you learn.'],
lighthouse:['The lighthouse fold','The first pop-up I ever got right: four layers and one V-fold, and the light *swings out* as the page opens.'],
odile1:['Row, row','The girl in The Tide Book rows out to her father every night with a paper lamp. Children still write to ask if she got there.'],
whale:['Forty-one waves','Every wave is its own strip on a hidden slide. Pull the tab and the whole sea *rolls*.'],
owl:['The pull-tab owl','A paper wheel behind the page turns his head *a quarter turn* when you pull. His name is Professor.'],
odile2:['Lantern pages','The lantern opens into a six-sided paper globe as the page turns. The hardest fold in the whole book.'],
fox:['Sleeping fox','The fox has never once woken up, in any printing. That was on purpose.'],
tram:['The museum tram','For a city transport museum: a tram that *rolls along a paper track* as you turn the page.'],
bakery:['A hundred years of bread','A bakery asked for its street as it looked in 1925. Every window opens, with a loaf behind each one.'],
odile3:['Commissions are open','Books, invitations, shop windows: anything that ought to *stand up*. Spring dates are filling.'],
can:['Saturday workshops','Two hours, one fern, all ages. Scissors, paper and tea provided. Bring nothing but *patience*.'],
sun:['The tallest fold','This sunflower stands *30 cm* tall from a flat page. It took eleven tries and a lot of tape.'],
odile4:['Growing paper','Each workshop ends with a little paper garden that folds flat into an envelope to take home.'],
odile5:['Write to me','*hello@foldworld.studio*, or post it to Studio 3, Rope Walk Yard. Every letter gets read.'],
dove:['Replies by paper','Every letter gets a folded reply. Some of them *stand up* when you open them.'],
desk:['The letter desk','An old typewriter for addresses, because handwriting on a thousand envelopes is a lot.']};

/* ---------- renderer & scene ---------- */
const cv=$('gl'),ren=new THREE.WebGLRenderer({canvas:cv,antialias:true});
ren.setPixelRatio(Math.min(devicePixelRatio||1,1.5));ren.setSize(innerWidth,innerHeight,false);
ren.shadowMap.enabled=true;ren.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene(),BG='#77624f';scene.background=new THREE.Color(BG);scene.fog=new THREE.Fog(BG,14,34);
const cam=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.1,80);
scene.add(new THREE.HemisphereLight('#fff5e6','#7a6552',.95));
const key=new THREE.DirectionalLight('#fff0db',.95);key.position.set(-4.2,8.5,6.5);key.target.position.set(0,.9,.4);key.castShadow=true;
key.shadow.mapSize.set(PH?1024:2048,PH?1024:2048);Object.assign(key.shadow.camera,{left:-4.6,right:4.6,top:4.6,bottom:-4.6,near:2,far:24});key.shadow.bias=-.0006;key.shadow.radius=3;
scene.add(key,key.target);
const fill=new THREE.DirectionalLight('#dfe7ff',.3);fill.position.set(6,3,4);scene.add(fill);

/* ---------- helpers ---------- */
const TL=new THREE.TextureLoader(),LT=u=>{const t=TL.load(u);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;return t};
const detail=LT(A.detail),nrm=LT(A.nrm),ragI=new Image();ragI.src=A.rag;
function worldUV(g,s=.62){const p=g.attributes.position,n=g.attributes.normal,uv=new Float32Array(p.count*2);for(let i=0;i<p.count;i++){const ax=Math.abs(n.getX(i)),ay=Math.abs(n.getY(i)),az=Math.abs(n.getZ(i));let u,v;if(ay>=ax&&ay>=az){u=p.getX(i);v=p.getZ(i)}else if(ax>=az){u=p.getZ(i);v=p.getY(i)}else{u=p.getX(i);v=p.getY(i)}uv[2*i]=u*s;uv[2*i+1]=v*s}g.setAttribute('uv',new THREE.BufferAttribute(uv,2));return g}
const mc={},M=c=>mc[c]||(mc[c]=new THREE.MeshStandardMaterial({color:new THREE.Color(c).multiplyScalar(1.14),map:detail,normalMap:nrm,normalScale:new THREE.Vector2(.5,.5),roughness:.94}));
const PINK='#ff4f8b',pinkM=new THREE.MeshStandardMaterial({color:PINK,roughness:.7,emissive:'#ff2f78',emissiveIntensity:.12});
function ex(s,d,c){const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false,curveSegments:16});g.translate(0,0,-d/2);worldUV(g);const m=new THREE.Mesh(g,M(c));m.castShadow=m.receiveShadow=true;return m}
function prof(hw,fn,n,y0){const s=new THREE.Shape();s.moveTo(-hw,y0);for(let i=0;i<=n;i++){const x=-hw+2*hw*i/n;s.lineTo(x,fn(x))}s.lineTo(hw,y0);s.closePath();return s}
function layer(b,z,c,fn,o={}){const hw=z*TAN-.004,s=prof(hw,fn,o.n||80,FL);(o.holes||[]).forEach(h=>s.holes.push(h));const m=ex(s,.022,c);m.position.z=z;b.add(m);return m}
const at=(o,x,z,y=FL,ry=0)=>(o.position.set(x,y,z),o.rotation.y=ry*D,o);
function onWall(o,side,s,y,off=.025){const dx=side*Math.sin(30*D),dz=Math.cos(30*D),nx=-side*Math.cos(30*D),nz=Math.sin(30*D);o.position.set(dx*s+nx*off,y,dz*s+nz*off);o.rotation.y=Math.atan2(nx,nz);return o}
function rectHole(x,y,w,h){const p=new THREE.Path();p.moveTo(x,y);p.lineTo(x+w,y);p.lineTo(x+w,y+h);p.lineTo(x,y+h);p.closePath();return p}
const bx=(w,h,d,c)=>{const m=new THREE.Mesh(worldUV(new THREE.BoxGeometry(w,h,d)),M(c));m.castShadow=m.receiveShadow=true;return m};
const pick_=[],AT={},GEO={},PM={};
['glass','market','night','post','tide','work'].forEach(k=>{const t=TL.load(A[k]);t.anisotropy=8;AT[k]=t});
function pgeo(an,nm){const k=an+'/'+nm;if(GEO[k])return GEO[k];const p=META[an][nm];if(!p)return null;const a=p.aspect,V=([x,y])=>new THREE.Vector2((x-.5)*a,y);
 const shapes=p.shapes.map(s=>{const sh=new THREE.Shape(s.o.map(V));s.h.forEach(h=>sh.holes.push(new THREE.Path(h.map(V))));return sh});
 const g=new THREE.ExtrudeGeometry(shapes,{depth:.03,bevelEnabled:false});g.translate(0,0,-.015);
 const pos=g.attributes.position,uv=g.attributes.uv,[u0,v0,u1,v1]=p.uv;
 for(let i=0;i<pos.count;i++)uv.setXY(i,u0+(pos.getX(i)/a+.5)*(u1-u0),v0+pos.getY(i)*(v1-v0));
 return GEO[k]=g}
function mk(an,nm,h,card){const g=new THREE.Group(),pg=pgeo(an,nm);if(!pg)return g;
 const m=new THREE.Mesh(pg,PM[an]||(PM[an]=new THREE.MeshStandardMaterial({map:AT[an],alphaTest:.5,roughness:.9,normalMap:nrm,normalScale:new THREE.Vector2(.3,.3)})));
 m.castShadow=m.receiveShadow=true;g.add(m);g.scale.setScalar(h);g.userData={card,sw:Math.random()*6,an,nm};return g}

/* ---------- signs ---------- */
const nolig=t=>t.replace(/f([ilf])/g,'f\u200c$1');
function signTex(c){const W=1100,Hh=760,v=document.createElement('canvas');v.width=W;v.height=Hh;const x=v.getContext('2d');
 x.fillStyle='#ece2cd';x.fillRect(0,0,W,Hh);if(ragI.complete&&ragI.naturalWidth){x.fillStyle=x.createPattern(ragI,'repeat');x.fillRect(0,0,W,Hh)}x.strokeStyle='rgba(42,38,34,.32)';x.lineWidth=3;x.strokeRect(26,26,W-52,Hh-52);
 x.fillStyle=c.ink;x.font='600 70px "Pixelify Sans",monospace';x.fillText(nolig(c.t),64,136);x.fillStyle=PINK;x.fillRect(64,158,120,7);
 let y=236;x.font='700 47px Gaegu,cursive';
 for(const line of c.b){if(!line){y+=26;continue}let cx=64;
  line.split(/(\*[^*]+\*)/).forEach(seg=>{if(!seg)return;const hl=seg[0]=='*',s=nolig(hl?seg.slice(1,-1):seg);x.fillStyle=hl?'#d8336f':'#2a2622';x.fillText(s,cx,y);cx+=x.measureText(s).width});y+=62}
 x.fillStyle='rgba(42,38,34,.55)';x.font='500 30px "Pixelify Sans",monospace';const ct='chapter '+c.num;x.fillText(ct,W-64-x.measureText(ct).width,Hh-56);
 const t=new THREE.CanvasTexture(v);t.anisotropy=8;return t}
function sign(c){const w=PORT?1.5:1.36,h=w*760/1100,g=new THREE.Group();
 const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,.02),new THREE.MeshStandardMaterial({map:signTex(c),roughness:.95}));m.position.y=-h/2-.08;m.castShadow=m.receiveShadow=true;g.add(m);
 for(const s of[-.42,.42]){const t=new THREE.Mesh(new THREE.CylinderGeometry(.005,.005,.11,5),pinkM);t.position.set(s*w,-.045,0);g.add(t);const p=new THREE.Mesh(new THREE.SphereGeometry(.026,12,8),pinkM);p.position.set(s*w,-.1,.02);g.add(p)}
 return g}
function thread(b,z,y,sag){const hw=z*TAN-.03,pts=[];for(let i=0;i<=24;i++){const t=i/24;pts.push(new THREE.Vector3(-hw+2*hw*t,y-sag*4*t*(1-t),z))}
 const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),48,.0065,5),pinkM);b.add(m);return hw}
function bunting(b,hw,z,y,cols,gap){const tri=new THREE.Shape();tri.moveTo(-.075,0);tri.lineTo(.075,0);tri.lineTo(0,-.15);tri.closePath();let i=0;
 for(let x=-hw+.12;x<hw-.08;x+=.2){if(Math.abs(x-gap)<.78)continue;const t=(x+hw)/(2*hw),m=ex(tri,.008,cols[i++%cols.length]);m.position.set(x,y-.13*4*t*(1-t),z);b.add(m)}}

/* ---------- chapter data ---------- */
const sea=(base,ph)=>x=>base+.06*Math.sin(x*7.5+ph)+.02*Math.sin(x*17+ph);
const hill=(base,amp,f,ph)=>x=>base+amp*Math.sin(x*f+ph);
const grid=(z,c0,r0,x0,y0,w,h,gx,gy)=>{const hw=z*TAN,a=[];for(let i=0;i<c0;i++)for(let j=0;j<r0;j++)a.push(rectHole(-hw+x0+i*gx,y0+j*gy,w,h));return a};
const SKY=(o)=>x=>o+.4*((Math.floor((x+3)*4.5)*7)%5)/4;
const PR=[
{layers:[[.85,'#a9782d',()=>2.35,{n:4,holes:grid(.85,8,11,.1,.5,.044,.044,.155,.155)}]],
 extra:b=>{const t=bx(1.3,.045,.46,'#e5d8bf');at(t,.22,1.55,.55);b.add(t);for(const s of[-.58,.58]){const l=bx(.04,.5,.42,'#d7c7aa');at(l,.22+s,1.55,FL+.25);b.add(l)}for(const[sd,s,y]of[[-1,1.75,1.55],[1,1.9,1.3]]){const sh=bx(.62,.035,.2,'#e5d8bf');onWall(sh,sd,s,y,.11);b.add(sh)}},
 props:[['work','lamp',.8,.6,1.58,.575,-12,'lamp'],['work','pencils',.36,-.18,1.6,.575,6],['work','teacup2',.2,.17,1.66,.575,-8],['work','cactus2',.3,-.42,1.52,.575,10],['work','scissors2',.36,-.18,.87,1.55],['work','spool2',.26,.2,.87,1.75],['work','pencils2',.3,.08,.87,1.05],['work','odile_cut',1,-.42,2.2,FL,8,'odile0'],['work','cat',.56,.66,2.3,FL,-14,'cat'],['work','books2',.44,-1.02,2.5,FL,22,'shelf'],['work','spool',.36,1.12,2.62,FL,-26],['work','books',.38,0,0,1.573,0,null,{w:[-1,1.6,.12]}],['work','cactus',.32,0,0,1.573,0,null,{w:[-1,1.9,.12]}],['work','teacup',.2,0,0,1.318,0,null,{w:[1,1.75,.12]}],['work','crane2',.36,0,0,1.318,0,null,{w:[1,2.05,.12]}],['work','lamp2',.5,0,0,2.25,0,null,{w:[1,1,.03]}],['work','crane',.34,.95,2.85,2.3]]},
{layers:[[.78,'#7f9a72',x=>.45+.25*Math.exp(-(((x-.24)/.22)**2))],[1.22,'#24566b',sea(.5,0),{rock:1}],[1.62,'#3f8b98',sea(.44,1.7),{rock:2}],[2.05,'#2f6f86',sea(.36,3.4),{rock:3}],[2.42,'#4f9ca3',sea(.27,5),{rock:4}]],props:[['tide','lighthouse2',1.45,.24,.93,.5,0,'lighthouse'],['tide','sailboat',.72,-.36,1.42,.2,8,null,{bob:1}],['tide','whale',.55,.58,1.85,.14,-6,'whale',{bob:2}],['tide','buoy2',.32,-.82,1.82,.2],['work','odile_row',.8,-.5,2.62,FL,6,'odile1'],['tide','hut',.78,1,2.6,FL,-24],['tide','crab',.22,.32,2.82],['tide','starfish',.2,-.05,2.78],['tide','rowboat2',.3,.5,2.5,FL,-18],['tide','starfish2',.16,1.38,2.86],['tide','gull',.3,.62,2.85,2.2],['tide','gull2',.26,1.2,2.85,2.35]]},
{layers:[[.75,'#26384a',hill(.85,.22,3.2,0)],[1.25,'#2d4a3d',hill(.62,.16,4.2,2.1)],[1.85,'#3a5a40',hill(.4,.12,5.2,4.2)],[2.5,'#4a6a43',hill(.18,.05,6.2,6.3)]],props:[['night','moon',.62,0,0,2.05,0,null,{w:[-1,1.45,.04]}],['night','poplar',1.05,.28,1.05,.42],['night','poplar2',.85,-.32,.98,.5],['night','appletree',1,-.55,1.55,.28,6],['night','appletree2',.86,.7,1.98,.2,-10],['night','owl2',.46,0,0,1.35,0,'owl',{w:[1,1.65,.06]}],['night','toadstools',.3,.22,2.75,FL,-6],['night','fox',.32,.92,2.6,FL,-22,'fox'],['night','hedgehog',.24,-1,2.66,FL,18],['night','rabbit2',.36,-.68,2.22,FL,12],['work','odile_lantern2',1,-.08,2.3,FL,0,'odile2'],['night','lantern',.42,.55,2.85,2.2]]},
{layers:[[.72,'#e6d6ba',SKY(1.5),{n:130}],[1.05,'#2f5f5c',SKY(.9),{n:130}]],props:[['market','townhouse',1.28,.32,1.32,FL,-4],['market','bakery',1.12,-.42,1.45,FL,6,'bakery'],['market','townhouse2',1.18,-.98,1.92,FL,24],['market','bakery2',1.02,1,1.98,FL,-26],['market','tram',.56,0,2.18,FL+.012,0,'tram',{slide:1}],['market','streetlamp',1,-.72,2.5],['work','odile_wave2',.96,-.3,2.58,FL,4,'odile3'],['market','bicycle',.4,.66,2.6,FL,-12],['market','flowercart',.5,-1.14,2.76,FL,24],['market','dog',.3,.28,2.8,FL,-10],['market','pigeon',.17,-.02,2.92,FL,14],['market','fruitstall2',.42,1.24,2.78,FL,-30]]},
{layers:[[.8,'#5f7d55',x=>1.25+.12*Math.abs(Math.sin(x*9))+.08*Math.sin(x*3)],[1.15,'#76955f',x=>.55+.1*Math.abs(Math.sin(x*12+1))]],props:[['glass','monstera',.74,-.45,1.32,FL,8],['glass','fern',.6,.38,1.2,FL,-6],['glass','sunflower',1.12,-.12,1.62,FL,0,'sun'],['glass','sunflower2',.95,.22,1.85,FL,-4,'sun'],['glass','cactustall',.68,.72,1.78,FL,-14],['glass','monstera2',.64,-.86,2.02,FL,20],['glass','mushroom',.28,-.38,2.1,FL,4],['glass','wheelbarrow',.38,.58,2.18,FL,-18],['work','odile_water',.86,-.3,2.66,FL,4,'odile4'],['glass','wateringcan2',.3,.5,2.72,FL,-14,'can'],['glass','snail',.17,.08,2.86],['glass','fern2',.5,1.2,2.66,FL,-28],['glass','mushroom2',.24,-1.12,2.78,FL,24],['glass','butterfly',.26,-.4,1.5,1.95],['glass','butterfly2',.26,.45,1.5,1.95]]},
{layers:[[.95,'#e9dfcb',()=>2.3,{n:4,holes:grid(.95,4,5,.07,.62,.28,.28,.4,.34)}]],props:[['post','stoolplant',.56,-.52,1.45,FL,8],['post','desk2',.72,.42,1.5,FL,-8,'desk'],['work','odile_post',1.06,-.22,2.32,FL,4,'odile5'],['post','satchel',.3,.72,2.5,FL,-14],['post','parcel2',.28,1.08,2.74,FL,-26],['post','parcel',.24,1.06,2.74,FL+.25,-20],['post','letters',.22,.28,2.82,FL,-6],['post','letters2',.2,-1.02,2.72,FL,22],['post','stoolplant2',.48,-.95,2.1,FL,22],['post','dove2',.36,0,0,1.55,0,null,{w:[1,1.75,.06]}],['post','dove',.3,.85,2.85,2.3,0,'dove']]}];
const bunt=[['#ff4f8b','#efe5d1','#3f7f7b','#e0a43c'],['#efe5d1','#24566b',PINK],['#f0d58a','#8a96c8',PINK],[PINK,'#e9a447','#efe5d1','#3f7f7b'],['#ede4d2',PINK,'#5f7d55'],[PINK,'#efe5d1','#3e6a68']];

/* ---------- build the book ---------- */
const book=new THREE.Group();scene.add(book);const anims=[],sway=[];
function floorSector(b,c){const s=new THREE.Shape();s.moveTo(0,.02);for(let i=0;i<=24;i++){const a=(-30+60*i/24)*D;s.lineTo(Math.sin(a)*(R+.01),Math.cos(a)*(R+.01))}s.closePath();
 const g=new THREE.ExtrudeGeometry(s,{depth:FL,bevelEnabled:false,curveSegments:4});g.rotateX(Math.PI/2);g.translate(0,FL,0);worldUV(g,.5);const m=new THREE.Mesh(g,M(c));m.receiveShadow=true;b.add(m)}
function fireflies(b){const N=PH?26:44,pos=new Float32Array(N*3),sd=[];for(let i=0;i<N;i++){const z=.9+Math.random()*1.9;sd.push([(Math.random()*2-1)*z*TAN*.9,.35+Math.random()*1.9,z,Math.random()*6])}
 const c=document.createElement('canvas');c.width=c.height=64;const cx=c.getContext('2d'),g=cx.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,240,200,.6)');g.addColorStop(1,'rgba(255,220,150,0)');cx.fillStyle=g;cx.fillRect(0,0,64,64);
 const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.BufferAttribute(pos,3));const pm=new THREE.PointsMaterial({map:new THREE.CanvasTexture(c),color:'#ffe08a',size:.09,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}),fp=new THREE.Points(ge,pm);fp.frustumCulled=false;b.add(fp);
 anims.push(t=>{for(let i=0;i<N;i++){const[x,y,z,p]=sd[i];pos[i*3]=x+Math.sin(t*.5+p)*.08;pos[i*3+1]=y+Math.sin(t*.7+p*2)*.07;pos[i*3+2]=z+Math.cos(t*.4+p)*.06}ge.attributes.position.needsUpdate=true;pm.opacity=.75+.25*Math.sin(t*3)})}
function build(){
 const base=new THREE.Mesh(new THREE.CylinderGeometry(R+.32,R+.32,.02,96),M('#e6dac2'));base.position.y=-.01;base.receiveShadow=true;book.add(base);
 const band=new THREE.Mesh(new THREE.CylinderGeometry(R+.32,R+.36,.12,96,1,true),new THREE.MeshStandardMaterial({color:'#2c5653',roughness:.8,side:THREE.DoubleSide}));band.position.y=-.06;book.add(band);
 const sp=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,H,16),M('#2c5653'));sp.position.y=H/2;sp.castShadow=true;book.add(sp);
 CH.forEach((c,k)=>{
  const b=new THREE.Group();b.rotation.y=k*60*D;book.add(b);floorSector(b,c.floor);
  for(const sd of[-1,1]){ // the two page walls of this bay
   const dx=sd*Math.sin(30*D),dz=Math.cos(30*D),nx=-sd*Math.cos(30*D),nz=Math.sin(30*D);
   const w=new THREE.Mesh(worldUV(new THREE.BoxGeometry(R,H,.02)),M(c.wall));w.position.set(dx*R/2+nx*.016,H/2,dz*R/2+nz*.016);w.rotation.y=Math.atan2(-dz,dx);w.castShadow=w.receiveShadow=true;b.add(w)}
  const d=PR[k];
  d.layers.forEach(([z,col,fn,o={}])=>{const m=layer(b,z,col,fn,o);if(o.rock)anims.push(t=>{m.rotation.x=Math.sin(t*.9+o.rock)*.035;m.position.x=Math.sin(t*.7+o.rock*2)*.012})});
  if(k==1){const s=new THREE.Shape();s.absarc(0,0,.34,0,6.2832);const sun=ex(s,.02,'#e9a447');sun.position.set(.9,2.3,.7);b.add(sun)}
  if(k==5){const r=Math.random;for(let i=0;i<4;i++)for(let j=0;j<5;j++){if(r()<.3)continue;const e=mk('post',r()<.5?'envelope':'envelope2',.14+r()*.05);at(e,-.95*TAN+.07+i*.4+.14+(r()-.5)*.04,.89,.63+j*.34,0);b.add(e)}}
  if(k==2)fireflies(b);
  if(k==5)[['plane',0],['plane2',Math.PI]].forEach(([n,p0])=>{const pl=mk('post',n,.24),h=new THREE.Group();h.add(pl);b.add(h);anims.push(t=>{const a=t*.55+p0;h.position.set(Math.sin(a)*.62,1.95+Math.sin(a*2)*.12,1.75+Math.cos(a)*.45);h.rotation.y=a+Math.PI*1.5;h.rotation.z=Math.sin(a*2)*.15})});
  if(d.extra)d.extra(b);
  d.props.forEach(([an,n,h,x,z,y,ry,card,o])=>{const p=at(mk(an,n,h,card?CARDS[card]:null),x,z,y==null?FL:y,ry||0);p.userData.bay=k;b.add(p);
   if(o&&o.w)onWall(p,o.w[0],o.w[1],y,o.w[2]);
   if(n.startsWith('odile'))sway.push(p);
   if(n=='odile_lantern2'){const L=new THREE.PointLight('#ffc46b',1.1,2.6,1.6);L.position.set(.27,.5,.12);p.add(L);anims.push(t=>{L.intensity=1.1*(.85+Math.sin(t*7)*.05+Math.sin(t*13.3)*.04)})}
   if(o&&o.bob)anims.push(t=>{p.position.y=y+Math.sin(t*(o.bob==1?1.3:.8)+o.bob)*(o.bob==1?.035:.05);if(o.bob==1)p.rotation.z=Math.sin(t*1.1)*.06});
   if(o&&o.slide)anims.push(t=>{p.position.x=Math.sin(t*.32)*.32})});
  const hw=thread(b,2.85,2.62,.14),sx=PORT?0:c.sx;bunting(b,hw,2.85,2.62,bunt[k],sx);
  const sg=sign(c);sg.position.set(sx,2.58,2.85);b.add(sg);sway.push(sg);
 });
}

/* ---------- table, backdrop, dust ---------- */
function scenery(){
 const t=new THREE.Mesh(new THREE.CircleGeometry(26,64),new THREE.MeshStandardMaterial({color:'#d8c8ae',roughness:.82,map:(()=>{const t=LT(A.wood);t.repeat.set(6,6);return t})()}));t.rotation.x=-Math.PI/2;t.position.y=-.12;t.receiveShadow=true;scene.add(t);
 const mat=new THREE.Mesh(new THREE.BoxGeometry(9.5,.02,7.2),M('#3b6b5a'));mat.position.set(.4,-.11,-.4);mat.rotation.y=.12;mat.receiveShadow=true;scene.add(mat);
 const pen=new THREE.Group(),body=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,5.2,6),M('#e3a63c'));body.rotation.z=Math.PI/2;
 const wood=new THREE.Mesh(new THREE.ConeGeometry(.16,.5,6),M('#e8cfa4'));wood.rotation.z=-Math.PI/2;wood.position.x=2.85;
 const lead=new THREE.Mesh(new THREE.ConeGeometry(.055,.17,6),M('#3a3633'));lead.rotation.z=-Math.PI/2;lead.position.x=3.18;
 const er=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.26,12),M('#ff7aa3'));er.rotation.z=Math.PI/2;er.position.x=-2.9;
 pen.add(body,wood,lead,er);pen.traverse(o=>o.castShadow=o.receiveShadow=true);pen.position.set(-5.3,.04,2.6);pen.rotation.y=-.95;scene.add(pen);
 const sp=new THREE.Group(),a=new THREE.Mesh(new THREE.CylinderGeometry(.75,.75,.12,40),M('#cfa874')),b=a.clone(),th=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,1.06,40),M('#ff6f9c'));
 a.position.y=.06;b.position.y=1.18;th.position.y=.6;sp.add(a,b,th);sp.traverse(o=>o.castShadow=o.receiveShadow=true);sp.position.set(5,-.12,.4);scene.add(sp);
 const N=PH?40:90,pos=new Float32Array(N*3),sd=[];for(let i=0;i<N;i++)sd.push([(Math.random()-.5)*7,Math.random()*3.2,.5+Math.random()*4.5,Math.random()*6,.3+Math.random()*.7]);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
 scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:'#fff1d6',size:.03,transparent:true,opacity:.55,depthWrite:false,blending:THREE.AdditiveBlending})));
 anims.push(t=>{for(let i=0;i<N;i++){const[x,y,z,p,s]=sd[i];pos[i*3]=x+Math.sin(t*.13*s+p)*.4;pos[i*3+1]=((y+t*.035*s)%3.4)+.05;pos[i*3+2]=z+Math.cos(t*.11*s+p)*.3}g.attributes.position.needsUpdate=true});
}

/* ---------- UI: tabs, card, zoom ---------- */
const tabs=$('tabs'),NUMS=['I','II','III','IV','V','VI'];
const S={cur:0,target:0,vel:0,last:-9,rest:0,drag:null,open:false,card:false,mx:-1,my:-1,intro:-1,zi:0,zf:1};
const now=()=>performance.now()/1000;
CH.forEach((c,i)=>{const bt=document.createElement('button');bt.textContent=NUMS[i];bt.style.background=c.wall;bt.setAttribute('aria-label','Chapter '+c.num+': '+c.n);bt.onclick=()=>goTo(i);tabs.appendChild(bt)});
function goTo(i){const cur=S.target,base=Math.round(cur);let best=base,bd=99;for(let k=base-6;k<=base+6;k++)if(((k%6)+6)%6===i&&Math.abs(k-cur)<bd){bd=Math.abs(k-cur);best=k}S.target=best;touch()}
let turned=false;function touch(){S.last=now();if(!turned&&Math.abs(S.target)>.3){turned=true;html.classList.add('turned')}}
function input(d){if(!S.open||S.card||S.colo)return;S.target+=d;touch()}
let shown=-1;function chrome(){const i=((Math.round(S.cur)%6)+6)%6;if(i===shown)return;shown=i;[...tabs.children].forEach((b,j)=>b.classList.toggle('on',j===i));$('chapname').innerHTML='<small>chapter '+CH[i].num+'</small>'+CH[i].n}
const ZOOMS=PORT?[1,.86,.74]:[1,.8,.64];
$('zin').onclick=()=>S.zi=Math.min(2,S.zi+1);$('zout').onclick=()=>S.zi=Math.max(0,S.zi-1);
const cardEl=$('card');
function openCard(p){const[t,body]=p.userData.card,c=CH[p.userData.bay];$('ch').textContent=t;$('cp').innerHTML=body.replace(/\*([^*]+)\*/g,'<em>$1</em>');$('cs').textContent='chapter '+c.num+' · '+c.n;
 $('fold').style.setProperty('--cc',c.wall);
 {const m=META[p.userData.an][p.userData.nm],[u0,v0,u1,v1]=m.uv,du=u1-u0,dv=v1-v0,ar=$('art');let w=Math.min(300,innerWidth*.6),h=w/m.aspect;if(h>170){h=170;w=h*m.aspect}
 Object.assign(ar.style,{width:w+'px',height:h+'px',backgroundImage:'url('+A[p.userData.an]+')',backgroundSize:100/du+'% '+100/dv+'%',backgroundPosition:u0/(1-du)*100+'% '+(1-v1)/(1-dv)*100+'%'})}cardEl.classList.add('on');cardEl.setAttribute('aria-hidden','false');S.card=true;setTimeout(()=>cardEl.querySelector('.x').focus({preventScroll:true}),50)}
function closeCard(){if(!S.card)return;cardEl.classList.remove('on');cardEl.setAttribute('aria-hidden','true');S.card=false;cv.focus({preventScroll:true})}
cardEl.querySelector('.x').onclick=closeCard;cardEl.querySelector('.scrim').onclick=closeCard;
const tip=$('tip'),ce=$('colophon');function openColo(){html.classList.add('colo');S.colo=true;ce.setAttribute('aria-hidden','false');tip.classList.remove('on')}
function closeColo(){if(!S.colo)return;html.classList.remove('colo');S.colo=false;ce.setAttribute('aria-hidden','true')}$('colo').onclick=openColo;$('colox').onclick=closeColo;

/* ---------- picking & input ---------- */
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
function pick(x,y){ndc.set(x/innerWidth*2-1,-(y/innerHeight)*2+1);ray.setFromCamera(ndc,cam);const h=ray.intersectObjects(book.children,true)[0];if(!h)return null;let o=h.object;while(o&&!(o.userData&&o.userData.an))o=o.parent;return o||null}
const wig=[];
function hop(p){if(!wig.some(w=>w.p===p))wig.push({p,t:0})}
addEventListener('wheel',e=>{e.preventDefault();const k=e.deltaMode==1?16:e.deltaMode==2?innerHeight:1,d=(Math.abs(e.deltaY)>Math.abs(e.deltaX)?e.deltaY:e.deltaX)*k;input(Math.max(-.5,Math.min(.5,d/240*.15)))},{passive:false});
cv.addEventListener('pointerdown',e=>{if(!S.open)return;S.drag={x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY,t:now(),id:e.pointerId,touch:e.pointerType=='touch'};S.vel=0;cv.setPointerCapture(e.pointerId);cv.style.cursor='grabbing'});
cv.addEventListener('pointermove',e=>{S.mx=e.clientX;S.my=e.clientY;const d=S.drag;
 if(!d){if(S.open&&!S.card&&!S.colo&&!PH){const p=pick(e.clientX,e.clientY);cv.style.cursor=p?'pointer':'grab';if(p!==S.hov){S.hov=p;if(p){hop(p);const n=p.userData.nm;tip.innerHTML=(n.startsWith('odile')?'Odile':n.replace(/\d$/,''))+(p.userData.card?'<i>open ↗</i>':'');tip.classList.add('on')}else tip.classList.remove('on')}tip.style.left=e.clientX+'px';tip.style.top=e.clientY+'px'}return}
 if(d.id!==e.pointerId)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;d.x=e.clientX;d.y=e.clientY;
 const k=d.touch?(-dx/innerWidth*1.5-dy/innerHeight*1.2):(-dx/innerWidth*1.7);input(k);S.vel=S.vel*.6+k*.4});
function endDrag(e){const d=S.drag;if(!d)return;S.drag=null;cv.style.cursor='grab';
 if(Math.hypot(e.clientX-d.x0,e.clientY-d.y0)<7&&now()-d.t<.6){S.vel=0;const p=pick(e.clientX,e.clientY);if(p){hop(p);if(p.userData.card)setTimeout(()=>openCard(p),160)}}}
cv.addEventListener('pointerup',endDrag);cv.addEventListener('pointercancel',endDrag);
addEventListener('keydown',e=>{if(e.key=='Escape'){closeCard();closeColo();return}if(!S.open||S.card||S.colo)return;
 if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();S.target=Math.round(S.target)+1;touch()}
 if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();S.target=Math.round(S.target)-1;touch()}});
addEventListener('resize',()=>{ren.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()});

/* ---------- open ---------- */
function open(){if(html.classList.contains('opening'))return;html.classList.add('opening');S.intro=now()+.2;setTimeout(()=>{html.classList.add('open');S.open=true;cv.focus({preventScroll:true})},1900)}
$('open').onclick=open;

/* ---------- loop ---------- */
const CAM=PORT?{pos:new THREE.Vector3(0,2.45,6.5),look:new THREE.Vector3(0,1.5,1.7),fov:47}:{pos:new THREE.Vector3(0,2.95,7.3),look:new THREE.Vector3(0,1.3,1.25),fov:34};
for(let i=0;i<6;i++)$('pop').appendChild(document.createElement('i'));
const look=new THREE.Vector3(),far=new THREE.Vector3(),pcts=$('pct'),pops=[...$('pop').children];let shownP=0,realP=0,last=now();
function loop(){const t=now(),dt=Math.min(.05,t-last);last=t;
 shownP+=(realP-shownP)*.15+(realP>shownP?.4:0);shownP=Math.min(shownP,realP);const v=Math.round(shownP);pcts.textContent=v>=100?'READY':'FOLDING '+String(v).padStart(3,'0');pops.forEach((e,i)=>e.classList.toggle('up',i<Math.floor(v/100*6+.001)));
 if(!S.drag&&Math.abs(S.vel)>1e-4){S.target+=S.vel;S.vel*=.9}
 if(!S.drag&&t-S.last>.9&&Math.abs(S.vel)<.002){if(S.snap==null){const dl=S.target-S.rest;S.snap=Math.abs(dl)<.035?S.rest:S.rest+Math.sign(dl)*Math.max(1,Math.round(Math.abs(dl)));S.rest=S.snap}S.target+=(S.snap-S.target)*(1-Math.exp(-dt*3.2))}else S.snap=null;
 S.cur+=(S.target-S.cur)*(1-Math.exp(-dt*4.6));
 let ip=S.intro>0?Math.min(1,Math.max(0,(t-S.intro)/2.4)):0;const ie=ip<.5?4*ip*ip*ip:1-Math.pow(-2*ip+2,3)/2;
 book.rotation.y=-(S.cur-(.55+.32*Math.sin(t*.32))*(1-ie))*60*D;
 S.zf+=(ZOOMS[S.zi]-S.zf)*(1-Math.exp(-dt*5));
 look.copy(CAM.look);look.y-=(1-S.zf)*.35*ie;far.set(0,Math.sin(18*D),Math.cos(18*D)).multiplyScalar(16).add(CAM.look);
 cam.position.lerpVectors(far,CAM.pos,ie);
 if(S.mx>=0&&!PH&&S.open){cam.position.x+=(S.mx/innerWidth-.5)*.35;cam.position.y-=(S.my/innerHeight-.5)*.18}
 cam.fov=(PORT?CAM.fov:Math.min(62,2*Math.atan(Math.tan(CAM.fov*D/2)*Math.max(1,1.6/(innerWidth/innerHeight)))/D))*S.zf;cam.updateProjectionMatrix();cam.lookAt(look);
 for(const p of sway)p.rotation.z=Math.sin(t*1.1+(p.userData.sw||0))*(p.userData.sw!=null?.018:.012);
 for(let i=wig.length-1;i>=0;i--){const w=wig[i];w.t+=dt;const k=Math.exp(-w.t*5);w.p.rotation.z=Math.sin(w.t*18)*.12*k;w.p.position.y+=0;w.p.scale.y=w.p.scale.x*(1+Math.sin(w.t*18)*.05*k);if(w.t>1){w.p.scale.y=w.p.scale.x;w.p.rotation.z=0;wig.splice(i,1)}}
 for(const f of anims)f(t,dt);
 chrome();ren.render(scene,cam);requestAnimationFrame(loop)}

/* ---------- boot ---------- */
(async()=>{
 try{META=await fetch('assets/props/props.json').then(r=>r.json());await Promise.race([Promise.all([document.fonts.load('600 60px "Pixelify Sans"'),document.fonts.load('700 40px Gaegu')]),new Promise(r=>setTimeout(r,2500))])}catch(e){}
 await new Promise(r=>{if(ragI.complete)r();else ragI.onload=ragI.onerror=r});realP=40;scenery();realP=70;build();realP=100;
 pops.forEach((e,i)=>e.style.background=CH[i%6].wall);
 requestAnimationFrame(loop);setTimeout(()=>html.classList.add('ready'),700);
})();
})();
