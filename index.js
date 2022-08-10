const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './img/background.png'
});

const shop = new Sprite({
	position: {
		x: 600,
		y: 128
	},
	imageSrc: './img/shop.png',
	framesMax: 6,
	scale: 2.75
});

const player = new Fighter({
	position: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	imageSrc: './img/samurai/Idle.png',
	framesMax: 8,
	scale: 2.5,
	offset: {
		x: 180,
		y: 156
	},
	sprites: {
		idle: {
			imageSrc: './img/samurai/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: './img/samurai/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/samurai/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/samurai/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './img/samurai/Attack1.png',
			framesMax: 6
		}
	}
});

const enemy = new Fighter({
	position: {
		x: 400,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0
	},
	imageSrc: './img/kenji/Idle.png',
	framesMax: 4,
	scale: 2.5,
	offset: {
		x: 180,
		y: 170
	}
});

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	w: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	}
};

function decreaseTimer() {
	if (timer > 0) {
		timerId = setTimeout(decreaseTimer, 1000);
		timer--;
		document.querySelector('#timer').innerHTML = timer;
	} else {
		determineWinner({player, enemy, timerId});
	}
}

decreaseTimer();

function animate() {
	window.requestAnimationFrame(animate);
	c.fillStyle = 'black';
	c.fillRect(0, 0, canvas.width, canvas.height);

	background.update();
	shop.update();
	player.update();
	enemy.update();

	player.velocity.x = 0;

	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5;
		player.switchSprite('run');
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5;
		player.switchSprite('run');
	} else {
		player.switchSprite('idle');
	}

	if (player.velocity.y < 0) {
		player.switchSprite('jump');
	} else if (player.velocity.y > 0) {
		player.switchSprite('fall');
	}

	enemy.velocity.x = 0;
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5;
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5;
	}

	if (rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking) {
		player.isAttacking = false;
		enemy.health -= 20;
		document.querySelector('#enemyHealth').style.width = `${enemy.health}%`;
	}

	if (rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking) {
		enemy.isAttacking = false;
		player.health -= 20;
		document.querySelector('#playerHealth').style.width = `${player.health}%`;
	}

	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({player, enemy, timerId});
	}
}

animate();

window.addEventListener('keydown', (e) => {
	switch(e.key) {
		case 'd':
			keys.d.pressed = true;
			player.lastKey = 'd';
			break;
		case 'a':
			keys.a.pressed = true;
			player.lastKey = 'a';
			break;
		case 'w':
			player.velocity.y = -20;
			break;
		case ' ':
			player.attack();
			break;
		case 'ArrowRight':
			keys.ArrowRight.pressed = true;
			enemy.lastKey = 'ArrowRight';
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true;
			enemy.lastKey = 'ArrowLeft';
			break;
		case 'ArrowUp':
			enemy.velocity.y = -20;
			break;
		case 'ArrowDown':
			enemy.attack();
			break;
	}
});

window.addEventListener('keyup', (e) => {
	switch(e.key) {
		case 'd':
			keys.d.pressed = false;
			break;
		case 'a':
			keys.a.pressed = false;
			break;
		case 'ArrowRight':
			keys.ArrowRight.pressed = false;
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false;
			break;
	}
});