const wizardData = {
    maxHealth: 100,
    position: {x: canvas.width - 60, y: 0},
    facingRight: false,
    hurtbox: {offset: {x: 0, y: -30}, size: { x: 40, y: 100 }},
    targetSize: {x: 250 * 2, y: 250 * 2},
    sprites: {
        idle: {imageUrl: './images/wizard/Idle.png', maxFrames: 8, frameDuration: 100, size: {x: 250, y: 250}},
        run: {imageUrl: './images/wizard/Run.png', maxFrames: 8, frameDuration: 60, size: {x: 250, y: 250}},
        fall: {imageUrl: './images/wizard/Fall.png', maxFrames: 2, frameDuration: 100, size: {x: 250, y: 250}},
        jump: {imageUrl: './images/wizard/Jump.png', maxFrames: 2, frameDuration: 100, size: {x: 250, y: 250}},
        death: {imageUrl: './images/wizard/Death.png', maxFrames: 7, frameDuration: 100, size: {x: 250, y: 250}},
        takeHit: {imageUrl: './images/wizard/Take hit.png', maxFrames: 3, frameDuration: 100, size: {x: 250, y: 250}},
        attack1: {imageUrl: './images/wizard/Attack1.png', maxFrames: 8, frameDuration: 100, size: {x: 250, y: 250}},
        attack2: {imageUrl: './images/wizard/Attack2.png', maxFrames: 8, frameDuration: 80, size: {x: 250, y: 250}},
    },
    attackData: [
        {
            damage: 23,
            hitboxes: [
                {offset: {x:-80, y: -120}, size: {x: 0, y: 0},},
                {offset: {x:-80, y: -120}, size: {x: 0, y: 0},},
                {offset: {x:-80, y: -120}, size: {x: 0, y: 0},},
                {offset: {x: 40, y: -120}, size: {x: 160, y: 140},},
                {offset: {x: 40, y: -120}, size: {x: 180, y: 200},},
                {offset: {x: 40, y: -120}, size: {x: 170, y: 220},},
                {offset: {x: 40, y: -100}, size: {x: 0, y: 0},},
                {offset: {x: 0, y: 0}, size: {x: 0, y: 0}},
            ],
            spriteName: 'attack2',
            cooldown: 50,
        }
    ]
};

const ninjaData = {
    maxHealth: 100,
    position: {x: 60, y: 0},
    hurtbox: {offset: {x: 0, y: 0}, size: { x: 30, y: 110 }},
    targetSize: {x: 200 * 1.65, y: 200 * 2},
    sprites: {
        idle: {imageUrl: './images/hero/Idle.png', maxFrames: 4, frameDuration: 100, size: {x: 200, y: 200}},
        run: {imageUrl: './images/hero/Run.png', maxFrames: 8, frameDuration: 60, size: {x: 200, y: 200}},
        fall: {imageUrl: './images/hero/Fall.png', maxFrames: 2, frameDuration: 100, size: {x: 200, y: 200}},
        jump: {imageUrl: './images/hero/Jump.png', maxFrames: 2, frameDuration: 100, size: {x: 200, y: 200}},
        death: {imageUrl: './images/hero/Death.png', maxFrames: 7, frameDuration: 100, size: {x: 200, y: 200}},
        takeHit: {imageUrl: './images/hero/Take hit.png', maxFrames: 3, frameDuration: 100, size: {x: 200, y: 200}},
        attack1: {imageUrl: './images/hero/Attack1.png', maxFrames: 4, frameDuration: 90, size: {x: 200, y: 200}},
    },
    attackData: [
        {
            damage: 15,
            hitboxes: [
                {offset: {x: 0, y: -60}, size: {x: 0, y: 0},},
                {offset: {x: 0, y: -60}, size: {x: 0, y: 0},},
                {offset: {x: 0, y: -65}, size: {x: 136, y: 120},},
                {offset: {x: 0, y: -60}, size: {x: 0, y: 0},},
            ],
            spriteName: 'attack1',
            cooldown: 50,
        }
    ]
};
