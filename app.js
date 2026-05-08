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

const sceneMessageDiv = document.getElementById('sceneMessage');

// Escenas
const scenes = [
    {
        background: 'assets/background1.png',
        message: "Recuerdo nuestro primer viaje a Disney, Jonayliz, donde me pediste ser tu novio. Cada instante contigo fue un sueño lleno de risas, abrazos y aventuras. Gracias por estos 7 meses de amor, alegría y magia juntos."
    },
    {
        background: 'assets/background2.png',
        message: "Nuestro crucero fue mágico, lleno de paisajes increíbles y momentos inolvidables. Cada atardecer contigo parecía una pintura, y tus risas mi melodía favorita. Gracias por estos 7 meses a tu lado, Jonayliz."
    },
    {
        background: 'assets/background3.png',
        message: "Nuestro segundo viaje a Disney está lleno de ilusión y emoción. Cada paseo y abrazo contigo se convierte en un recuerdo eterno. Jonayliz, cada día contigo me hace más feliz, y quiero seguir celebrando cada momento contigo."
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

        // Mostrar mensaje en div
        sceneMessageDiv.textContent = scenes[currentScene].message;
    };
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
            sceneMessageDiv.style.display='none';
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
