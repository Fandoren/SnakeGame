
//Статическая информация об игровом поле
var width = 640;
var height = 480;
var blockSize = 20;
var cols = width / blockSize;
var rows = height / blockSize;
var board; //Игровое поле
var context; //Полотно, на котором будет отрисовываться игровое поле
var gameStarted = false;

//Изначальный блок змеи
var snakeX = blockSize;
var snakeY = blockSize;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

var foodX;
var foodY;

var gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = height;
    board.width = width;
    context = board.getContext("2d"); 

    context.font = "15px Arial";
    context.textAlign = "center";
    context.fillStyle="black";
    context.fillRect(0, 0, board.width, board.height); //Полностью заполняем поле чёрным
    context.fillStyle="white";
    context.fillText("Для начала игры нажмите на клаваитуре 'Y'", width/2, height/2);

    placeFood(); //Изначальная установка еды
    document.addEventListener("keyup", changeDirection);
    document.addEventListener("keyup", startGame);
    document.addEventListener("keyup", endGame);

    setInterval(update, 90); //Обновляем экран каждве 90мс
}

function update() {
    if (gameStarted) {
        context.fillStyle="black";
        context.fillRect(0, 0, board.width, board.height); //Полностью заполняем поле чёрным
    
        context.fillStyle="red";
        context.fillRect(foodX, foodY, blockSize, blockSize); //Отрисовываем еду на поле
    
        //Если голова змеи находится на блоке еды, то увеличиваем массив тела. Добавляем массив еды для корректного смещения змеи
        if (snakeX == foodX && snakeY == foodY) {
            snakeBody.push([foodX, foodY]);
            placeFood();
        }
    
        for (let i = snakeBody.length-1; i > 0; i--) {
            snakeBody[i] = snakeBody[i-1]; //Смещаем тело змеи
        }
        if (snakeBody.length) {
            snakeBody[0] = [snakeX, snakeY]; //Первая координата в теле змеи - её голова
        }
    
        context.fillStyle="lime";
        snakeX += velocityX * blockSize;
        snakeY += velocityY * blockSize;
        context.fillRect(snakeX, snakeY, blockSize, blockSize); // Отрисовка головы змеи
        for (let i = 0; i < snakeBody.length; i++) {
            context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize); //Отрисовываем тело змеи
        }
    
        //Условие для Game Over
        if (snakeX < 0 || snakeX > cols*blockSize || snakeY < 0 || snakeY > rows*blockSize) {
            gameStarted = false;
            showGameOver();
        }
    
        for (let i = 0; i < snakeBody.length; i++) {
            if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
                gameStarted = false;
                showGameOver();
            }
        }
    } else {
        return
    }
}

//Handler изменения направления
function changeDirection(e) {
    if (gameStarted) {
        if (e.code == "ArrowUp" && velocityY != 1) {
            velocityX = 0;
            velocityY = -1;
        }
        else if (e.code == "ArrowDown" && velocityY != -1) {
            velocityX = 0;
            velocityY = 1;
        }
        else if (e.code == "ArrowLeft" && velocityX != 1) {
            velocityX = -1;
            velocityY = 0;
        }
        else if (e.code == "ArrowRight" && velocityX != -1) {
            velocityX = 1;
            velocityY = 0;
        }
    }
}

//Handler начала игры
function startGame(e) {
    if (e.code == "KeyY") {
        gameStarted = true;
        placeSnake();
        placeFood();
    }
}

function endGame(e) {
    if (gameStarted && (e.code == "KeyN" || e.code == "Escape")) {
        gameStarted = false;
        showGameOver();
    }
}

function showGameOver() {
    context.fillStyle = "white";
    context.fillText("Game over! Once more?", width/2, height/2);
    context.fillText("Yes = 'Y'   No = 'N'", width/2, height/2 + 50); 
}

//Генерация рандомных координат еды на поле, исходя из его размеров
function placeFood() {
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}

function placeSnake() {
    snakeBody = [];
    snakeX = Math.floor(Math.random() * cols) * blockSize;
    snakeY = Math.floor(Math.random() * rows) * blockSize;
    velocityX = 0;
    velocityY = 0;
}