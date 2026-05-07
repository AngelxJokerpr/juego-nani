// --- CANVAS ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- MENÚ INICIAL ---
const startMenu = document.getElementById('startMenu');
const startBtn = document.getElementById('startBtn');
startBtn.addEventListener('click', ()=>{
    startMenu.style.display='none';
    canvas.style.display='block';
    startGame();
});

// --- BOTONES MÓVILES ---
const keys={left:false,right:false,jump:false};
document.getElementById('leftBtn').addEventListener('touchstart',()=>keys.left=true);
document.getElementById('leftBtn').addEventListener('touchend',()=>keys.left=false);
document.getElementById('rightBtn').addEventListener('touchstart',()=>keys.right=true);
document.getElementById('rightBtn').addEventListener('touchend',()=>keys.right=false);
document.getElementById('jumpBtn').addEventListener('touchstart',()=>keys.jump=true);
document.getElementById('jumpBtn').addEventListener('touchend',()=>keys.jump=false);

// --- JUGADOR ---
const player={
    x:50, y:canvas.height-150, w:80,h:80,
    dx:0,dy:0,spd:7,gravity:0.7,jump:-18,onGround:false,
    sprite:'assets/player.png'
};

// --- NPCs ---
const npcs=[
    {x:400,y:canvas.height-150,w:80,h:80,messages:["Jonayliz, eres la luz de mi vida 💕","Te amo más que ayer, menos que mañana 🌸"],curMsg:0,timer:0,sprite:'assets/girlfriend.png'}
];

// --- COLECCIONABLES ---
let collectibles=[];

// --- ENEMIGOS ---
let enemies=[];

// --- PLATAFORMAS ---
let platforms=[];

// --- NIVELES ---
const levels=[
    {bg:'assets/background1.png',name:'Disney'},
    {bg:'assets/background2.png',name:'Crucero'},
    {bg:'assets/background3.png',name:'Disney2'}
];
let currentLevel=0;

// --- RESET LEVEL ---
function resetLevel(){
    player.x=50; player.y=canvas.height-150; player.dy=0; player.onGround=false;
    createEnemies(currentLevel);
    createPlatforms(currentLevel);
    createCollectibles(currentLevel);
}

// --- CREAR ENEMIGOS ---
function createEnemies(level){
    enemies=[];
    if(level===0){
        enemies.push({x:400,y:canvas.height-150,w:60,h:60,dx:3,dy:2,sprite:'assets/enemy.png'});
        enemies.push({x:700,y:canvas.height-180,w:60,h:60,dx:-2,dy:1,sprite:'assets/enemy.png'});
    } else if(level===1){
        enemies.push({x:300,y:canvas.height-180,w:60,h:60,dx:2,dy:2,sprite:'assets/enemy.png'});
        enemies.push({x:800,y:canvas.height-200,w:60,h:60,dx:-3,dy:1,sprite:'assets/enemy.png'});
    } else {
        enemies.push({x:500,y:canvas.height-150,w:60,h:60,dx:3,dy:2,sprite:'assets/enemy.png'});
        enemies.push({x:900,y:canvas.height-180,w:60,h:60,dx:-2,dy:1,sprite:'assets/enemy.png'});
    }
}

// --- CREAR PLATAFORMAS ---
function createPlatforms(level){
    platforms=[];
    for(let i=0;i<5;i++){
        platforms.push({
            x:100+i*200,
            y:canvas.height-100-Math.random()*150,
            w:150,h:20,
            dx:(Math.random()>0.5?2:-2)
        });
    }
}

// --- CREAR COLECCIONABLES ---
function createCollectibles(level){
    collectibles=[];
    for(let i=0;i<5;i++){
        collectibles.push({
            x:200+Math.random()*800,
            y:canvas.height-200-Math.random()*150,
            w:40,h:40,collected:false
        });
    }
}

// --- DIBUJAR SPRITES ---
function drawSprite(url,x,y,w,h){
    const img=new Image();
    img.src=url;
    ctx.drawImage(img,x,y,w,h);
}

// --- ANIMACIÓN DE ANILLOS ---
function animateRings(){
    const ringsContainer=document.getElementById('ringsContainer');
    for(let i=0;i<5;i++){
        const ring=document.createElement('div');
        ring.style.width="50px";
        ring.style.height="50px";
        ring.style.border="5px solid gold";
        ring.style.borderRadius="50%";
        ring.style.position="absolute";
        ring.style.left=Math.random()*window.innerWidth+"px";
        ring.style.top=Math.random()*window.innerHeight+"px";
        ring.style.animation="floatRing 5s infinite";
        ringsContainer.appendChild(ring);
    }
}

// --- GAME LOOP ---
let lastTime=0;
function startGame(){
    resetLevel();
    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp){
    const deltaTime=timestamp-lastTime;
    lastTime=timestamp;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // --- FONDO ---
    drawSprite(levels[currentLevel].bg,0,0,canvas.width,canvas.height);

    // --- PLATAFORMAS ---
    platforms.forEach(p=>{
        p.x+=p.dx;
        if(p.x<0 || p.x+p.w>canvas.width)p.dx*=-1;
        ctx.fillStyle='brown';
        ctx.fillRect(p.x,p.y,p.w,p.h);
    });

    // --- JUGADOR ---
    player.dy+=player.gravity;
    player.y+=player.dy;
    player.onGround=false;

    platforms.forEach(p=>{
        if(player.x< p.x+p.w && player.x+player.w>p.x && player.y+player.h< p.y+player.dy+10 && player.y+player.h>p.y){
            player.y=p.y-player.h;
            player.dy=0;
            player.onGround=true;
        }
    });

    if(keys.left)player.x-=player.spd;
    if(keys.right)player.x+=player.spd;
    if(keys.jump && player.onGround){player.dy=player.jump;player.onGround=false;}

    drawSprite(player.sprite,player.x,player.y,player.w,player.h);

    // --- ENEMIGOS ---
    enemies.forEach(e=>{
        e.x+=e.dx; e.y+=e.dy;
        if(e.x<0||e.x+e.w>canvas.width)e.dx*=-1;
        if(e.y<0||e.y+e.h>canvas.height-50)e.dy*=-1;
        drawSprite(e.sprite,e.x,e.y,e.w,e.h);
        if(player.x<e.x+e.w && player.x+player.w>e.x && player.y<e.y+e.h && player.y+player.h>e.y){
            resetLevel();
        }
    });

    // --- COLECCIONABLES ---
    collectibles.forEach(c=>{
        if(!c.collected){
            ctx.fillStyle="pink";
            ctx.fillRect(c.x,c.y,c.w,c.h);
            if(player.x<c.x+c.w && player.x+player.w>c.x && player.y<c.y+c.h && player.y+player.h>c.y){
                c.collected=true;
                alert("Jonayliz 💖 este es un recuerdo especial!");
            }
        }
    });

    // --- NPCS ---
    npcs.forEach(npc=>{
        npc.timer+=deltaTime;
        if(npc.timer>4000){npc.timer=0; npc.curMsg=(npc.curMsg+1)%npc.messages.length;}
        ctx.font="20px Arial"; ctx.textAlign="center"; ctx.fillStyle="#fff";
        ctx.fillText(npc.messages[npc.curMsg], npc.x+npc.w/2,npc.y-20);
        drawSprite(npc.sprite,npc.x,npc.y,npc.w,npc.h);
    });

    // --- PASAR NIVEL ---
    if(player.x>canvas.width-100){
        currentLevel++;
        if(currentLevel>=
