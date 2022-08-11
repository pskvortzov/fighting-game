const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.imageSmoothingEnabled = false;

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
		y: 96
	},
	imageSrc: './img/shop.png',
	framesMax: 6,
	scale: 3
});

const player = new Fighter({
	position: {
		x: 120,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	imageSrc: './img/samurai/Idle.png',
	framesMax: 8,
	scale: 3,
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
		},
		takeHit: {
			imageSrc: './img/samurai/Take Hit - white silhouette.png',
			framesMax: 4
		},
		death: {
			imageSrc: './img/samurai/Death.png',
			framesMax: 6
		}
	},
	attackBox: {
		offset: {
			x: 130,
			y: -30
		},
		width: 163,
		height: 180
	}
});

const enemy = new Fighter({
	position: {
		x: 770,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0
	},
	imageSrc: './img/kenji/Idle.png',
	framesMax: 4,
	scale: 3,
	offset: {
		x: 180,
		y: 174
	},
	sprites: {
		idle: {
			imageSrc: './img/kenji/Idle.png',
			framesMax: 4
		},
		run: {
			imageSrc: './img/kenji/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/kenji/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/kenji/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './img/kenji/Attack1.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: './img/kenji/Take hit.png',
			framesMax: 3
		},
		death: {
			imageSrc: './img/kenji/Death.png',
			framesMax: 7
		}
	},
	attackBox: {
		offset: {
			x: -138,
			y: 0
		},
		width: 138,
		height: 150
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
	c.fillStyle = 'rgba(255,255,255, .2)';
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	enemy.update();

	player.velocity.x = 0;

	if (keys.a.pressed && player.lastKey === 'a') {
		player.switchSprite('run');
		if (player.position.x > -80) {
			player.velocity.x = -5;
		}
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.switchSprite('run');
		if (player.position.x < 870) {
			player.velocity.x = 5;
		}
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
		enemy.switchSprite('run');
		if (enemy.position.x > -80) {
			enemy.velocity.x = -5;
		}
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.switchSprite('run');
		if (enemy.position.x < 880) {
			enemy.velocity.x = 5;
		}
	} else {
		enemy.switchSprite('idle');
	}

	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump');
	} else if (enemy.velocity.y > 0) {
		enemy.switchSprite('fall');
	}


	if (
		rectangularCollision({rectangle1: player, rectangle2: enemy}) &&
		player.isAttacking &&
		player.framesCurrent >= 4) {
		enemy.takeHit();
		player.isAttacking = false;
		document.querySelector('#enemyHealth').style.width = `${enemy.health}%`;
	}

	if (player.isAttacking && player.framesCurrent >= 4) {
		player.isAttacking = false;
	}

	if (rectangularCollision({rectangle1: enemy, rectangle2: player}) &&
		enemy.isAttacking &&
		enemy.framesCurrent === 2) {
		enemy.isAttacking = false;
		player.takeHit();
		document.querySelector('#playerHealth').style.width = `${player.health}%`;
	}

	if (enemy.isAttacking && enemy.framesCurrent === 2) {
		enemy.isAttacking = false;
	}

	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({player, enemy, timerId});
	}
}

animate();

window.addEventListener('keydown', (e) => {
	if (!player.dead) {
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
		}
	}

	if (!enemy.dead) {
		switch(e.key) {
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