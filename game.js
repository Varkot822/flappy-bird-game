const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const birdImage = new Image();
birdImage.src = "bird.png"; 

const topPipeImage = new Image();
topPipeImage.src = "top-pipe.png"; 

const bottomPipeImage = new Image();
bottomPipeImage.src = "bottom-pipe.png";

const jumpSound = document.getElementById("jumpSound"); 

const bird = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    gravity: 0.6,
    lift: -8,
    velocity: 0
};

const pipes = [];
const pipeWidth = 60;
const pipeGap = 150;
let frame = 0;
let score = 0;
let gameSpeed = 2;

let highScore = localStorage.getItem('highScore') || 0; // Получаем рекорд из localStorage

document.addEventListener("click", function() {
    bird.velocity = bird.lift; 
    jumpSound.currentTime = 0;
    jumpSound.play(); 
});

document.addEventListener("touchstart", function() {
    bird.velocity = bird.lift;
    jumpSound.currentTime = 0;
    jumpSound.play();
});

function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    } else if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

function createPipes() {
    if (frame % 90 === 0) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({
            x: canvas.width,
            topHeight: pipeHeight,
            bottomY: pipeHeight + pipeGap
        });
    }
    pipes.forEach((pipe, index) => {
        pipe.x -= gameSpeed;

        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(topPipeImage, pipe.x, 0, pipeWidth, pipe.topHeight);
        ctx.drawImage(bottomPipeImage, pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
    });
}

function checkCollision() {
    pipes.forEach(pipe => {
        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)) {
            resetGame();
        }
    });
}

function resetGame() {
    if (score > highScore) {
        highScore = score; // Обновляем рекорд
        localStorage.setItem('highScore', highScore); // Сохраняем рекорд в localStorage
    }
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frame = 0;
    gameSpeed = 2; 
}

function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20); // Текущий счет
    ctx.fillText("High Score: " + highScore, 10, 40); // Рекорд
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    updateBird();

    createPipes();
    drawPipes();

    checkCollision();

    drawScore();

    frame++;

    if (frame % 120 === 0) {
        gameSpeed += 0.1;
    }

    requestAnimationFrame(gameLoop);
}

let imagesLoaded = 0;

function checkAllImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 3) { 
        gameLoop();
    }
}

birdImage.onload = checkAllImagesLoaded;
topPipeImage.onload = checkAllImagesLoaded;
bottomPipeImage.onload = checkAllImagesLoaded;
