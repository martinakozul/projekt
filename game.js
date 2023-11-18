var userSpaceship;
var asteroids;
var frameCount = 0;

window.addEventListener("keydown", moveSpaceship, false)
function moveSpaceship(e) {
    console.log(e)
    switch (e.keyCode) {
        case 32: { //restart using spacebar
            if (!userSpaceship.isEnabled){
                location.reload()
            }
            break;
        }
        case 37: { 
            userSpaceship.moveX(-1)
            userSpaceship.update();
            break;
        }
        case 38: { 
            userSpaceship.moveY(-1)
            userSpaceship.update();
            break;
        }
        case 39: { 
            userSpaceship.moveX(1)
            userSpaceship.update();
            break;
        }
        case 40: { 
            userSpaceship.moveY(1)
            userSpaceship.update();
            break;
        }
    }
}

function startGame() {
    asteroids = []
    userSpaceship = new spaceship(30, 30, window.innerWidth/2, window.innerHeight/2) 
    generateAsteroids(30)
    myGameArea.start();
}

function generateAsteroids(numOfAsteroids) {
    for (let i = 0; i < numOfAsteroids; i++) { 
        let comingFromTop = generateRandomInt(0, 1) 
        let comingFromLeft = generateRandomInt(0, 1)
        let startWidth = (comingFromLeft == 1) ? generateRandomInt(-200, 0) : generateRandomInt(window.innerWidth + 100, window.innerWidth + 300);
        let startHeight = (comingFromTop == 1) ? generateRandomInt(-200, 0) : generateRandomInt(window.innerHeight+ 100, window.innerHeight + 300);
        let speedX = (comingFromLeft == 1) ? generateRandomInt(2, 5) : generateRandomInt(-5, -2);
        let speedY = (comingFromTop == 1) ? generateRandomInt(-5, -2) : generateRandomInt(2, 5);
        asteroids[asteroids.length] = new asteroid(30, 30, startWidth, startHeight, speedX, speedY) 
    }
}

function generateRandomInt(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
  
	var myGameArea = {
		canvas : document.createElement("canvas"),
		start : function() {
			this.canvas.id = "myGameCanvas";
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
			this.context = this.canvas.getContext("2d");
			document.body.insertBefore(this.canvas, document.body.childNodes[0]);
			this.frameNo = 0;
			this.interval = setInterval(updateGameArea, 20);
		},
		stop : function() {
			clearInterval(this.interval);
		},
		clear : function() {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}

    function asteroid(width, height, x, y, speed_x, speed_y) {
		this.width = width;
		this.height = height;
		this.speed_x = speed_x
		this.speed_y = speed_y
		this.x = x;
		this.y = y;

		this.update = function() {
			ctx = myGameArea.context;
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.fillStyle = "black";
			ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
			ctx.restore();
		}
		this.newPos = function() {
			this.x += this.speed_x;
			this.y -= this.speed_y;
		}
        this.collisionWithSpaceship = function() {
            return !(userSpaceship.x > (this.x + this.width) || 
             (userSpaceship.x + userSpaceship.width) < this.x || 
             userSpaceship.y > (this.y + this.height) ||
             (userSpaceship.y + userSpaceship.height) < this.y);
        }
	}

    function detectCollision() {
        for (let i = 0; i < asteroids.length; i++) { 
            if (asteroids[i].collisionWithSpaceship()) {
                myGameArea.stop()
                userSpaceship.isEnabled = false
            }
        }
    }

	function spaceship(width, height, x, y) {
		this.width = width;
		this.height = height;
		this.speed_x = 2;
		this.speed_y = 2;
        this.isEnabled = true
		this.x = x;
		this.y = y;
		this.update = function() {
			ctx = myGameArea.context;
			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.fillStyle = "red";
			ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
			ctx.restore();
		}
        this.moveX = function(direction) {
            if (this.isEnabled){
                this.x += this.speed_x  * direction * 10
            }
        }
        this.moveY = function(direction) {
            if (this.isEnabled){
                this.y += this.speed_y * direction  * 10
            }
        }
	}
	
	function updateGameArea() {
		myGameArea.clear();
		userSpaceship.update();
        for (let i = 0; i < asteroids.length; i++) { 
            asteroids[i].newPos()
            asteroids[i].update()
        }
        detectCollision()
	}