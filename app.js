const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const startMenu = document.getElementById('startMenu');
const startBtn = document.getElementById('startBtn');
const startCode = document.getElementById('startCode');
const codeMessage = document.getElementById('codeMessage');

const finalScene = document.getElementById('finalScene');
const finalMessage = document.getElementById('finalMessage');
const proposeBtn = document.getElementById('proposeBtn');

// Escenas
const scenes = [
    {
        background: 'assets/background1.png',
        message: "Recuerdo el primer viaje a Disney, Jonayliz, donde con tu sonrisa más hermosa me pediste ser tu novio. Cada segundo a tu lado fue un sueño, entre risas, abrazos y aventuras. Gracias por regalarme tu amor, tu paciencia y tu alegría. Este momento siempre será mi favorito de estos 7 meses juntos."
    },
    {
        background: 'assets/background2.png',
        message: "Nuestro crucero fue mágico, lleno de paisajes increíbles y momentos que jamás olvidaré. Cada atardecer contigo parecía una pintura y tus risas eran la melodía perfecta. Gracias por ser mi compañera de viaje, de vida y de corazón. Estos 7 meses me han enseñado lo hermoso que es amar y ser amado por ti, Jonayliz."
    },
    {
        background: 'assets/background3.png',
        message: "Nuestro segundo viaje a Disney está lleno de ilusión y emoción. Cada juego, cada paseo y cada abrazo a tu lado se convierten en recuerdos eternos. Jonayliz, cada día contigo me hace más feliz, y quiero seguir celebrando cada momento, cada aventura y cada sonrisa a tu lado. ¡Te amo infinitamente!"
    }
];

let currentScene = 0;

// Player
const player = {
    x: 50,
    y: canvas.height - 150,
    width: 80,
    height: 120,
    speed: 12,
    img: new Image()
};
player.img.src = 'assets/player.png';

let bgImg = new Image();
bgImg.src = scenes[currentScene].background;

// Comenzar
startBtn.onclick = () => {
    if(startCode.value === "071605"){
        startMenu.style.display='none';
        canvas.style.display='block';
        drawScene();
    } else {
        codeMessage.textContent = "Código incorrecto 😢";
    }
};

// Dibujar escena
function drawScene(){
    bgImg.src = scenes[currentScene].background;
    bgImg.onload = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(bgImg,0,0,canvas.width,canvas.height);
        ctx.drawImage(player.img, player.x, player.y, player.width, player.height);
        ctx.fillStyle = "white";
        ctx.font = "26px Arial";
        wrapText(ctx, scenes[currentScene].message, 30, 50, canvas.width - 60, 32);
    };
}

// Función para texto largo en canvas
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';
    for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        if(metrics.width > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

// Mover jugador
function movePlayer(){
    player.x += player.speed;
    if(player.x + player.width >= canvas.width){
        currentScene++;
        if(currentScene < scenes.length){
            player.x = 50;
            drawScene();
        } else {
            canvas.style.display='none';
            finalScene.style.display='flex';
            finalMessage.textContent = "Estos 7 meses juntos han sido los más hermosos de mi vida, Jonayliz. Cada día contigo es un regalo, y quiero pasar todas mis aventuras futuras a tu lado. 💖";
        }
    } else {
        drawScene();
    }
}

// Eventos para PC y móvil
window.addEventListener('keydown', (e)=>{
    if(e.key === "ArrowRight"){
        movePlayer();
    }
});

canvas.addEventListener('touchstart', movePlayer);
canvas.addEventListener('click', movePlayer);

// Botón propuesta
proposeBtn.onclick = ()=>{
    alert("¡Jonayliz! 💖 Te amo infinitamente y quiero pasar toda mi vida contigo. ¡Sí, quiero casarme contigo! 💍");
};
