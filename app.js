// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Variables del juego
let currentLevel = 0;
const levels = [
    { name: "Disney", message: "Aquí me pediste ser tu novio en el parque de Mario 💖" },
    { name: "Crucero", message: "Nuestro viaje en crucero, tan hermoso juntos 🌊" },
    { name: "Próximo viaje", message: "Nuestro próximo viaje a Disney, más aventuras ✨" }
];

// Jugador
const player = {
    x: 50,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    color: "#ff1493",
    speed: 7,
    dy: 0,
    gravity: 0.7,
    jumpForce: -15,
    onGround: true
};

// Enemigos
let enemies = [];

// Crear enemigos
function createEnemies() {
    enemies = [];
    for(let i=0; i<5; i++){
        enemies.push({
            x: 200 + i*200,
            y: canvas.height - 100,
            width: 50,
            height: 50,
            color: "#8b0000",
            speed: 2 + i*0.5
        });
    }
}

// Mostrar mensaje
function showMessage(text){
    document.getElementById('levelMessage').innerText = text;
}

// Reiniciar jugador y enemigos
function resetLevel(){
    player.x = 50;
    player.y = canvas.height - 100;
    player.dy = 0;
    player.onGround = true;
    createEnemies();
    showMessage(levels[currentLevel].message);
}

// Detección de colisiones
function checkCollisions() {
    for(let enemy of enemies){
        if(player.x < enemy.x + enemy.width &&
           player.x + player.width > enemy.x &&
           player.y < enemy.y + enemy.height &&
           player.y + player.height > enemy.y){
            alert("¡Te mató un enemigo! Reiniciando nivel 😢");
            resetLevel();
        }
    }
}

// Dibujo
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar jugador
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Dibujar enemigos
    for(let enemy of enemies){
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.x -= enemy.speed;
        if(enemy.x + enemy.width < 0) enemy.x = canvas.width;
    }
}

// Actualizar física
function update(){
    // gravedad
    player.dy += player.gravity;
    player.y += player.dy;

    if(player.y + player.height >= canvas.height){
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    }

    checkCollisions();

    // Meta al final del nivel
    if(player.x + player.width >= canvas.width){
        currentLevel++;
        if(currentLevel >= levels.length){
            // Juego terminado
            document.getElementById('gameCanvas').style.display = 'none';
            document.getElementById('levelMessage').style.display = 'none';
            document.getElementById('proposal').style.display = 'block';
        } else {
            resetLevel();
        }
    }

    draw();
    requestAnimationFrame(update);
}

// Controles teclado
document.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowRight') player.x += player.speed;
    if(e.key === 'ArrowLeft') player.x -= player.speed;
    if(e.key === 'ArrowUp' && player.onGround){
        player.dy = player.jumpForce;
        player.onGround = false;
    }
});

// Controles táctiles
document.addEventListener('touchstart', (e)=>{
    player.dy = player.jumpForce;
    player.onGround = false;
});
document.addEventListener('touchmove', (e)=>{
    const touch = e.touches[0];
    if(touch.clientX < window.innerWidth/2){
        player.x -= player.speed;
    } else {
        player.x += player.speed;
    }
});

// Ajustar canvas al cambiar tamaño
window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    resetLevel();
});

// Iniciar juego
resetLevel();
update();
