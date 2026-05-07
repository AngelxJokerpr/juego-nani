const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startBtn = document.getElementById('startBtn');
const startMenu = document.getElementById('startMenu');

startBtn.addEventListener('click', () => {
    startMenu.style.display = 'none';
    canvas.style.display = 'block';
    startGame();
});

const player = {x:50,y:canvas.height-100,w:50,h:50,dx:0,dy:0,spd:5,gravity:0.7,jump:-15,onGround:false};
const keys = {left:false,right:false,jump:false};

document.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowLeft') keys.left=true;
    if(e.key==='ArrowRight') keys.right=true;
    if(e.key==='ArrowUp') keys.jump=true;
});
document.addEventListener('keyup', (e)=>{
    if(e.key==='ArrowLeft') keys.left=false;
    if(e.key==='ArrowRight') keys.right=false;
    if(e.key==='ArrowUp') keys.jump=false;
});

// MOVIMIENTO TÁCTIL (móvil)
const createTouchControls=()=>{
    const leftBtn=document.createElement('button');
    leftBtn.innerText='⬅️'; document.body.appendChild(leftBtn);
    leftBtn.style.position='absolute'; leftBtn.style.bottom='20px'; leftBtn.style.left='20px';
    leftBtn.style.fontSize='2em';
    leftBtn.addEventListener('touchstart',()=>keys.left=true);
    leftBtn.addEventListener('touchend',()=>keys.left=false);

    const rightBtn=document.createElement('button');
    rightBtn.innerText='➡️'; document.body.appendChild(rightBtn);
    rightBtn.style.position='absolute'; rightBtn.style.bottom='20px'; rightBtn.style.left='100px';
    rightBtn.style.fontSize='2em';
    rightBtn.addEventListener('touchstart',()=>keys.right=true);
    rightBtn.addEventListener('touchend',()=>keys.right=false);

    const jumpBtn=document.createElement('button');
    jumpBtn.innerText='⛅'; document.body.appendChild(jumpBtn);
    jumpBtn.style.position='absolute'; jumpBtn.style.bottom='20px'; jumpBtn.style.right='20px';
    jumpBtn.style.fontSize='2em';
    jumpBtn.addEventListener('touchstart',()=>keys.jump=true);
    jumpBtn.addEventListener('touchend',()=>keys.jump=false);
}

createTouchControls();

function startGame(){
    requestAnimationFrame(gameLoop);
}

function gameLoop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // FONDO
    ctx.fillStyle='#87CEEB';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // PLATAFORMA SUELO
    ctx.fillStyle='#654321';
    ctx.fillRect(0,canvas.height-50,canvas.width,50);

    // MOVIMIENTO PLAYER
    if(keys.left) player.x -= player.spd;
    if(keys.right) player.x += player.spd;
    if(keys.jump && player.onGround){player.dy=player.jump; player.onGround=false;}

    player.dy += player.gravity;
    player.y += player.dy;

    if(player.y + player.h >= canvas.height-50){
        player.y = canvas.height-50 - player.h;
        player.dy =0;
        player.onGround = true;
    }

    // DIBUJAR PLAYER
    ctx.fillStyle='red';
    ctx.fillRect(player.x,player.y,player.w,player.h);

    requestAnimationFrame(gameLoop);
}
