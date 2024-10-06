const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const jumpSound = document.getElementById('jumpSound'); // Получаем элемент звука

// Инициализация переменных
let birdY = canvas.height / 2;
let birdGravity = 0.5;
let birdJump = -10;
let birdVelocity = 0;
let pipes = [];
let frameCount = 0;
let gameOver = false;

// Функция для создания труб
function createPipe() {
    const pipeHeight = Math.random() * (canvas.height - 200) + 50;
    pipes.push({ x: canvas.width, height: pipeHeight });
}

// Функция для обновления игры
function update() {
    if (gameOver) return;

    // Обновление положения птицы
    birdVelocity += birdGravity;
    birdY += birdVelocity;

    // Проверка столкновения с полом или потолком
    if (birdY + 20 > canvas.height || birdY < 0) {
        gameOver = true;
    }

    // Обновление труб
    if (frameCount % 75 === 0) {
        createPipe();
    }

    pipes.forEach((pipe) => {
        pipe.x -= 2;

        // Проверка столкновения с трубами
        if (pipe.x < 50 && pipe.x + 50 > 0 && (birdY < pipe.height || birdY + 20 > pipe.height + 150)) {
            gameOver = true;
        }
    });

    // Удаление труб, которые вышли за пределы
    pipes = pipes.filter(pipe => pipe.x + 50 > 0);

    frameCount++;
}

// Функция для рисования игры
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисование птицы
    ctx.fillStyle = 'yellow';
    ctx.fillRect(50, birdY, 20, 20);

    // Рисование труб
    pipes.forEach((pipe) => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, 50, pipe.height);
        ctx.fillRect(pipe.x, pipe.height + 150, 50, canvas.height);
    });

    // Проверка на окончание игры
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
    }
}

// Функция для управления птицей
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        birdVelocity = birdJump;
        jumpSound.currentTime = 0; // Сброс времени воспроизведения
        jumpSound.play(); // Воспроизведение звука прыжка
    }
});

// Основной игровой цикл
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Запуск игры
gameLoop();
