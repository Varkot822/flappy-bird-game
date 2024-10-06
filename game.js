const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const birdImage = new Image(); // Зображення пташки
birdImage.src = "bird.png"; // Вкажіть шлях до зображення пташки

const topPipeImage = new Image(); // Зображення верхньої труби
topPipeImage.src = "top-pipe.png"; // Вкажіть шлях до зображення верхньої труби

const bottomPipeImage = new Image(); // Зображення нижньої труби
bottomPipeImage.src = "bottom-pipe.png"; // Вкажіть шлях до зображення нижньої труби

const jumpSound = document.getElementById("jumpSound");

const bird = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    gravity: 0.6,
    lift: -8,  // Сила стрибка
    velocity: 0
};

const pipes = [];
const pipeWidth = 60;
const pipeGap = 150;
let frame = 0;
let score = 0;
let gameSpeed = 2; // Початкова швидкість гри

// Обробка кліку мишкою для стрибка пташки
document.addEventListener("click", function() {
    bird.velocity = bird.lift;  // Підстрибування при кліку
    jumpSound.currentTime = 0; // Сбрасываем время воспроизведения
    jumpSound.play(); // Воспроизводим звук прыжка
});

// Обробка дотику на екрані (для мобільних пристроїв)
document.addEventListener("touchstart", function() {
    bird.velocity = bird.lift;  // Підстрибування при дотику
    jumpSound.currentTime = 0; // Сбрасываем время воспроизведения
    jumpSound.play(); // Воспроизводим звук прыжка
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
        pipe.x -= gameSpeed;  // Рух труб залежить від gameSpeed

        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }
    });
}

function drawPipes() {
    pipes.forEach(pipe => {
        // Малюємо верхню трубу
        ctx.drawImage(topPipeImage, pipe.x, 0, pipeWidth, pipe.topHeight);
        // Малюємо нижню трубу
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
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frame = 0;
    gameSpeed = 2; // Скидаємо швидкість при перезапуску
}

function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
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

    // Плавне збільшення швидкості з часом
    if (frame % 120 === 0) {  // Наприклад, кожні 2 секунди збільшується швидкість
        gameSpeed += 0.1;
    }

    requestAnimationFrame(gameLoop);
}

// Запуск гри після завантаження всіх зображень
let imagesLoaded = 0;

function checkAllImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 3) { // Чекаємо, поки всі три зображення завантажаться
        gameLoop();
    }
}

birdImage.onload = checkAllImagesLoaded;
topPipeImage.onload = checkAllImagesLoaded;
bottomPipeImage.onload = checkAllImagesLoaded;
