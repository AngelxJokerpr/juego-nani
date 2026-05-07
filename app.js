// CANVAS
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// SPRITES
let imgPlayer = new Image(); imgPlayer.src = "assets/player.png";
let imgGF = new Image(); imgGF.src = "assets/girlfriend.png";
let imgEnemy = new Image(); imgEnemy.src = "assets/enemy.png";
let imgNPC = new Image(); imgNPC.src = "assets/npc.png";
let backgrounds = ["assets/background1.png","assets/background2.png","assets/background3.png"];

// PLAYER
let player = {x:100, y:0, vy:0, jump:false, w:70, h:70, frame:0};

// CONTROLES
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

// NIVEL
let level=0;
let levels=[
  {name:"Disney 💖", text:"💖 Disney: el día donde ella me pidió ser su novio", start:0, end:2000},
  {name:"Crucero 🚢", text:"🚢 Crucero: entendí que quiero todo contigo", start:2000, end:4000},
  {name:"Disney 2 ✨", text:"✨ Disney otra vez: nuestro futuro juntos", start:4000, end:6000}
];
let ground = canvas.height-120;
let lives=3;

// NPCS
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

// UI
let storyText=document.getElementById("storyText");
let dialog=document.getElementById("dialog");

// START
function start(){
  document.getElementById("intro").style.display="none";
  storyText.innerHTML = levels[level].text;
  loop();
}

// DIBUJOS
function drawPlayer(p){
  // Animación simple de caminar (cambia frame)
  ctx.drawImage(imgPlayer,p.x,p.y,p.w,p.h);
  p.frame+=0.1;
  if(p.frame>3) p.frame=0;
}
function drawEnemy(e){ctx.drawImage(imgEnemy,e.x,e.y,e.w,e.h);}
function drawNPC(n){ctx.drawImage(imgNPC,n.x,ground-30,60,60);}
function drawPlatform(p){ctx.fillStyle="#654321"; ctx.fillRect(p.x,p.y,p.w,p.h);}
function drawBackground(){
  let bg=new Image(); bg.src=backgrounds[level];
  ctx.drawImage(bg,0,0,canvas.width,canvas.height);
}

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

// LOOP
let cameraX=0;
function loop(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();

  // movimiento jugador
  if(right) player.x +=6;
  if(left) player.x -=6;
  player.vy +=0.9; player.y+=player.vy;

  // colisión plataformas
  player.jump=true;
  platforms.forEach(p=>{
    if(player.x+player.w>p.x && player.x<p.x+p.w && player.y+player.h>p.y && player.y+player.h<p.y+p.h+10 && player.vy>=0){
      player.y=p.y-player.h; player.vy=0; player.jump=false;
    }
  });

  // cámara suave
  cameraX += (player.x-cameraX-300)*0.08;
  ctx.save(); ctx.translate(-cameraX,0);

  // enemigos
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

  // NPCs siempre visibles
  let currentDialog="";
  npcs.forEach(n=>{
    drawNPC(n);
    if(Math.abs(player.x-n.x)<200) currentDialog=n.text;
  });
  dialog.innerHTML=currentDialog;

  // jugador
  drawPlayer(player);

  // final de nivel
  if(player.x > levels[level].end){
    level++;
    if(level >= levels.length){ endGame(); return; }
    player.x = levels[level].start+100;
    player.y = ground-50;
    storyText.innerHTML = levels[level].text;
  }

  ctx.restore();
  requestAnimationFrame(loop);
}