var canvas = document.getElementById("canvas");
var failedscreen = document.getElementById("failed");
var counterscreen = document.querySelector("#counter div");
var result = document.getElementById("result");
var ctx = canvas.getContext("2d");
var ice = [];
var fire = [];
var timer = 0;
var ship = { x: 100, y: 320 };

var bg = new Image();
bg.src = "img/ocean.jpg";

var iceimg = new Image();
iceimg.src = "img/ice.png";

var shipimg = new Image();
shipimg.src = "img/ship.png";

var fireimg = new Image();
fireimg.src = "img/fire.png";

var failed = false;
var counter = 0;

bg.onload = function () {
	gameLoop();
};

//перемещаем корабль за курсором
canvas.addEventListener("mousemove", function (event) {
	ship.x = event.offsetX - 50;
	ship.y = event.offsetY - 25;
});

canvas.addEventListener("touchmove", function (event) {
	ship.x = event.offsetX - 50;
	ship.y = event.offsetY - 25;
});

function gameLoop() {
	if (failed) {
		result.innerHTML = counter;
		counterscreen.style.display = "none";
		failedscreen.style.display = "block";
	} else {
		update();
		render();
		requestAnimationFrame(gameLoop);
	}
}

function update() {
	timer++;
	if (timer % 50 == 0) {
		ice.push({
			posX: 700,
			posY: Math.random() * 549,
			speedX: Math.random() * 2 + 1,
			speedY: Math.random() * 2 - 1,
			hit: false,
		});
	}
	if (timer % 30 == 0) {
		fire.push({ x: ship.x + 80, y: ship.y + 20, speedY: 0, speedX: 8 });
	}

	for (i in ice) {
		ice[i].posY += ice[i].speedY; //смещаем льдины
		ice[i].posX -= ice[i].speedX;

		//создаем эффект отталкивания льдин от верха и низа поля
		if (ice[i].posY > 550 || ice[i].posY < 0) {
			ice[i].speedY *= -1;
		}

		//при выходе одной из льдин за левый край засчитываем проигрыш
		if (ice[i].posX < -20) {
			failed = true;
		}

		//проверяем на попадания
		for (j in fire) {
			if (
				Math.abs(ice[i].posX + 25 - fire[j].x - 15) < 50 &&
				Math.abs(ice[i].posY - fire[j].y) < 25
			) {
				//при попадании выставляем hit в true
				ice[i].hit = true;
				fire.splice(j, 1);
				break;
			}
		}
		//удаляем сбитую льдину
		if (ice[i].hit === true) {
			ice.splice(i, 1);
			counter += 1;
			counterscreen.innerHTML = counter;
			console.log(counter);
		}
	}

	//смещаем огонь, удаляем огонь вышедший за правый край
	for (i in fire) {
		fire[i].x += fire[i].speedX;
		if (fire[i].x > 750) {
			fire.splice(i, 1);
		}
	}
}

//отрисовываем изображения
function render() {
	ctx.drawImage(bg, 0, 0, 700, 700);
	ctx.drawImage(shipimg, ship.x, ship.y, 110, 100);
	for (i in ice) {
		ctx.drawImage(iceimg, ice[i].posX, ice[i].posY, 70, 50);
	}
	for (i in fire) {
		ctx.drawImage(fireimg, fire[i].x, fire[i].y, 40, 40);
	}
}
