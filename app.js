let config = {
    Renderer: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
let game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('background1', 'assets/background1.png');
    this.load.image('background2', 'assets/background2.png');
    this.load.image('background3', 'assets/background3.png');
    this.load.image('background4', 'assets/background4.png');
    this.load.image('road', 'assets/road.png');
    this.load.image('column', 'assets/column.png');
    this.load.image('column1', 'assets/column1.png');
    this.load.image('column2', 'assets/column2.png');
    this.load.image('column3', 'assets/column3.png');
    this.load.image('column4', 'assets/column4.png');
    this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 });
}

let isGameOver = false;
let score = 0;
let gameText;
let bird;
let hasLanded = false;
let cursors;
let hasBumped = false;
let isGameStarted = false;
let messageToPlayer;
let background;
let topColumn;
let bottomColumn;
let level = 0;
const backgroundKeys = ['background', 'background1', 'background2', 'background3', 'background4'];
const columnKeys = ['column', 'column1', 'column2', 'column3', 'column4'];

function create() {
    background = this.add.image(config.width / 2, config.height / 2, backgroundKeys[level]);
    background.setDisplaySize(config.width, config.height);
    const roads = this.physics.add.staticGroup();
    const road = roads.create(400, 568, 'road').setScale(2).refreshBody();

    // Initial columns for level 0
    topColumn = this.physics.add.staticGroup({
        key: columnKeys[level],
        repeat: 3,
        setXY: { x: 200, y: 0, stepX: 150 }
    });
    bottomColumn = this.physics.add.staticGroup({
        key: columnKeys[level],
        repeat: 4,
        setXY: { x: 150, y: 600, stepX: 150 }
    });

    // Bird design
    bird = this.physics.add.sprite(50, 50, 'bird').setScale(2);
    bird.setBounce(0.2);
    bird.setCollideWorldBounds(true);
    this.physics.add.collider(bird, roads);
    this.physics.add.overlap(bird, road, () => hasLanded = true, null, this);
    this.physics.add.collider(bird, road);

    // Cursors for bird movement
    cursors = this.input.keyboard.createCursorKeys();

    // Collision with columns
    this.physics.add.collider(bird, topColumn);
    this.physics.add.collider(bird, bottomColumn);
    this.physics.add.overlap(bird, topColumn, () => hasBumped = true, null, this);
    this.physics.add.overlap(bird, bottomColumn, () => hasBumped = true, null, this);
    this.physics.add.collider(bird, topColumn);
    this.physics.add.collider(bird, bottomColumn);

    // Display message to player, centered with square font and no background
    messageToPlayer = this.add.text(config.width / 2, config.height / 2, `Instructions: Press space bar to start`, { 
        fontFamily: 'Courier New', // Square-like font
        fontSize: "20px", 
        color: "white" 
    });
    messageToPlayer.setOrigin(0.5, 0.5); // Center the text at its position
}

function updateColumns(scene, newLevel) {
    // Clear existing columns
    topColumn.clear(true, true);
    bottomColumn.clear(true, true);

    // Define unique column layouts for each level
    switch (newLevel) {
        case 0: // Level 1
            topColumn = scene.physics.add.staticGroup({
                key: columnKeys[newLevel],
                repeat: 3,
                setXY: { x: 200, y: 0, stepX: 250 }
            });
            bottomColumn = scene.physics.add.staticGroup({
                key: columnKeys[newLevel],
                repeat: 4,
                setXY: { x: 150, y: 550, stepX: 250 }
            });
            break;
        case 1: // Level 2
            topColumn = scene.physics.add.staticGroup({
                key: columnKeys[newLevel],
                repeat: 3,
                setXY: { x: 200, y: 100, stepX: 250 }
            });
            bottomColumn = scene.physics.add.staticGroup({
                key: columnKeys[newLevel],
                repeat: 4,
                setXY: { x: 150, y: 450, stepX: 350 }
            });
            break;
        case 2: // Level 3
            topColumn = scene.physics.add.staticGroup({
                key: columnKeys[newLevel],
                repeat: 15,
                setXY: { x: 250, y: 0, stepX: 60 }
            });
            bottomColumn = scene.physics.add.staticGroup({
                key: columnKeys[newLevel],
                repeat: 17,
                setXY: { x: 100, y: 620, stepX: 60 }
            });
            break;
        case 3: // Level 4
            topColumn = scene.physics.add.staticGroup({
                key: columnKeys[newLevel],
                repeat: 2,
                setXY: { x: 250, y: 0, stepX: 380 }
            });
            bottomColumn = scene.physics.add.staticGroup({
                key: columnKeys[newLevel],
                repeat: 2,
                setXY: { x: 100, y: 680, stepX: 550 }
            });
            break;
        case 4: // Level 5
            topColumn = scene.physics.add.staticGroup({
                key: columnKeys[newLevel],
                repeat: 150,
                setXY: { x: 200, y: 0, stepX: 20 }
            });
            topColumn = scene.physics.add.staticGroup({
                key: columnKeys[newLevel],
                repeat: 150,
                setXY: { x: 230, y: 140, stepX: 20 }
            });
            
            bottomColumn = scene.physics.add.staticGroup({
                key: columnKeys[newLevel],
                repeat: 140,
                setXY: { x: 150, y: 470, stepX: 20 }
            });
            bottomColumn = scene.physics.add.staticGroup({
                key: columnKeys[newLevel],
                repeat: 140,
                setXY: { x: 50, y: 470, stepX: 20 }
            });
            bottomColumn = scene.physics.add.staticGroup({
                key: columnKeys[newLevel],
                repeat: 140,
                setXY: { x: 250, y: 400, stepX: 20 }
            });
            break;
    }

    // Re-apply collision logic
    scene.physics.add.collider(bird, topColumn);
    scene.physics.add.collider(bird, bottomColumn);
    scene.physics.add.overlap(bird, topColumn, () => hasBumped = true, null, scene);
    scene.physics.add.overlap(bird, bottomColumn, () => hasBumped = true, null, scene);
    scene.physics.add.collider(bird, topColumn);
    scene.physics.add.collider(bird, bottomColumn);
}

function update() {
    if (cursors.up.isDown && !isGameStarted) {
        messageToPlayer.text = 'Instructions: Press the "^" button to stay upright';
        isGameStarted = true;
        bird.setVelocityX(200);
    }
    if (cursors.up.isDown) {
        bird.setVelocityY(-160);
    }
    if (!isGameStarted) {
        bird.setVelocityY(60);
    }
    if (!hasLanded && !hasBumped) {
        bird.body.velocity.x = 150;

        // Check if bird reaches the end (x > 750)
        if (bird.x > 750) {
            if (level === 4) { // If on Level 5 (level 4 in 0-based index)
                // Stop bird movement
                bird.setVelocityX(0);
                bird.setVelocityY(0);
                bird.body.enable = false; // Disable physics to fully stop the bird

                // Display "You Win" in large text
                messageToPlayer.setText('You Win!');
                messageToPlayer.setFontSize(80); // Very big text
                messageToPlayer.setPosition(config.width / 2 - messageToPlayer.width / 2, config.height / 2 - messageToPlayer.height / 2); // Center it
                messageToPlayer.setBackgroundColor('rgba(0, 0, 0, 0.7)'); // Slightly transparent black background
            } else {
                // Reset bird position for levels 0-3
                bird.setX(50);
                bird.setY(50);
                bird.setVelocityX(150);
                bird.setVelocityY(0);

                // Increment level and cap at 4
                level = Math.min(level + 1, 4);

                // Update background
                background.setTexture(backgroundKeys[level]);

                // Update columns with unique layout for the new level
                updateColumns(this, level);

                // Update message to show current level
                messageToPlayer.text = `Level ${level + 1}`;
            }
        }
    }
    
    if (hasLanded || hasBumped || !isGameStarted) {
        bird.body.velocity.x = 0;
        messageToPlayer.text = `Oh no! You crashed!`;
    }
}