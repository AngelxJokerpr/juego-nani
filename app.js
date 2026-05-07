const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- Menú ---
const startMenu = document.getElementById('startMenu');
const startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', ()=>{
    startMenu.style.display = 'none';
    canvas.style.display = 'block';
    startGame();
});

// --- Jugador ---
const player = {
    x:50, y:canvas.height-150, width:80, height:80,
    speed:7, dy:0, gravity:0.6, jumpPower:-15, onGround:false,
    sprite:'assets/player.png'
};

// --- Niveles ---
const levels = [
    { bg: 'assets/background1.png', name: 'Disney' },
    { bg: 'assets/background2.png', name: 'Crucero' },
    { bg: 'assets/background3.png', name: 'Disney2' }
];
let currentLevel = 0;
let enemies = [];

// --- Crear enemigos ---
function createEnemies(level) {
    enemies = [
        {x:400, y:canvas.height-150, width:60, height:60, dx:3, dy:0, sprite:'assets/enemy.png'},
        {x:800, y:canvas.height-150, width:60, height:60, dx:2, dy:0, sprite:'assets/enemy.png'}
    ];
    if(level===1) enemies.push({x:600, y:canvas.height-180, width:60, height:60, dx:2, dy:0, sprite:'assets/enemy.png'});
}

// --- NPC ---
const npcs = [
    {
        x:300, y:canvas.height-150, width:80, height:80,
        messages: [
            "Jonayliz, eres la persona más hermosa 💕",
            "Te amo más que ayer, menos que mañana 🌸",
            "Cada momento contigo es mágico 💖"
        ],
        currentMsg:0, timer:0, sprite:'assets/girlfriend.png'
    }
];

// --- Controles ---
const keys = {};
document.addEventListener('keydown', e=>keys[e.key]=true);
document.addEventListener('keyup', e=>keys[e.key]=false);
document.addEventListener('keydown', e=>{
    if(e.key===' ' && player.onGround) { player.dy=player.jumpPower; player.onGround=false; }
});

// --- Dibujar sprite ---
function drawSprite(url,x,y,w,h){
    const img = new Image();
    img.src = url;
    ctx.drawImage(img,x,y,w,h);
}

// --- Reset level ---
function resetLevel(){
    player.x = 50;
    player.y = canvas.height - 150;
    createEnemies(currentLevel);
}

// --- Colisiones ---
function checkCollisions(){
    enemies.forEach(e=>{
        if(player.x<e.x+e.width && player.x+player.width>e.x &&
           player.y<e.y+e.height && player.y+player.height>e.y){
               resetLevel();
           }
    });
}

// --- NPC mensajes ---
function updateNPCMessages(deltaTime) {
    npcs.forEach(npc=>{
        npc.timer += deltaTime;
        if(npc.timer>5000){ npc.timer=0; npc.currentMsg++; if(npc.currentMsg>=npc.messages.length) npc.currentMsg=0; }
    });
}

function drawNPCBubbles() {
    npcs.forEach(npc=>{
        const text = npc.messages[npc.currentMsg];
        ctx.font = "20px Arial"; ctx.textAlign="center";
        const padding=10, textWidth=ctx.measureText(text).width;
        const bubbleWidth = textWidth+padding*2, bubbleHeight=30;
        const bubbleX=npc.x+npc.width/2, bubbleY=npc.y-40;
        ctx.fillStyle="rgba(255,192,203,0.9)";
        ctx.strokeStyle="#ff69b4"; ctx.lineWidth=2;
        ctx.beginPath(); ctx.roundRect(bubbleX-bubbleWidth/2, bubbleY-bubbleHeight/2, bubbleWidth,bubbleHeight,10);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle="#fff"; ctx.fillText(text, bubbleX, bubbleY+7);
        drawSprite(npc.sprite,npc.x,npc.y,npc.width,npc.height);
    });
}

// --- RoundRect polyfill ---
if(!CanvasRenderingContext2D.prototype.roundRect){
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2*r) r=w/2; if(h<2*r) r=h/2;
        this.beginPath();
        this.moveTo(x+r, y);
        this.arcTo(x+w, y, x+w, y+h, r);
        this.arcTo(x+w, y+h, x, y+h, r);
        this.arcTo(x, y+h, x, y, r);
        this.arcTo(x, y, x+w, y, r);
        this.closePath();
        return this;
    }
}

// --- Juego ---
let lastTime=0;
function startGame(){
    createEnemies(currentLevel);
    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp){
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0,0,canvas.width,canvas.height);
    // Fondo
    drawSprite(levels[currentLevel].bg,0,0,canvas.width,canvas.height);

    // Jugador movimiento
    player.dy += player.gravity;
    player.y += player.dy;
    if(player.y + player.height > canvas.height-50){
        player.y = canvas.height-50-player.height;
        player.dy=0;
        player.onGround = true;
    }
    if(keys['ArrowLeft']) player.x -= player.speed;
    if(keys['ArrowRight']) player.x += player.speed;

    // Dibujar jugador
    drawSprite(player.sprite, player.x, player.y, player.width, player
