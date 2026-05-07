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

// BOTONES MÓVILES
const keys = {left:false, right:false, jump:false};
document.getElementById('leftBtn').addEventListener('touchstart',()=>keys.left=true);
document.getElementById('leftBtn').addEventListener('touchend',()=>keys.left=false);
document.getElementById('rightBtn').addEventListener('touchstart',()=>keys.right=true);
document.getElementById('rightBtn').addEventListener('touchend',()=>keys.right=false);
document.getElementById('jumpBtn').addEventListener('touchstart',()=>keys.jump=true);
document.getElementById('jumpBtn').addEventListener('touchend',()=>keys.jump=false);

// JUGADOR
const player = {x:50,y:canvas.height-150,w:80,h:80,dx:0,dy:0,spd:7,gravity:0.7,jump:-18,onGround:false,sprite:'assets/player.png'};

// NPCS
const npcs=[
    {x:400,y:canvas.height-150,w:80,h:80,messages:["Jonayliz, eres la luz de mi vida 💕","Te amo más que ayer, menos que mañana 🌸"],curMsg:0,timer:0,sprite:'assets/girlfriend.png'}
];

// NIVELES
const levels=[
    {bg:'assets/background1.png',name:'Disney'},
    {bg:'assets/background2.png',name:'Crucero'},
    {bg:'assets/background3.png',name:'Disney2'}
];
let currentLevel = 0;

// ENEMIGOS, PLATAFORMAS, COLECCIONABLES
let enemies=[], platforms=[], collectibles=[];

function resetLevel(){
    player.x=50; player.y=canvas.height-150; player.dy=0; player.onGround=false;
    createEnemies(currentLevel);
    createPlatforms(currentLevel);
    createCollectibles(currentLevel);
}

function createEnemies(level){
    enemies=[];
    enemies.push({x:400,y:canvas.height-150,w:60,h:60,dx:3,dy:2,sprite:'assets/enemy.png'});
    enemies.push({x:700,y:canvas.height-180,w:60,h:60,dx:-2,dy:1,sprite:'assets/enemy.png'});
}

function createPlatforms(level){
    platforms=[];
    for(let i=0;i<5;i++){
        platforms.push({x:100+i*200,y:canvas.height-100-Math.random()*150,w:150,h:20,dx:(Math.random()>0.5?2:-2)});
    }
}

function createCollectibles(level){
    collectibles=[];
    for(let i=0;i<5;i++){
        collectibles.push({x:200+Math.random()*800,y:canvas.height-200-Math.random()*150,w:40,h:40,collected:false});
    }
}

function drawSprite(url,x,y,w,h){
    const img = new Image();
    img.src=url;
    ctx.drawImage(img,x,y,w,h);
}

// ANILLOS FINALES
function animateRings(){
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

// GAME LOOP
let lastTime=0;
function startGame(){
    resetLevel();
    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp){
    const deltaTime = timestamp-lastTime;
    lastTime = timestamp;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // FONDO
    drawSprite(levels[currentLevel].bg,0,0,canvas.width,canvas.height);

    // PLATAFORMAS
    platforms.forEach(p=>{
        p.x += p.dx;
        if(p.x<0 || p.x+p.w>canvas.width
