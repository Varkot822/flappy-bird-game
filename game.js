const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Загружаем изображения
const birdImage = new Image();
birdImage.src = "bird.png"; // Замените на путь к изображению птицы

const topPipeImage = new Image();
topPipeImage.src = "top-pipe.png"; // Замените на путь к изображению верхней трубы

const bottomPipeImage = new Image();
bottomPipeImage.src = "bottom-pipe.png"; // Замените на путь к изображению нижней трубы

// Определяем объект птицы
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

// Обработка клика мыши для прыжка птицы
document.addEventListener("click", function() {
    bird.velocity = bird.lift; // Птица подскакивает при клике
    jumpSound.currentTime = 0; // Сбрасываем время воспроизведения
    jumpSound.play(); // Воспроизводим звук прыжка
});

// Обработка касания на экране (для мобильных устройств)
document.addEventListener("touchstart", function() {
    bird.velocity = bird.lift; // Птица подскакивает при касании
    jumpSound.currentTime = 0; // Сбрасываем время воспроизведения
    jumpSound.play(); // Воспроизводим звук прыжка
});

// Функция для отрисовки птицы
function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

// Функция для обновления состояния птицы
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Проверка на столкновение с нижней частью экрана
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
    } else if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

// Функция для создания труб
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

        // Удаляем трубы, которые вышли за пределы
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }
    });
}

// Функция для отрисовки труб
function drawPipes() {
    pipes.forEach(pipe => {
        // Рисуем верхнюю трубу
        ctx.drawImage(topPipeImage, pipe.x, 0, pipeWidth, pipe.topHeight);
        // Рисуем нижнюю трубу
        ctx.drawImage(bottomPipeImage, pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
    });
}

// Функция для проверки столкновений
function checkCollision() {
    pipes.forEach(pipe => {
        if (bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)) {
            resetGame(); // Если произошло столкновение, перезапускаем игру
        }
    });
}

// Функция для перезапуска игры
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frame = 0;
    gameSpeed = 2; // Сбрасываем скорость при перезапуске
}

// Функция для отрисовки счета
function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

// Основной игровой цикл
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    updateBird();

    createPipes();
    drawPipes();

    checkCollision();

    drawScore();

    frame++;

    // Плавное увеличение скорости со временем
    if (frame % 120 === 0) {
        gameSpeed += 0.1; // Увеличиваем скорость каждые 2 секунды
    }

    requestAnimationFrame(gameLoop);
}

// Запускаем игру после загрузки всех изображений
let imagesLoaded = 0;

function checkAllImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 3) { // Ждем, пока все три изображения загрузятся
        gameLoop();
    }
}

birdImage.onload = checkAllImagesLoaded;
topPipeImage.onload = checkAllImagesLoaded;
bottomPipeImage.onload = checkAllImagesLoaded;
