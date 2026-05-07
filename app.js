// === CANVAS ===
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// === ASSETS PLACEHOLDER ===
const assets = {};
const assetList = [
  {name:"player", src:"assets/player.png"},
  {name:"girlfriend", src:"assets/girlfriend.png"},
  {name:"enemy", src:"assets/enemy.png"},
  {name:"npc", src:"assets/npc.png"},
  {name:"bg1", src:"assets/background1.png"},
  {name:"bg2", src:"assets/background2.png"},
  {name:"bg3", src:"assets/background3.png"}
];

assetList.forEach(a=>{
  assets[a.name] = new Image();
  assets[a.name].src = a.src;
  assets[a.name].onerror = ()=>{
    console.warn(`⚠️ Imagen no encontrada: ${a.src}`);
  };
});

// === VARIABLES ===
let player = {x:100,y:0,w:70,h:70,vy:0,jump:false};
let level=0;
let cameraX=0;
let lives=3;
let ground = canvas.height-150;

const levels = [
  {name:"Disney 💖", text:"Disney: el día donde ella me pidió ser su novio", start:0, end:2000},
  {name:"Crucero 🚢", text:"Crucero: entendí que quiero todo contigo", start:2000, end:4000},
  {name:"Disney 2 ✨", text:"Disney otra vez: nuestro futuro juntos", start:4000, end:6000}
];

const npcs = [
  {x:300,text:"💖 Jonayliz es hermosa"},
  {x:900,text:"💖 Te amo más que ayer pero no más que mañana"},
  {x:2500,text:"💖 Contigo todo tiene sentido"},
  {x:4500,text:"💖 Eres mi destino"}
];

const enemies=[];
for(let i=0;i<50;i++){
  enemies.push({x:i*220+500, y:ground-50, w:60, h:60, dir:1, speed:1+Math.random()*2});
}

// Plataformas
const platforms=[{x:0,y:ground,w:7000,h:20},{x:7200,y:ground-100,w:3000,h:20}];

// === CONTROLES ===
let right=false,left=false;
document.addEventListener("keydown",e=>{
  if(e.key==="ArrowRight") right=true;
  if(e.key==="ArrowLeft") left=true;
  if(e.key===" ") jump();
});
document.addEventListener("keyup",e=>{
  if(e.key==="ArrowRight") right=false;
  if(e.key==="ArrowLeft") left=false;
});

function jump(){if(!player.jump){player.vy=-16; player.jump=false;}}

// === DIBUJO ===
function drawPlayer(){
  if(assets.player.complete) ctx.drawImage(assets.player,player.x,player.y,player.w,player.h);
  else { ctx.fillStyle="blue"; ctx.fillRect(player.x,player.y,player.w,player.h); }
}
function drawEnemy(e){
  if(assets.enemy.complete) ctx.drawImage(assets.enemy,e.x,e.y,e.w,e.h);
  else { ctx.fillStyle="red"; ctx.fillRect(e.x,e.y,e.w,e.h); }
}
function drawNPC(n){
  if(assets.npc.complete) ctx.drawImage(assets.npc,n.x,ground-30,60,60);
  else { ctx.fillStyle="pink"; ctx.fillRect(n.x,ground-30,60,60); }
}
function drawPlatform(p){ctx.fillStyle="#654321"; ctx.fillRect(p.x,p.y,p.w,p.h);}
function drawBackground(){
  if(assets["bg"+(level+1)] && assets["bg"+(level+1)].complete){
    ctx.drawImage(assets["bg"+(level+1)],0,0,canvas.width,canvas.height);
  } else {
    ctx.fillStyle="#aaddff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }
}

// === GAME LOOP ===
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();

  // Movimiento jugador
  if(right) player.x+=6;
  if(left) player.x-=6;
  player.vy+=0.9;
  player.y+=player.vy;

  // Plataformas
  player.jump=true;
  platforms.forEach(p=>{
    if(player.x+player.w>p.x && player.x<p.x+p.w && player.y+player.h>p.y && player.y+player.h<p.y+p.h+10 && player.vy>=0){
      player.y=p.y-player.h;
      player.vy=0;
      player.jump=false;
    }
  });

  // Cámara
  cameraX+=(player.x-cameraX-300)*0.08;
  ctx.save(); ctx.translate(-cameraX,0);

  // Enemigos
  enemies.forEach(e=>{
    e.x+=e.dir*e.speed;
    if(e.x>cameraX+canvas.width) e.dir=-1;
    if(e.x<cameraX) e.dir=1;
    drawEnemy(e);

    if(player.x<e.x+e.w && player.x+player.w>e.x && player.y<e.y
