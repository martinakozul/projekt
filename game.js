const NUM_OF_ASTEROIDS = 30
const GENERATION_INTERVAL = 5000

const shadesOfGray = ['#f1f1f14a', "#f1f1f1ad", "#3a3a3aad"]

let [milliseconds,seconds,minutes] = [0,0,0]; //set inital timer values to 0
var timerString = "00:00:0000"

var userSpaceship;
var asteroids;
var frameCount = 0;

var generateInterval;
var timerInterval;

function startGame() {
    [milliseconds,seconds,minutes] = [0,0,0] //reset inital timer values to 0
    asteroids = []
    userSpaceship = new spaceship(30, 30, window.innerWidth/2, window.innerHeight/2) //beginning location should be in the middle of the screen => window.innerWidth/2, window.innerHeight/2
    generateAsteroids(NUM_OF_ASTEROIDS)
    generateInterval = setInterval(function() { //generate new asteroids every 5 seconds
        generateAsteroids(NUM_OF_ASTEROIDS)
    }, GENERATION_INTERVAL);
    timerInterval = setInterval(function() {
        displayTimer()
    }, 10);
    myGameArea.start();
}

function displayTimer() { 
    // calculate current passed time every 10 milliseconds
    milliseconds += 10; 
    if(milliseconds == 1000){ 
        milliseconds = 0;
        seconds++;
        if(seconds == 60){
            seconds = 0;
            minutes++;
            if(minutes == 60){
                minutes = 0;
            }
        }
    }
    timerString = "" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0") + "." + String(milliseconds).padStart(4, "0") //format timer
}

window.addEventListener("keydown", moveSpaceship, false)
function moveSpaceship(e) {
    switch (e.keyCode) {
        case 37: { //left
            userSpaceship.moveX(-1)
            userSpaceship.update();
            break;
        }
        case 38: { //up
            userSpaceship.moveY(-1)
            userSpaceship.update();
            break;
        }
        case 39: { //right
            userSpaceship.moveX(1)
            userSpaceship.update();
            break;
        }
        case 40: { //down
            userSpaceship.moveY(1)
            userSpaceship.update();
            break;
        }
    }
}

function generateAsteroids(numOfAsteroids) {
    for (let i = 0; i < numOfAsteroids; i++) { 
        let comingFromTop = generateRandomInt(0, 1) 
        let comingFromLeft = generateRandomInt(0, 1)

        //generate asteroid at most 200px outside of the frame 
        let startWidth = (comingFromLeft == 1) ? generateRandomInt(-200, 0) : generateRandomInt(window.innerWidth, window.innerWidth + 200);
        let startHeight = (comingFromTop == 1) ? generateRandomInt(-200, 0) : generateRandomInt(window.innerHeight, window.innerHeight + 200);

        //asteroids coming from left must have positive x speed to move toward the visible part of canvas
        let speedX = (comingFromLeft == 1) ? generateRandomInt(2, 5) : generateRandomInt(-5, -2);
        //asteroids coming from top must have negative y speed to move toward the visible part of canvas
        let speedY = (comingFromTop == 1) ? generateRandomInt(-5, -2) : generateRandomInt(2, 5);
        asteroids[asteroids.length] = new asteroid(startWidth, startHeight, speedX, speedY) 
    }
}

function generateRandomInt(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min) 
}
  
	var myGameArea = {
		canvas : document.createElement("canvas"),
		start : function() {
			this.canvas.id = "myGameCanvas";
			this.canvas.width = window.innerWidth; //fit canvas to screen width
			this.canvas.height = window.innerHeight; //fit canvas to screen height
			this.context = this.canvas.getContext("2d");
            this.context.font = "24px Arial";
			document.body.insertBefore(this.canvas, document.body.childNodes[0]);
			this.frameNo = 0;
			this.interval = setInterval(updateGameArea, 20);
		},
		stop : function() {
			clearInterval(this.interval);
		},
		clear : function() {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		},
        displayTimer : function() {
            ctx.textBaseline = "top"
            ctx.fillStyle = "green";
            this.context.fillText(timerString, 10, 10);
        },
        displayBestTime: function() {
            ctx.textBaseline = "top"
            ctx.fillStyle = "green";
            this.context.fillText("Best time: " + getBestTime(), 10, 40);
        }
	}

    function getBestTime() {
        let bestMinutes = localStorage.getItem("bestMinutes")
        let bestSeconds = localStorage.getItem("bestSeconds")
        let bestMilliseconds = localStorage.getItem("bestMilliseconds")

        //check if best time exists, return formatted string if it does, "00:00.0000" otherwise
        if (bestMinutes || bestSeconds || bestMiliseconds) {
            return "" + bestMinutes.padStart(2, "0") + ":" + bestSeconds.padStart(2, "0") + "." + bestMilliseconds.padStart(4, "0")
        } 
        return "00:00.0000"
    }

    function asteroid(x, y, speed_x, speed_y) {
		this.width = generateRandomInt(30, 40) ;
		this.height = this.width;
		this.speed_x = speed_x
		this.speed_y = speed_y
        this.color = shadesOfGray[generateRandomInt(0,2)];
		this.x = x;
		this.y = y;

		this.update = function() {
			ctx = myGameArea.context;
			ctx.save();
			ctx.translate(this.x, this.y);
            ctx.shadowBlur = 10;
            ctx.shadowColor = "black";
			ctx.fillStyle = this.color;
			ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
			ctx.restore();
		}
		this.newPos = function() {
			this.x += this.speed_x;
			this.y -= this.speed_y;
		}
        this.collisionWithSpaceship = function() {
            //if any part of spaceship overlapt with the asteroid, return true
            return !(userSpaceship.x > (this.x + this.width) || 
             (userSpaceship.x + userSpaceship.width) < this.x || 
             userSpaceship.y > (this.y + this.height) ||
             (userSpaceship.y + userSpaceship.height) < this.y);
        }
	}

    function detectCollision() {
        //check if any of the generated asteroids overlaps with the spaceship
        for (let i = 0; i < asteroids.length; i++) { 
            if (asteroids[i].collisionWithSpaceship()) {
                userSpaceship.isEnabled = false //disable moving after collision
                myGameArea.stop()
                saveTimeIfBest()
                clearInterval(timerInterval)
                clearInterval(generateInterval)
                startGame() //reset automatically
            }
        }
    }

    function saveTimeIfBest() {
        let bestMinutes = localStorage.getItem("bestMinutes")
        let bestSeconds = localStorage.getItem("bestSeconds")
        let bestMilliseconds = localStorage.getItem("bestMilliseconds")

        //check if theres already a saved time
        //there should be one unless its the first game or its been manually deleted
        if (bestMinutes || bestSeconds || bestMilliseconds) {
            if (bestMinutes > minutes) return 
            else if (bestMinutes == minutes && bestSeconds > seconds) return
            else if (bestMinutes == minutes && bestSeconds == seconds && bestMilliseconds > milliseconds) return
        } 
        localStorage.setItem("bestMinutes", minutes)
        localStorage.setItem("bestSeconds", seconds)
        localStorage.setItem("bestMilliseconds", milliseconds)
    }

	function spaceship(width, height, x, y) {
		this.width = width;
		this.height = height;
		this.speed_x = 2;
		this.speed_y = 2;
        this.isEnabled = true;
		this.x = x;
		this.y = y;
		this.update = function() {
			ctx = myGameArea.context;
			ctx.save();
			ctx.translate(this.x, this.y); //set new position

            //redraw spaceship
			ctx.fillStyle = "red";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "black";
			ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
			ctx.restore();
		}
        this.moveX = function(direction) {
            //direction value 1 if should move in right, -1 otherwise
            if (this.isEnabled){
                this.x += this.speed_x  * direction * 10
            }
        }
        this.moveY = function(direction) {
            //direction value 1 if should move down, -1 otherwise
            if (this.isEnabled){
                this.y += this.speed_y * direction  * 10
            }
        }
	}
	
	function updateGameArea() {
		myGameArea.clear();
		userSpaceship.update();
        myGameArea.displayTimer();
        //update every asteroid position
        for (let i = 0; i < asteroids.length; i++) { 
            asteroids[i].newPos()
            asteroids[i].update()
        }

        //check for collision
        detectCollision()
        myGameArea.displayBestTime()
	}