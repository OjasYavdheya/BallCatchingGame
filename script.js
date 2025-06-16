const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Player settings
let player = { x: 100, y: 500, radius: 25, speed: 15, dx: 0, dy: 0 };

// Score
let score = 0;
let gameSpeed = 1; // Speed multiplier

// Falling balls settings
let balls = [];
const ballRadius = 10; // Fixed size for all balls
const ballSpeed = 4; // Fixed speed for all balls

// Load the baseball ground image
const backgroundImage = new Image();
backgroundImage.src = "bg 6.png"; // Replace with your image path

// Load the baseball image
const baseballImage = new Image();
baseballImage.src = "7.png"; // Replace with your image path

const gloveImage = new Image();
gloveImage.src = "Glove.png"; // Replace with your baseball glove image path

function spawnBall() {
    let currentSpeed = Math.max(1, ballSpeed + score); // Ensure speed doesn't go below 1
    balls.push({ 
        x: Math.random() * canvas.width, 
        y: 0, 
        radius: 15, // Set appropriate radius for baseball image 
        speed: currentSpeed 
    });
}

setInterval(spawnBall, 1000); // Spawn a new ball every second

// Keys object to track multiple key presses
let keys = {};

document.addEventListener("keydown", (event) => keys[event.key] = true);
document.addEventListener("keyup", (event) => keys[event.key] = false);

function gameLoop() {
    // Draw the background image (baseball ground)
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    // Move player
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;
    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;

    // Update player position
    player.x += player.dx;
    player.y += player.dy;

    // Boundary conditions
    if (player.x - player.radius < 0) player.x = player.radius;
    if (player.x + player.radius > canvas.width) player.x = canvas.width - player.radius;
    if (player.y - player.radius < 0) player.y = player.radius;
    if (player.y + player.radius > canvas.height) player.y = canvas.height - player.radius;

    // Draw player as a baseball glove image
ctx.drawImage(gloveImage, player.x - player.radius, player.y - player.radius, player.radius * 2, player.radius * 2);

    // Update and draw falling balls
    for (let i = balls.length - 1; i >= 0; i--) {
        let ball = balls[i];
        ball.y += ball.speed;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw the baseball image
        ctx.drawImage(baseballImage, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);

        // Collision detection
        let dx = player.x - ball.x;
        let dy = player.y - ball.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius + ball.radius) {
            balls.splice(i, 1); // Remove ball if it touches player
            score++; // Increase score
            gameSpeed += 0.05; // Increase game speed
        } else if (ball.y + ball.radius > canvas.height) {
            balls.splice(i, 1); // Remove ball if it touches bottom
            score--; // Decrease score
        }
    }

    // Draw score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    requestAnimationFrame(gameLoop);
}
gameLoop();