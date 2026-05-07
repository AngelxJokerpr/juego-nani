// CANVAS
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// SPRITES
let imgPlayer = new Image();
let imgGF = new Image();
let imgEnemy = new Image();
let imgNPC = new Image();

// ESPERA QUE SE CARGUEN LOS ASSETS
let assetsLoaded = 0;
let totalAssets = 4;
function checkAllLoaded(){
  assetsLoaded++;
  if(assetsLoaded === totalAssets){
    document.getElementById("startBtn").disabled = false; // Habilita botón
  }
}

imgPlayer.src = "assets/player.png"; imgPlayer.onload = checkAllLoaded;
imgGF.src = "assets/girlfriend.png"; imgGF.onload = checkAllLoaded;
imgEnemy.src = "assets/enemy.png"; imgEnemy.onload = checkAllLoaded;
imgNPC.src = "assets/npc.png"; imgNPC.onload = checkAllLoaded;

// VARIABLES JUEGO
let player = {x:100, y:0, vy:0, jump:false, w:70, h:70, frame:0};
let right=false, left=false;
let level=0;
let lives=3;
let cameraX=0;

// NIVELES
let levels=[
  {name:"Disney 💖", text:"Disney: el día donde ella me pidió ser su novio", start:0, end:2000},
  {name:"Crucero 🚢", text:"Crucero: entendí que quiero todo contigo", start:2000, end:4000},
  {name:"Disney 2 ✨", text:"Disney otra vez: nuestro futuro juntos", start:4000, end:6000}
];
let ground = canvas.height-120;

// NPCS con mensajes románticos
let npcs = [
  {x:300, text:"💖 Jonayliz es hermosa"},
  {x:900, text:"💖 Te amo más que ayer pero no más que mañana"},
  {x:2500,text:"💖 Contigo todo tiene sentido"},
  {x:4500,text:"💖 Eres mi destino"}
];

// ENEMIGOS
let enemies=[];
for(let i=0;i<50;i++){
  enemies.push({x:i*220+500, y:ground-50, dir:1, w:60, h:60});
}

// PLATAFORMAS
let platforms=[
  {x:0,y:ground,w:7000,h:20},
  {x:7200,y:ground-100,w:3000,h:20}
];

// FONDOS
let backgrounds = [
  {img: "assets/background1.png", x:0},
  {img: "assets/background2.png", x:0},
  {img: "assets/background3.png", x:0}
];

// CONTROLES
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

// FUNCIONES DIBUJO
function drawPlayer(p){ctx.drawImage(imgPlayer,p.x,p.y,p.w,p.h);}
function drawEnemy(e){ctx.drawImage(imgEnemy,e.x,e.y,e.w,e.h);}
function drawNPC(n){ctx.drawImage(imgNPC,n.x,ground-30,60,60);}
function drawPlatform(p){ctx.fillStyle="#654321"; ctx.fillRect(p.x,p.y,p.w,p.h);}
function drawBackground(){
  backgrounds[level].x -=0.3; 
  let bgImg=new Image(); bgImg.src=backgrounds[level].img;
  ctx.drawImage(bgImg,backgrounds[level].x,0,canvas.width,canvas.height);
  ctx.drawImage(bgImg,backgrounds[level].x+canvas.width,0,canvas.width,canvas.height);
}

// START
function start(){
  document.getElementById("intro").style.display="none";
  document.getElementById("storyText").innerHTML = levels[level].text;
  loop();
}
document.getElementById("startBtn").addEventListener("click", start);

// GAME OVER
function gameOver(){
  document.body.innerHTML=`
  <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:black;color:white;text-align:center;">
  💔 Perdiste<br><button onclick="location.reload()">Reintentar</button>
  </div>`;
}

// FINAL
function endGame(){
  document.body.innerHTML=`
  <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;background:black;color:white;text-align:center;">
  💌 7 MESES CONTIGO 💌<br><br>
  Te amo más de lo que puedo explicar ❤️<br><br>
  <button onclick="location.reload()">Repetir historia</button>
  <br><br>
  <button onclick="alert('💍 Sí, quiero 😭❤️')">💍 ¿Te quieres casar conmigo?</button>
  </div>`;
}

// LOOP PRINCIPAL
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();

  // MOVIMIENTO JUGADOR
  if(right) player.x +=6;
  if(left) player.x -=6;
  player.vy +=0.9; player.y+=player.vy;

  // COLISION PLATAFORMAS
  player.jump=true;
  platforms.forEach(p=>{
    if(player.x+player.w>p.x && player.x<p.x+p.w && player.y+player.h>p.y && player.y+player.h<p.y+p.h+10 && player.vy>=0){
      player.y=p.y-player.h; player.vy=0; player.jump=false;
    }
  });

  // CAMARA
  cameraX += (player.x-cameraX-300)*0.08;
  ctx.save(); ctx.translate(-cameraX,0);

  // ENEMIGOS
  enemies.forEach(e=>{
    e.x+=e.dir*2;
    if(e.x>cameraX+canvas.width) e.dir=-1;
    if(e.x<cameraX) e.dir=1;
    drawEnemy(e);
    if(player.x<e.x+e.w && player.x+player.w>e.x && player.y<e.y+e.h && player.y+player.h>e.y){
      lives--;
      player.x = levels[level].start+100;
      player.y = ground-50;
      if(lives<=0) gameOver();
    }
  });

  // NPCS
  let currentDialog="";
  npcs.forEach(n=>{
    drawNPC(n);
    if(Math.abs(player.x-n.x)<200) currentDialog=n.text;
  });
  document.getElementById("dialog").innerHTML=currentDialog;

  // JUGADOR
  drawPlayer(player);

  // FINAL DE NIVEL
  if(player.x > levels[level].end){
    level++;
    if(level >= levels.length){ end
