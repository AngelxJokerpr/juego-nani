// === CANVAS ===
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// === ASSETS ===
let imgPlayer = new Image();
let imgGF = new Image();
let imgEnemy = new Image();
let imgNPC = new Image();
let bgImages = [new Image(), new Image(), new Image()];

imgPlayer.src = "assets/player.png";
imgGF.src = "assets/girlfriend.png";
imgEnemy.src = "assets/enemy.png";
imgNPC.src = "assets/npc.png";
bgImages[0].src = "assets/background1.png";
bgImages[1].src = "assets/background2.png";
bgImages[2].src = "assets/background3.png";

let assetsLoaded = 0;
let totalAssets = 7;

function checkAllLoaded(){
  assetsLoaded++;
  if(assetsLoaded === totalAssets){
    document.getElementById("startBtn").disabled = false;
  }
}

imgPlayer.onload = checkAllLoaded;
imgGF.onload = checkAllLoaded;
imgEnemy.onload = checkAllLoaded;
imgNPC.onload = checkAllLoaded;
bgImages[0].onload = checkAllLoaded;
bgImages[1].onload = checkAllLoaded;
bgImages[2].onload = checkAllLoaded;

// === VARIABLES JUEGO ===
let player = {x:100, y:canvas.height-150, w:70, h:70, vy:0, jump:false};
let level=0;
let cameraX=0;
let lives=3;

let levels=[
  {name:"Disney 💖", text:"Disney: el día donde ella me pidió ser su novio", start:0, end:2000},
  {name:"Crucero 🚢", text:"Crucero: entendí que quiero todo contigo", start:2000, end:4000},
  {name:"Disney 2 ✨", text:"Disney otra vez: nuestro futuro juntos", start:4000, end:6000}
];

let ground = canvas.height-120;

// NPCs con mensajes
let npcs = [
  {x:300,text:"💖 Jonayliz es hermosa"},
  {x:900,text:"💖 Te amo más que ayer pero no más que mañana"},
  {x:2500,text:"💖 Contigo todo tiene sentido"},
  {x:4500,text:"💖 Eres mi destino"}
];

// Enemigos
let enemies=[];
for(let i=0;i<50;i++){
  enemies.push({x:i*220+500, y:ground-50, w:60, h:60, dir:1});
}

// Plataformas
let platforms=[{x:0,y:ground,w:7000,h:20},{x:7200,y:ground-100,w:3000,h:20}];

// === CONTROLES ===
let right=false, left=false;
document.addEventListener("keydown",(e)=>{
  if(e.key==="ArrowRight") right=true;
  if(e.key==="ArrowLeft") left=true;
  if(e.key===" ") jump();
});
document.addEventListener("keyup",(e)=>{
  if(e.key==="ArrowRight") right=false;
  if(e.key==="ArrowLeft") left=false;
});

function jump(){if(!player.jump){player.vy=-16; player.jump=false;}}

// === DIBUJO ===
function drawPlayer(){ctx.drawImage(imgPlayer,player.x,player.y,player.w,player.h);}
function drawEnemy(e){ctx.drawImage(imgEnemy,e.x,e.y,e.w,e.h);}
function drawNPC(n){ctx.drawImage(imgNPC,n.x,ground-30,60,60);}
function drawPlatform(p){ctx.fillStyle="#654321"; ctx.fillRect(p.x,p.y,p.w,p.h);}
function drawBackground(){ctx.drawImage(bgImages[level],0,0,canvas.width,canvas.height);}

// === LOOP PRINCIPAL ===
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();

  // Movimiento jugador
  if(right) player.x+=6;
  if(left) player.x-=6;
  player.vy+=0.9; player.y+=player.vy;

  // Colision con plataformas
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
    e.x+=e.dir*2;
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

  // NPCs
  let currentDialog="";
  npcs.forEach(n=>{
    drawNPC(n);
    if(Math.abs(player.x-n.x)<200) currentDialog=n.text;
  });
  document.getElementById("dialog").innerHTML=currentDialog;

  drawPlayer();

  // Avanzar nivel
  if(player.x>levels[level].end){
    level++;
    if(level>=levels.length){ endGame(); return; }
    player.x=levels[level].start+100;
    document.getElementById("storyText").innerHTML=levels[level].text;
  }

  ctx.restore();
  requestAnimationFrame(loop);
}

// === GAME OVER ===
function gameOver(){
  document.body.innerHTML=`<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:black;color:white;text-align:center;">
  💔 Perdiste<br><button onclick="location.reload()">Reintentar</button></div>`;
}

// === END GAME ===
function endGame(){
  document.body.innerHTML=`<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;background:black;color:white;text-align:center;">
  💌 7 MESES CONTIGO 💌<br><br>
  Te amo más de lo que puedo explicar ❤️<br><br>
  Hemos compartido momentos increíbles en Disney y cruceros, y cada día a tu lado es una aventura única.<br><br>
  Gracias por estos
