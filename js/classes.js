class Sprite {
	constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}) {
		this.position = position;
		this.height = 150;
		this.width = 50;
		this.framesMax = framesMax;
		this.framesCurrent = 0;
		this.framesElapsed = 0;
		this.framesHold = 5;
		this.image = new Image();
		this.image.src = imageSrc;
		this.scale = scale;
		this.offset = offset;
	}

	draw() {
		c.drawImage(
			this.image,
			this.image.width / this.framesMax * this.framesCurrent,
			0,
			this.image.width / this.framesMax,
			this.image.height,
			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			this.image.width / this.framesMax * this.scale,
			this.image.height * this.scale
		);
	}

	animateFrames() {
		this.framesElapsed++;

		if (this.framesElapsed % this.framesHold === 0) {
			this.framesCurrent++;
			if (this.framesCurrent >= this.framesMax) {
				this.framesCurrent = 0;
			}
		}
	}

	update() {
		this.draw();
		this.animateFrames();
	}
}

class Fighter extends Sprite {
	constructor({
		position,
		velocity, 
		color, 
		imageSrc, 
		scale = 1, 
		framesMax = 1, 
		offset = {x: 0, y: 0},
		sprites
	}) {
		super({
			position, 
			imageSrc, 
			scale, 
			framesMax, 
			offset
		});

		this.velocity = velocity;
		this.color = color;
		this.height = 150;
		this.width = 50;
		this.health = 100;
		this.lastKey;
		this.sprites = sprites;
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset,
			width: 100,
			height: 50
		};
		this.isAttacking = false;

		for (const sprite in sprites) {
			sprites[sprite].image = new Image();
			sprites[sprite].image.src = sprites[sprite].imageSrc;
		}
	}

	update() {
		this.draw();
		this.animateFrames();

		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
			this.velocity.y = 0;
			this.position.y = 330;
		} else {
			this.velocity.y += gravity;
		}
	}

	attack() {
		this.switchSprite('attack1');
		this.isAttacking = true;

		setTimeout(() => {
			this.isAttacking = false;
		}, 100);
	}

	switchSprite(sprite) {
		if (
			this.image === this.sprites.attack1.image &&
			this.framesCurrent < this.sprites.attack1.framesMax - 1
		) {
			return;
		}

		switch(sprite) {
			case 'idle':
				if (this.image !== this.sprites.idle.image) {
					this.image = this.sprites.idle.image;
					this.framesMax = this.sprites.idle.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case 'run':
				if (this.image !== this.sprites.run.image) {
					this.image = this.sprites.run.image;
					this.framesMax = this.sprites.run.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case 'jump':
				if (this.image !== this.sprites.jump.image) {
					this.image = this.sprites.jump.image;
					this.framesMax = this.sprites.jump.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case 'fall':
				if (this.image !== this.sprites.fall.image) {
					this.image = this.sprites.fall.image;
					this.framesMax = this.sprites.fall.framesMax;
					this.framesCurrent = 0;
				}
				break;
			case 'attack1':
				if (this.image !== this.sprites.attack1.image) {
					this.image = this.sprites.attack1.image;
					this.framesMax = this.sprites.attack1.framesMax;
					this.framesCurrent = 0;
				}
				break;
		}
	}
}