// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Jugador
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

// Enemigos
const enemies = [
    { x: 400, y: canvas.height - 150, width: 60, height: 60, dx: 3, sprite:'assets/enemy.png'},
    { x: 800, y: canvas.height - 150, width: 60, height: 60, dx: 2, sprite:'assets/enemy.png'}
];

// NPCs con mensajes
const npcs = [
    {
        x: 300,
        y: canvas.height - 150,
        width: 80,
        height: 80,
        messages: [
            "Jonayliz, eres la persona más hermosa que conozco 💕",
            "Te amo más que ayer, pero menos que mañana 🌸",
            "Tu sonrisa ilumina todos mis días ✨",
            "Cada momento contigo es mágico 💖"
        ],
        currentMsg: 0,
        timer: 0,
        sprite: 'assets/girlfriend.png'
    }
];

// Niveles
const levels = [1,2,3];
let currentLevel = 0;

// Key control
const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

// Salto
document.addEventListener('keydown', e=>{
    if(e.key === ' ' && player.onGround){
        player.dy = player.jumpPower;
        player.onGround = false;
    }
});

// Touch control
document.addEventListener('touchmove', e=>{
    const touch = e.touches[0];
    if(touch.clientX < window.innerWidth/2) player.x -= player.speed;
    else player.x += player.speed;
});

// Dibujar sprites
function drawSprite(url,x,y,w,h){
    const img = new Image();
    img.src = url;
    ctx.drawImage(img,x,y,w,h);
}

// Reset level
function resetLevel(){
    player.x = 50;
    player.y = canvas.height - 150;
    enemies.forEach((e,i)=>{
        e.x = 400 + i*400;
    });
}

// Colisiones
function checkCollisions(){
    enemies.forEach(e=>{
        if(player.x < e.x + e.width &&
           player.x + player.width > e.x &&
           player.y < e.y + e.height &&
           player.y + player.height > e.y){
               // choque: reiniciar nivel
               resetLevel();
           }
    });
}

// NPC Mensajes
function updateNPCMessages(deltaTime) {
    npcs.forEach(npc => {
        npc.timer += deltaTime;
        if (npc.timer > 5000) {
            npc.timer = 0;
            npc.currentMsg++;
            if (npc.currentMsg >= npc.messages.length) npc.currentMsg = 0;
        }
    });
}

function drawNPCBubbles() {
    npcs.forEach(npc => {
        const text = npc.messages[npc.currentMsg];
        ctx.font = "20px Arial";
        ctx.textAlign = "center";

        // Burbujas
        const padding = 10;
        const textWidth = ctx.measureText(text).width;
        const bubbleWidth = textWidth + padding*2;
        const bubbleHeight = 30;
        const bubbleX = npc.x + npc.width/2;
        const bubbleY = npc.y - 40;

        ctx.fillStyle = "rgba(255, 192, 203, 0.9)";
        ctx.strokeStyle = "#ff69b4";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bubbleX - bubbleWidth/2, bubbleY - bubbleHeight/2, bubbleWidth, bubbleHeight, 10);
        ctx.fill();
        ctx.stroke();

        // Texto
        ctx.fillStyle = "#fff";
        ctx.fillText(text, bubbleX, bubbleY + 7);

        // Dibujar NPC
        drawSprite(npc.sprite,npc.x,npc.y,npc.width,npc.height);
    });
}

// RoundRect polyfill
if(!CanvasRenderingContext2D.prototype.roundRect){
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
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

// Dibujar todo
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // fondo según nivel
    drawSprite(`assets/background${currentLevel+1}.png`,0,0,canvas.width,canvas.height);

    // jugador
    drawSprite(player.sprite,player.x,player.y,player.width,player.height);

    // enemigos
    enemies.forEach(e=>{
        e.x += e.dx;
        if(e.x + e.width > canvas.width || e.x < 0) e.dx *= -1;
        drawSprite(e.sprite,e.x,e.y,e.width,e.height);
    });

    // NPCs
    drawNPCBubbles();
}

// Carta final con anillos
function createRings(){
    const container = document.getElementById('ringsContainer');
    container.innerHTML='';
    for(let i=0;i<8;i++){
        const ring = document.createElement('div');
        ring.className='ring';
        ring.style.left = `${Math.random()*90}%`;
        ring.style.animationDuration = `${2+Math.random()*3}s`;
        container.appendChild(ring);
    }
}

// Update loop
let lastTime = 0;
function update(time=0){
    const deltaTime = time - lastTime;
    lastTime = time;

    // movimiento jugador
    if(keys['ArrowRight']) player.x += player.speed;
    if(keys['ArrowLeft']) player.x -= player.speed;
    player.dy += player.gravity;
    player.y += player.dy;
    if(player.y + player.height >= canvas.height){
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }

    checkCollisions();

    if(player.x + player.width >= canvas.width){
        currentLevel++;
        if(currentLevel >= levels.length){
            canvas.style.display = 'none';
            document.getElementById('finalCard').style.display = 'block';
            createRings();
        } else {
            resetLevel();
        }
    }

    draw();
    updateNPCMessages(deltaTime);
    requestAnimationFrame(update);
}

resetLevel();
update();
