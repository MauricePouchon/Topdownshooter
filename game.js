var canvas,
    ctx,
    width = 650,
    height = 650,

    gameStart = false,
    lives = 3,
    score = 0,
    animator = 0,

    ship_x = (width / 2) - 25,
    ship_y = height - 75,
    ship_w = 50, //Breite
    ship_h = 50, //Höhe

    rightKey = false,
    leftKey = false,
    upKey = false,
    downKey = false,

    anzahlFeinde = 2,

    enemies = [],
    enemy_x = 50,
    enemy_y = -50,
    enemy_w = 50,
    enemy_h = 50,
    speed = 3,
    type = 1,
    enemy_lives = 1,

    //Werte F4U
    F4U_w = 50,
    F4U_h = 50,
    F4U_speed = 3,
    F4U_lives = 1,

    //Werte P-38
    P38_w = 80,
    P38_h = 56,
    P38_speed = 4,
    P38_lives = 2,

    //Werte XP-55
    XP55_w = 66,
    XP55_h = 45,
    XP55_speed = 8,
    XP55_lives = 1,

    //Werte B-17
    B17_w = 160,
    B17_h = 110,
    B17_speed = 2.5,
    B17_lives = 4,

    backgroundY = 0,
    backgroundY2 = -650,

    totalBullets = 10,
    bullets = [];

//Erstellen der feindlichen Flugzeuge
function createEnemies() {
    if (enemies.length < anzahlFeinde) {
        enemy_y = 0 - enemy_h;

        //Festlegen der Spawnbreite der feindlichen Flugzeuge
        if (enemies.length == 0) {
            temp_pos = Math.floor(Math.random() * (width - enemy_w));
            enemy_x = temp_pos;
        }

        if (enemies.length == 1) {
            //enemies.sort();
            while (true) {
                temp_pos = Math.floor(Math.random() * (width - enemy_w));

                if (temp_pos + enemy_w <= enemies[0][0]) {
                    enemy_x = temp_pos;
                    break
                } else if (temp_pos >= enemies[0][0] + enemy_w) {
                    enemy_x = temp_pos;
                    break
                }
            }
        }

        if (enemies.length == 2) {
            //enemies.sort();
            while (true) {
                temp_pos = Math.floor(Math.random() * (width - enemy_w));

                if (temp_pos + enemy_w <= enemies[0][0]) {
                    if (temp_pos + enemy_w <= enemies[1][0]) {
                        enemy_x = temp_pos;
                        break
                    } else if (temp_pos >= enemies[1][0] + enemy_w) {
                        enemy_x = temp_pos;
                        break
                    }
                } else if (temp_pos >= enemies[0][0] + enemy_w) {
                    if (temp_pos + enemy_w <= enemies[1][0]) {
                        enemy_x = temp_pos;
                        break
                    } else if (temp_pos >= enemies[1][0] + enemy_w) {
                        enemy_x = temp_pos;
                        break
                    }
                }
            }
        }

        //Füllen des Feinde-Arrays
        if (score < 20) {
            //Erstellen der F4U
            enemies.push([enemy_x, enemy_y, F4U_w, F4U_h, F4U_speed, 1, F4U_lives]);
        } else if (score < 40 && score >= 20) {
            //Erstellen der P-38
            enemy_w = P38_w;
            enemies.push([enemy_x, 0 - P38_h, P38_w, P38_h, P38_speed, 2, P38_lives]);

        } else {
            if (score < 60 && score >= 40) {
                //Erstellen der XP-55
                enemy_w = XP55_w;
                enemies.push([enemy_x, 0 - XP55_h, XP55_w, XP55_h, XP55_speed, 3, XP55_lives]);
            } else {
                anzahlFeinde = 2
                //Erstellen der B-17
                enemy_w = B17_w;
                enemies.push([enemy_x, 0 - B17_h, B17_w, B17_h, B17_speed, 4, B17_lives]);
            }

        }
    }

    //Bewegen der feindlichen Flugzeuge
    for (var i = 0; i < enemies.length; i++) {
        // Wenn der Gegner noch nicht unten angekommen ist, wird er nach unten bewegt.
        if (enemies[i][1] < height) {
            enemies[i][1] += enemies[i][4];
            //Wenn der Gegner aus dem Feld verschwindet, wird sein Array geleert.
        } else if (enemies[i][1] > height - 1) {
            enemies.splice(i, 1);
        }
    }
}

//Einfügen der Feinde
function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {

        //Animation der Flugzeuge in 3 States
        switch (animator) {
            case 0:
                switch (enemies[i][5]) {
                    case 1:
                        ctx.drawImage(fighter, enemies[i][0], enemies[i][1]);
                        break;
                    case 2:
                        ctx.drawImage(p38_0, enemies[i][0], enemies[i][1]);
                        break;
                    case 3:
                        ctx.drawImage(xp55_0, enemies[i][0], enemies[i][1]);
                        break;
                    default:
                        ctx.drawImage(b17_0, enemies[i][0], enemies[i][1]);
                        break;
                }
                break;

            case 1:
                switch (enemies[i][5]) {
                    case 1:
                        ctx.drawImage(fighter1, enemies[i][0], enemies[i][1]);
                        break;
                    case 2:
                        ctx.drawImage(p38_1, enemies[i][0], enemies[i][1]);
                        break;
                    case 3:
                        ctx.drawImage(xp55_1, enemies[i][0], enemies[i][1]);
                        break;
                    default:
                        ctx.drawImage(b17_1, enemies[i][0], enemies[i][1]);
                        break;
                }
                break;

            default:
                switch (enemies[i][5]) {
                    case 1:
                        ctx.drawImage(fighter2, enemies[i][0], enemies[i][1]);
                        break;
                    case 2:
                        ctx.drawImage(p38_2, enemies[i][0], enemies[i][1]);
                        break;
                    case 3:
                        ctx.drawImage(xp55_2, enemies[i][0], enemies[i][1]);
                        break;
                    default:
                        ctx.drawImage(b17_2, enemies[i][0], enemies[i][1]);
                        break;
                }
                break;
        }
    }
}

//Darstellen der Schüsse
function drawBullet() {
    if (bullets.length)
        for (var i = 0; i < bullets.length; i++) {
            ctx.drawImage(bullet, bullets[i][0], bullets[i][1]);
        }
}

//Bewegen der Schüsse
function moveBullet() {
    for (var i = 0; i < bullets.length; i++) {
        if (bullets[i][1] > -11) {
            bullets[i][1] -= 10;
        } else if (bullets[i][1] < -10) {
            bullets.splice(i, 1);
        }
    }
}

//Erstellen des eigenen Flugzeugs
function drawShip() {
    if (rightKey) ship_x += 8;
    else if (leftKey) ship_x -= 8;
    if (upKey) ship_y -= 5;
    else if (downKey) ship_y += 5;
    if (ship_x <= 0) ship_x = 0;
    if ((ship_x + ship_w) >= width) ship_x = width - ship_w;
    if (ship_y <= 0) ship_y = 0;
    if ((ship_y + ship_h) >= height) ship_y = height - ship_h;

    //Animation des Flugzeugs und hochzählen des Animationsframes
    switch (animator) {
        case 0:
            ctx.drawImage(ship, ship_x, ship_y);
            animator += 1;
            break;

        case 1:
            ctx.drawImage(ship1, ship_x, ship_y);
            animator += 1;
            break;

        default:
            ctx.drawImage(ship2, ship_x, ship_y);
            animator = 0;
            break;
    }
}

//Initialisierung
function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    //Bilder
    bullet = new Image();
    bullet.src = 'Bilder/Bullet.png';
    ship = new Image();
    ship.src = 'Bilder/Sprites/A6M5_0_0.png';
    ship1 = new Image();
    ship1.src = 'Bilder/Sprites/A6M5_0_1.png';
    ship2 = new Image();
    ship2.src = 'Bilder/Sprites/A6M5_0_2.png';
    fighter = new Image();
    fighter.src = 'Bilder/Sprites/F4U_0.png';
    fighter1 = new Image();
    fighter1.src = 'Bilder/Sprites/F4U_1.png';
    fighter2 = new Image();
    fighter2.src = 'Bilder/Sprites/F4U_2.png';
    xp55_0 = new Image();
    xp55_0.src = 'Bilder/Sprites/XP-55_0.png';
    xp55_1 = new Image();
    xp55_1.src = 'Bilder/Sprites/XP-55_1.png';
    xp55_2 = new Image();
    xp55_2.src = 'Bilder/Sprites/XP-55_2.png';
    p38_0 = new Image();
    p38_0.src = 'Bilder/Sprites/P-38_0.png';
    p38_1 = new Image();
    p38_1.src = 'Bilder/Sprites/P-38_1.png';
    p38_2 = new Image();
    p38_2.src = 'Bilder/Sprites/P-38_2.png';
    b17_0 = new Image();
    b17_0.src = 'Bilder/Sprites/B-17_0.png';
    b17_1 = new Image();
    b17_1.src = 'Bilder/Sprites/B-17_1.png';
    b17_2 = new Image();
    b17_2.src = 'Bilder/Sprites/B-17_2.png';
    background = new Image();
    background.src = 'Bilder/Ocean.png';
    titlescreen = new Image();
    titlescreen.src = 'Bilder/Title.png';
    //Audio
    bulletsound = new Audio("Audio/Bullet.mp3");
    titlemusic = new Audio("Audio/1943 - The Battle of Midway.mp3");
    explosionsound = new Audio("Audio/Boom.mp3");
    hitsound = new Audio("Audio/Hit.mp3");
    deathsound = new Audio("Audio/Death.mp3");
    //Game Loop
    setInterval(gameLoop, 25);
    //Event Listeners
    canvas.addEventListener('click', startGame, false);
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
}

//Das eigene Flugzeug wird zurückgesetzt
function resetPosition() {
    ship_x = (width / 2) - 25;
    ship_y = height - 75;
    lives--;
    deathsound.play();
}

function shipCollision() {
    var ship_xw = ship_x + ship_w,
        ship_yh = ship_y + ship_h;
    for (var i = 0; i < enemies.length; i++) {
        if (ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemies[i][2] /*Breite*/ && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemies[i][3] /*Höhe*/) {
            resetPosition();
            enemies.splice(i, enemies.length);
        }
        if (ship_xw < enemies[i][0] + enemies[i][2] /*Breite*/ && ship_xw > enemies[i][0] && ship_y > enemies[i][1] && ship_y < enemies[i][1] + enemies[i][3] /*Höhe*/) {
            resetPosition();
            enemies.splice(i, enemies.length);
        }
        //Kollision von Rechts
        if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemies[i][3] /*Höhe*/ && ship_x > enemies[i][0] && ship_x < enemies[i][0] + enemies[i][2] /*Breite*/) {
            resetPosition();
            enemies.splice(i, enemies.length);
        }
        //Kollision von Links
        if (ship_yh > enemies[i][1] && ship_yh < enemies[i][1] + enemies[i][3] /*Höhe*/ && ship_xw < enemies[i][0] + enemies[i][2] /*Breite*/ && ship_xw > enemies[i][0]) {
            resetPosition();
            enemies.splice(i, enemies.length);
        }
    }
}

//Startbildschirm
function drawTitle() {
    ctx.drawImage(titlescreen, 0, 0);
    ctx.font = '40px VT323';
    ctx.fillStyle = '#FFFF00';
    ctx.fillText('Klick to play', width / 2 - 95, 550);
}

//Scrollen des Hintergrunds
function drawBackground() {
    ctx.drawImage(background, 0, backgroundY);
    ctx.drawImage(background, 0, backgroundY2);
    if (backgroundY >= 650) {
        backgroundY = -649;
    }
    if (backgroundY2 >= 650) {
        backgroundY2 = -649;
    }
    backgroundY += 2;
    backgroundY2 += 2;
}

function clearCanvas() {
    ctx.clearRect(0, 0, width, height);
}

function startGame() {
    gameStart = true;
    canvas.removeEventListener('click', startGame, false);
}

//Anzeige des Punktestandes und der Leben
function scoreTotal() {
    ctx.font = '22px VT323';
    ctx.fillStyle = '#FFFF00';
    ctx.fillText('Health: ', 40, 30);
    ctx.fillText(lives, 105, 30);
    ctx.fillText('Score: ', 540, 30);
    ctx.fillText(score, 600, 30);
    if (lives <= 0) {
        ctx.font = '70px VT323';
        ctx.fillText('Game Over', 195, 330);
    }
}

//Prüfen, ob ein Flieger vom Spieler getroffen wurde
function hitTest() {
    for (var i = 0; i < bullets.length; i++) {
        for (var j = 0; j < enemies.length; j++) {
            if (enemies[j][1] < ship_y && bullets[i][1] <= (enemies[j][1] + enemies[j][3]) && bullets[i][0] >= enemies[j][0] && bullets[i][0] <= (enemies[j][0] + enemies[j][2])) {
                //Abziehen der Gegnerleben
                enemies[j][6]--;
                //
                if (enemies[j][6] >= 1) { 
                    bullets.splice(i, 1);
                } else {
                    bullets.splice(i, 1);
                    enemies.splice(j, 1);
                    score++;
                    explosionsound.pause();
                    explosionsound.play();
                    //Hinzufügen eines weiteren Feines bei Abschuss des ersten Flugzeugs
                    if (anzahlFeinde != 3) {
                        anzahlFeinde += 1;
                    }
                }
            }
        }
    }
}

function keyDown(e) {
    if (e.keyCode == 39) {
        rightKey = true;
        //Umschalten zur Neige-Animation
        ship.src = 'Bilder/Sprites/A6M5_2_0.png';
        ship1.src = 'Bilder/Sprites/A6M5_2_1.png';
        ship2.src = 'Bilder/Sprites/A6M5_2_2.png';
    } else if (e.keyCode == 37) {
        leftKey = true;
        ship.src = 'Bilder/Sprites/A6M5_1_0.png';
        ship1.src = 'Bilder/Sprites/A6M5_1_1.png';
        ship2.src = 'Bilder/Sprites/A6M5_1_2.png';
    }
    if (e.keyCode == 38) upKey = true;
    else if (e.keyCode == 40) downKey = true;
    if (e.keyCode == 32 && bullets.length <= totalBullets) bullets.push([ship_x + 23, ship_y - 8, 4, 10]);
    if (e.keyCode == 32 && gameStart == true && lives > 0) {
        bulletsound.pause();
        bulletsound.play();
    }
}

function keyUp(e) {
    if (e.keyCode == 39) {
        rightKey = false;
        //Zurücksetzen zur Standart-Animation
        ship.src = 'Bilder/Sprites/A6M5_0_0.png';
        ship1.src = 'Bilder/Sprites/A6M5_0_1.png';
        ship2.src = 'Bilder/Sprites/A6M5_0_2.png';
    } else if (e.keyCode == 37) {
        leftKey = false;
        ship.src = 'Bilder/Sprites/A6M5_0_0.png';
        ship1.src = 'Bilder/Sprites/A6M5_0_1.png';
        ship2.src = 'Bilder/Sprites/A6M5_0_2.png';
    }
    if (e.keyCode == 38) upKey = false;
    else if (e.keyCode == 40) downKey = false;
}

//Game Loop
function gameLoop() {
    clearCanvas();
    if (gameStart == false) {
        drawTitle();
    } else {
        drawBackground();
        if (lives > 0) {
            hitTest();
            moveBullet();
            drawShip();
            createEnemies();
            drawEnemies();
            shipCollision();
            drawBullet();
        }
        scoreTotal();
    }
}

window.onload = init;