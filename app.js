const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Menú de inicio
const startMenu = document.getElementById('startMenu');
const startBtn = document.getElementById('startBtn');

// Puzzle y carta final
const puzzleScreen = document.getElementById('puzzleScreen');
const puzzleCodeInput = document.getElementById('puzzleCode');
const submitCodeBtn = document.getElementById('submitCodeBtn');
const codeMessage = document.getElementById('codeMessage');

const finalCard = document.getElementById('finalCard');
const ringsContainer = document.getElementById('ringsContainer');
const proposeBtn = document.getElementById('proposeBtn');

// Variables del juego
let currentLevel = 0;
let player = { x:100, y:canvas.height-150, w:50, h:50, vx:0, vy:0, onGround:true };
let enemies = [];
let npcs = [];
let keys = {};

// Fondos
const backgrounds = ['assets/background1.png','assets/background2.png','assets/background3.png'];

// NPC y player
let playerImg = new Image(); playerImg.src = 'assets/player.png';
let girlfriendImg = new Image(); girlfriendImg.src = 'assets/girlfriend.png';
let enemyImg = new Image(); enemyImg.src = 'assets/enemy1.png';

// Eventos teclado
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// INICIO DEL JUEGO
startBtn.onclick = ()=>{
    startMenu.style.display='none';
    startGame();
};

// FUNCIONES DEL JUEGO
function startGame(){
    createLevel(currentLevel);
    requestAnimationFrame(gameLoop);
}

function createLevel(level){
    player.x=100; player.y=canvas.height-150;
    enemies=[];
    npcs=[];

    // Crear enemigos móviles
    for(let i=0;i<3;i++){
        enemies.push({
            x:200+i*300,
            y:canvas.height-150,
            w:50,
            h:50,
            vx:2+Math.random()*2
        });
    }

    // Crear NPCs que hablan
    npcs.push({x:500, y:canvas.height-150, msg:`Jonayliz, te amo más que ayer, menos que mañana 💖`});
}

function updatePlayer(){
    if(!player.onGround) player.vy +=0.5;
    player.y += player.vy;
    player.x += player.vx;

    if(player.y + player.h >= canvas.height-50){ 
        player.y = canvas.height-50 - player.h;
        player.vy =0;
        player.onGround = true;
    } else { player.onGround=false;}

    if(keys['ArrowRight']) player.vx=5;
    else if(keys['ArrowLeft']) player.vx=-5;
    else player.vx=0;

    if(keys[' '] && player.onGround) player.vy=-12;
}

function updateEnemies(){
    enemies.forEach(e=>{
        e.x += e.vx;
        if(e.x<0 || e.x+e.w>canvas.width) e.vx*=-1;

        if(player.x<e.x+e.w && player.x+player.w>e.x &&
           player.y<e.y+e.h && player.y+player.h>e.y){
               alert("¡Un enemigo te atrapó! Reiniciando nivel.");
               createLevel(currentLevel);
           }
    });
}

function drawLevel(){
    let bg = new Image(); bg.src = backgrounds[currentLevel];
    ctx.drawImage(bg,0,0,canvas.width,canvas.height);

    npcs.forEach(n=>{
        ctx.drawImage(girlfriendImg,n.x,n.y,50,50);
        ctx.fillStyle='white';
        ctx.font='20px Arial';
        ctx.fillText(n.msg,n.x-20,n.y-10);
    });

    enemies.forEach(e=>{
        ctx.drawImage(enemyImg,e.x,e.y,e.w,e.h);
    });

    ctx.drawImage(playerImg,player.x,player.y,player.w,player.h);
}

function nextLevelOrPuzzle(){
    currentLevel++;
    if(currentLevel>=backgrounds.length){
        showPuzzleScreen();
    } else {
        createLevel(currentLevel);
        requestAnimationFrame(gameLoop);
    }
}

function gameLoop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    updatePlayer();
    updateEnemies();
    drawLevel();

    if(player.x>canvas.width-100){
        nextLevelOrPuzzle();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

// Puzzle final
function showPuzzleScreen(){
    canvas.style.display='none';
    puzzleScreen.style.display='flex';
    puzzleCodeInput.value = '';
    codeMessage.textContent = '';
}

submitCodeBtn.addEventListener('click', ()=>{
    if(puzzleCodeInput.value.trim()==='071605'){
        puzzleScreen.style.display='none';
        showFinalCard();
    } else {
        codeMessage.textContent = 'Código incorrecto, intenta de nuevo ❤️';
    }
});

// Carta final con anillos animados
function showFinalCard(){
    finalCard.style.display='flex';
    ringsContainer.innerHTML = '';
    for(let i=0;i<6;i++){
        const ring = document.createElement('div');
        ring.style.width = '40px';
        ring.style.height = '40px';
        ring.style.border = '5px solid gold';
        ring.style.borderRadius = '50%';
        ring.style.position = 'absolute';
        ring.style.left = Math.random()*window.innerWidth + 'px';
        ring.style.top = Math.random()*200 + 'px';
        ring.style.animation = 'float 4s infinite alternate';
        ringsContainer.appendChild(ring);
    }
}

// Botón de propuesta final
proposeBtn.addEventListener('click', ()=>{
    alert('¡Te amo, Jonayliz! 💖 Gracias por estos 7 meses increíbles. ¿Aceptas seguir viviendo aventuras juntos? 🌟');
});
