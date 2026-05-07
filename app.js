// === CANVAS ===
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// === ASSETS ===
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

let loadedAssets = 0;
assetList.forEach(a=>{
  assets[a.name] = new Image();
  assets[a.name].src = a.src;
  assets[a.name].onload = ()=>{
    loadedAssets++;
    if(loadedAssets===assetList.length){
      document.getElementById("startBtn").disabled = false;
    }
  };
});

// === VARIABLES JUEGO ===
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

// NPCs y Enemigos
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

function jump(){if(!player.jump){player.vy=-16; player.jump=true;}}

// === DIBUJO ===
function drawPlayer(){
  ctx.drawImage(assets.player,player.x,player.y,player.w,player.h);
}
function drawEnemy(e){ctx.drawImage(assets.enemy,e.x,e.y,e.w,e.h);}
function drawNPC(n){ctx.drawImage(assets.npc,n.x,ground-30,60,60);}
function drawPlatform(p){ctx.fillStyle="#654321"; ctx.fillRect(p.x,p.y,p.w,p.h);}
function drawBackground(){ctx.drawImage(assets["bg"+(level+1)],0,0,canvas.width,canvas.height);}

// === GAME LOOP ===
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();

  // Movimiento jugador
  if(right) player.x+=6;
  if(left) player.x-=6;
  player.vy+=0.9;
  player.y+=player.vy;

  // Colisión con plataformas
  player.jump=true;
  platforms.forEach(p=>{
    if(player.x+player.w>p.x && player.x<p.x+p.w && player.y+player.h>p.y && player.y+player.h<p.y+p.h+10 && player.vy>=0){
      player.y=p.y-player.h;
      player.vy=0;
      player.jump=false;
    }
  });

  // Cámara suave
  cameraX+=(player.x-cameraX-300)*0.08;
  ctx.save(); ctx.translate(-cameraX,0);

  // Enemigos animados
  enemies.forEach(e=>{
    e.x+=e.dir*e.speed;
    if(e.x>cameraX+canvas.width) e.dir=-1;
    if(e.x<cameraX) e.dir=1;
    drawEnemy(e);

    // Colisión
    if(player.x<e.x+e.w && player.x+player.w>e.x && player.y<e.y+e.h && player.y+player.h>e.y){
      lives--;
      player.x = levels[level].start+100;
      player.y = ground-50;
      if(lives<=0) gameOver();
    }
  });

  // NPCs con mensajes
  let currentDialog="";
  npcs.forEach(n=>{
    drawNPC(n);
    if(Math.abs(player.x-n.x)<200) currentDialog=n.text;
  });
  document.getElementById("dialog").innerHTML=currentDialog;

  drawPlayer();
  ctx.restore();

  // Mensaje largo arriba
  document.getElementById("storyText").innerHTML = levels[level].text;

  // Avanzar nivel
  if(player.x>levels[level].end){
    level++;
    if(level>=levels.length){ endGame(); return; }
    player.x=levels[level].start+100;
  }

  requestAnimationFrame(loop);
}

// === GAME OVER ===
function gameOver(){
  alert("Oh no 😢. Reiniciando nivel...");
  player.x = levels[level].start+100;
  player.y = ground-50;
  lives=3;
}

// === END GAME ===
function endGame(){
  document.getElementById("endScreen").style.display="flex";
  document.getElementById("loveLetter").innerHTML=
  `💌 Te amo infinitamente 💌<br>
   Estos 7 meses han sido un viaje increíble juntos.<br>
   Desde Disney, donde me pediste ser tu novio, hasta el crucero y todos nuestros recuerdos.<br>
   Jonayliz, eres mi todo y quiero que nuestro amor siga creciendo siempre.<br>
   Gracias por ser mi compañera de vida y aventuras.`;
  document.getElementById("marryBtn").onclick = ()=>{
    alert("¡Ella dijo que sí! 💍❤️");
  };
}

// === START BUTTON ===
document.getElementById("startBtn").onclick = ()=>{
  document.getElementById("intro").style.display="none";
  loop();
};
