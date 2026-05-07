// --- CANVAS ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- MENÚ INICIAL ---
const startMenu = document.getElementById('startMenu');
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', () => {
    startMenu.style.display = 'none';
    canvas.style.display = 'block';
    startGame();
});

// --- JUGADOR ---
const player = {
    x: 50,
    y: canvas.height - 150,
    width: 80,
    height: 80,
    speed: 7,
    dy: 0,
    gravity: 0.6,
    jumpPower: -15,
    onGround: false,
    sprite: 'assets/player.png'
};

// --- TECLADO / TOQUE ---
const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

canvas.addEventListener('touchstart', e => {
    player.dy = player.jumpPower;
});

// --- NPCS ---
const npcs = [
    { x: 300, y: canvas.height - 150, width: 80, height: 80, messages: ["Jonayliz, eres hermosa 💕", "Te amo más que ayer, menos que mañana 🌸"], currentMsg: 0, timer: 0, sprite: 'assets/girlfriend.png'}
];

// --- NIVELES ---
const levels = [
    { bg: 'assets/background1.png', name: 'Disney' },
    { bg: 'assets/background2.png', name: 'Crucero' },
    { bg: 'assets/background3.png', name: 'Disney2' }
];
let currentLevel = 0;
let enemies = [];

// --- CREAR ENEMIGOS ---
function createEnemies(level) {
    if(level === 0){ // Disney
        enemies = [
            { x:400, y:canvas.height-150, width:60, height:60, dx:3, dy:2, sprite:'assets/enemy.png' },
            { x:800, y:canvas.height-150, width:60, height:60, dx:-2, dy:1, sprite:'assets/enemy.png' }
        ];
    }
    if(level === 1){ // Crucero
        enemies = [
            { x:300, y:canvas.height-180, width:60, height:60, dx:2, dy:2, sprite:'assets/enemy.png' },
            { x:700, y:canvas.height-200, width:60, height:60, dx:-3, dy:1, sprite:'assets/enemy.png' }
        ];
    }
    if(level === 2){ // Disney2
        enemies = [
            { x:500, y:canvas.height-150, width:60, height:60, dx:3, dy:2, sprite:'assets/enemy.png' },
            { x:900, y:canvas.height-180, width:60, height:60, dx:-2, dy:1, sprite:'assets/enemy.png' }
        ];
    }
}

// --- DIBUJAR SPRITE ---
function drawSprite(url, x, y, w, h){
    const img = new Image();
    img.src = url;
    ctx.drawImage(img, x, y, w, h);
}

// --- RESET LEVEL ---
function resetLevel(){
    player.x = 50;
    player.y = canvas.height - 150;
    player.dy = 0;
    player.onGround = false;
    createEnemies(currentLevel);
}

// --- GAME LOOP ---
let lastTime = 0;
function startGame(){
    createEnemies(currentLevel);
    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp){
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // --- FONDO ---
    drawSprite(levels[currentLevel].bg,0,0,canvas.width,canvas.height);

    // --- JUGADOR ---
    player.dy += player.gravity;
    player.y += player.dy;
    if(player.y + player.height > canvas.height-50){
        player.y = canvas.height-50-player.height;
        player.dy=0;
        player.onGround=true;
    }
    if(keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if(keys['ArrowRight'] || keys['d']) player.x += player.speed;

    drawSprite(player.sprite, player.x, player.y, player.width, player.height);

    // --- ENEMIGOS ---
    enemies.forEach(e => {
        e.x += e.dx;
        e.y += e.dy;

        // REBOTE EN PAREDES
        if(e.x<0 || e.x+e.width>canvas.width) e.dx *= -1;
        if(e.y<0 || e.y+e.height>canvas.height-50) e.dy *= -1;

        drawSprite(e.sprite, e.x, e.y, e.width, e.height);

        // COLISIÓN
        if(player.x < e.x+e.width && player.x+player.width > e.x && player.y < e.y+e.height && player.y+player.height > e.y){
            resetLevel();
        }
    });

    // --- NPCS ---
    npcs.forEach(npc => {
        npc.timer += deltaTime;
        if(npc.timer>4000){
            npc.timer=0;
            npc.currentMsg=(npc.currentMsg+1)%npc.messages.length;
        }
        ctx.font="20px Arial";
        ctx.textAlign="center";
        ctx.fillStyle="#fff";
        ctx.fillText(npc.messages[npc.currentMsg], npc.x + npc.width/2, npc.y - 20);
        drawSprite(npc.sprite, npc.x, npc.y, npc.width, npc.height);
    });

    // --- PASAR NIVEL ---
    if(player.x > canvas.width - 100){
        currentLevel++;
        if(currentLevel >= levels.length){
            document.getElementById('gameCanvas').style.display='none';
            document.getElementById('finalCard').style.display='flex';
            animateRings();
            return;
        } else {
            resetLevel();
        }
    }

    requestAnimationFrame(gameLoop);
}

// --- ANIMACIÓN DE ANILLOS EN CARTA FINAL ---
function animateRings(){
    const ringsContainer = document.getElementById('ringsContainer');
    for(let i=0;i<5;i++){
        const ring = document.createElement('div');
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
