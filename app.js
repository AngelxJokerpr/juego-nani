// ====== CANVAS Y CONTROLES ======
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startMenu = document.getElementById('startMenu');
const startBtn = document.getElementById('startBtn');
const finalCard = document.getElementById('finalCard');
const ringsContainer = document.getElementById('ringsContainer');

startBtn.addEventListener('click', () => {
    startMenu.style.display = 'none';
    canvas.style.display = 'block';
    startGame();
});

// ====== PLAYER ======
const playerImg = new Image();
playerImg.src = 'assets/player.png';
const player = {x:50, y:canvas.height-150, w:60, h:60, dx:0, dy:0, spd:6, gravity:0.7, jump:-18, onGround:false};

// ====== TECLADO ======
const keys = {left:false, right:false, jump:false};
document.addEventListener('keydown', e => {
    if(e.key==='ArrowLeft') keys.left=true;
    if(e.key==='ArrowRight') keys.right=true;
    if(e.key==='ArrowUp') keys.jump=true;
});
document.addEventListener('keyup', e => {
    if(e.key==='ArrowLeft') keys.left=false;
    if(e.key==='ArrowRight') keys.right=false;
    if(e.key==='ArrowUp') keys.jump=false;
});

// ====== MÓVIL ======
function createTouchControls() {
    const createBtn = (text, left, right) => {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.style.position = 'absolute';
        btn.style.bottom = '20px';
        btn.style.left = left;
        btn.style.fontSize = '2em';
        btn.style.opacity = '0.6';
        btn.addEventListener('touchstart', ()=>keys[text==='⬅️'?'left':text==='➡️'?'right':'jump']=true);
        btn.addEventListener('touchend', ()=>keys[text==='⬅️'?'left':text==='➡️'?'right':'jump']=false);
        document.body.appendChild(btn);
    }
    createBtn('⬅️','20px');
    createBtn('➡️','100px');
    createBtn('⛅','calc(100% - 60px)');
}
createTouchControls();

// ====== NIVELES ======
const levels = [
    {bg:'assets/background1.png',name:'Disney'},
    {bg:'assets/background2.png',name:'Crucero'},
    {bg:'assets/background3.png',name:'Disney2'}
];
let currentLevel = 0;

// ====== PLATAFORMAS, ENEMIGOS, NPCs ======
let platforms=[], enemies=[], npcs=[];

function createLevel(levelIndex) {
    platforms = [];
    enemies = [];
    npcs = [];

    // Plataformas
    for(let i=0;i<6;i++){
        platforms.push({x:100+i*200, y:canvas.height-100-Math.random()*150, w:150, h:20, dx:(Math.random()>0.5?2:-2)});
    }

    // Enemigos
    const enemyImg = new Image();
    enemyImg.src = 'assets/enemy.png';
    enemies.push({x:500, y:canvas.height-150, w:50, h:50, dx:3, dy:0, img:enemyImg});
    enemies.push({x:800, y:canvas.height-200, w:50, h:50, dx:-2, dy:0, img:enemyImg});

    // NPCs
    const npcImg = new Image();
    npcImg.src = 'assets/girlfriend.png';
    npcs.push({x:400, y:canvas.height-150, w:60, h:60, img:npcImg, messages:["Te amo más que ayer","Menos que mañana","Jonayliz eres hermosa"],curMsg:0,timer:0});
}

// ====== ANILLOS FINALES ======
function animateRings(){
    for(let i=0;i<6;i++){
        const ring=document.createElement('div');
        ring.style.width='40px';
        ring.style.height='40px';
        ring.style.border='5px solid gold';
        ring.style.borderRadius='50%';
        ring.style.position='absolute';
        ring.style.left=Math.random()*window.innerWidth+'px';
        ring.style.top=Math.random()*window.innerHeight+'px';
        ringsContainer.appendChild(ring);
    }
}

// ====== RESET JUGADOR ======
function resetPlayer(){
    player.x = 50; 
    player.y = canvas.height-150;
    player.dy = 0; 
    player.onGround = false;
}

// ====== START GAME ======
function startGame(){
    createLevel(currentLevel);
    resetPlayer();
    requestAnimationFrame(gameLoop);
}

// ====== GAME LOOP ======
function gameLoop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Fondo
    const bg = new Image();
    bg.src = levels[currentLevel].bg;
    ctx.drawImage(bg,0,0,canvas.width,canvas.height);

    // Plataformas
    ctx.fillStyle = '#6A4F4B';
    platforms.forEach(p=>{
        p.x += p.dx;
        if(p.x<0 || p.x+p.w>canvas.width) p.dx*=-1;
        ctx.fillRect(p.x,p.y,p.w,p.h);
    });

    // NPCs
    npcs.forEach(npc=>{
        ctx.drawImage(npc.img,npc.x,npc.y,npc.w,npc.h);
        npc.timer++;
        if(npc.timer>200){
            npc.curMsg = (npc.curMsg+1)%npc.messages.length;
            npc.timer=0;
        }
        ctx.fillStyle='white';
        ctx.font='20px Arial';
        ctx.fillText(npc.messages[npc.curMsg], npc.x-50, npc.y-10);
    });

    // Enemigos
    enemies.forEach(e=>{
        e.x += e.dx;
        if(e.x<0 || e.x+e.w>canvas.width) e.dx*=-1;
        ctx.drawImage(e.img,e.x,e.y,e.w,e.h);

        // Colisión
        if(player.x<e.x+e.w && player.x+player.w>e.x && player.y<e.y+e.h && player.y+player.h>e.y){
            resetPlayer();
        }
    });

    // MOVIMIENTO PLAYER
    if(keys.left) player.x -= player.spd;
    if(keys.right) player.x += player.spd;
    if(keys.jump && player.onGround){player.dy = player.jump; player.onGround=false;}

    player.dy += player.gravity;
    player.y += player.dy;

    // Suelo
    if(player.y+player.h>=canvas.height-50){
        player.y = canvas.height-50-player.h;
        player.dy = 0;
        player.onGround = true;
    }

    // Plataformas colisión
    platforms.forEach(p=>{
        if(player.x+player.w>p.x && player.x< p.x+p.w && player.y+player.h>p.y && player.y+player.h<p.y+p.h+player.dy){
            player.y = p.y-player.h;
            player.dy=0;
            player.onGround=true;
        }
    });

    // Dibujar jugador
    ctx.drawImage(playerImg,player.x,player.y,player.w,player.h);

    // Pasar nivel
    if(player.x + player.w > canvas.width-10){
        currentLevel++;
        if(currentLevel>=levels.length){
            canvas.style.display='none';
            finalCard.style.display='flex';
            animateRings();
        } else {
            createLevel(currentLevel);
            resetPlayer();
        }
    }

    if(currentLevel<levels.length) requestAnimationFrame(gameLoop);
}
