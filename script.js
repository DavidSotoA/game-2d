
    var ctx;
    var id = 0;
    var keys = []
    var LINEAL_SPEED = 9;
    var game = new Game();
    var gunHeigth = 20,
        gunWidth  = 10

    var Forces = {
        gravity: {
            id: 'gravity',
            time: 0,
            lambda: (obj) => {
                let force = new Vector(0, 0.2);
                return force;
            }
        }
    }

    let Collisions = {

        collisionResolution : {
            stop: function() {
            }
        }
    }

    var entityTypes = {
        player: 'player',
        ball: 'ball',
        wall: 'wall',
        enemy: 'enemy',
        powerUp: 'powerUp',
        kill: 'kill',
        bullet: 'bullet'
    }

    var poweUps = {
        increment: {
            type: 'hiden',
            crashBox: (fatherBox, game) => {
                let height = 30,
                    width = 30;

                let x = (fatherBox.position.x + (fatherBox.width/2)) - width/2,
                    y = (fatherBox.position.y + (fatherBox.height/2)) - height/2

                let powerUp = new Box(x, y, height, width, "cyan", false,  entityTypes.powerUp, new Vector(0, 3), 'food.png');
                powerUp.addPowerUp(this.poweUps.increment);
                game.addObject(powerUp);
            },

            getPowerUp: (obj) => {
                let extraWidth = 10;

                obj.position.x -= (extraWidth/2) 
                obj.width += extraWidth;
                game.getSound('eat').play()
            }
        },

        death: {
            type: 'hiden',
            crashBox: (fatherBox, game) => {
                let height = 30,
                    width = 30;

                let x = (fatherBox.position.x + (fatherBox.width/2)) - width/2,
                    y = (fatherBox.position.y + (fatherBox.height/2)) - height/2

                let powerUp = new Box(x, y, height, width, "cyan", false,  entityTypes.powerUp, new Vector(0, 2), 'death.png');
                powerUp.addPowerUp(this.poweUps.death);
                game.addObject(powerUp);
            },

            getPowerUp: (obj) => {
                game.getSound('death').play();
                game.gameOver();
            }
        },

        bomb: {
            type: 'hiden',
            crashBox: (fatherBox, game) => {
                let height = 30,
                    width = 30;

                let x = (fatherBox.position.x + (fatherBox.width/2)) - width/2,
                    y = (fatherBox.position.y + (fatherBox.height/2)) - height/2

                let powerUp = new Box(x, y, height, width, "cyan", false,  entityTypes.powerUp, new Vector(0, 7), 'bomb.png');
                powerUp.addPowerUp(this.poweUps.bomb);
                game.addObject(powerUp);
            },

            getPowerUp: (obj) => {
                game.getSound('explosion').play()
                game.gameOver();
            }
        },

        speed: {

            type: 'hiden',
            crashBox: (fatherBox, game) => {
                let height = 30,
                    width = 30;

                let x = (fatherBox.position.x + (fatherBox.width/2)) - width/2,
                    y = (fatherBox.position.y + (fatherBox.height/2)) - height/2

                let powerUp = new Box(x, y, height, width, "cyan", false,  entityTypes.powerUp, new Vector(0, 4), 'speed.png');
                powerUp.addPowerUp(this.poweUps.speed);
                game.addObject(powerUp);
            },

            getPowerUp: (obj) => {
                game.getSound('speed').play();
                LINEAL_SPEED += 0.2;
            }

        },

        jump: {
            type: 'hiden',
            crashBox: (fatherBox, game) => {
                let height = 30,
                    width = 30;

                let x = (fatherBox.position.x + (fatherBox.width/2)) - width/2,
                    y = (fatherBox.position.y + (fatherBox.height/2)) - height/2

                let powerUp = new Box(x, y, height, width, "cyan", false,  entityTypes.powerUp, new Vector(0, 4), 'jump.png');
                powerUp.addPowerUp(this.poweUps.jump);
                game.addObject(powerUp);
            },

            getPowerUp: (obj) => {
                game.getSound('jump').play();

                obj.handleKeys = () => {
                    if (keys) {

                        if (keys[37]) {
                            obj.speed.x = -LINEAL_SPEED;
                        }
        
                        if (keys[39]) {
                            obj.speed.x = LINEAL_SPEED;
                        }
        
                        if (!keys[37] && !keys[39]) {
                            obj.speed.x = 0;
                        }
        
                        if(keys[38] && obj.collisions.bottom.collision) {
                            obj.speed.y = -5;
                        }
        
                        if(keys[40]) {
                            obj.speed.y = 5;
                        }

                        if(keys[32]) {
                            if (game.objects.filter( obj => obj.type == entityTypes.bullet).length == 0){
                                
                                let player = game.objects[0];
                                    center = player.getCenter();
        
                                let bullet = new Box(center.x, center.y - (player.height/2) - (gunHeigth), 7, 9, "white", false, entityTypes.bullet, new Vector(0,-10) , 'bullet.png')
                                game.getSound('shot').play();
                                game.addObject(bullet);
                            };
                        }
        
                    }
                }
                
            }

        }
    }

    function Sound(src, name) {
        this.name = name;
        this.sound = document.createElement("audio");
        this.sound.src = 'sounds/' + src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.load();
            this.sound.play();
        }
        this.stop = function(){
            this.sound.pause();
        }    
    }


    function main(){
        // let canvas = document.getElementById("canvas");
        // if (canvas) {
        //     canvas.parentNode.removeChild(canvas);
        //     ctx = null;
        //     id = 0;
        //     keys = []
        //     LINEAL_SPEED = 9;
        //     game = new Game();

        // }


        var gravity = new Vector(0, 0.2);

        var handleKeys = (obj) => {
            if (keys) {

                if (keys[37]) {
                    obj.speed.x = -LINEAL_SPEED;
                }

                if (keys[39]) {
                    obj.speed.x = LINEAL_SPEED;
                }

                if (!keys[37] && !keys[39]) {
                    obj.speed.x = 0;
                }

                if(keys[40]) {
                    obj.speed.y = 5;
                }

                if(keys[32]) {
                    if (game.objects.filter( obj => obj.type == entityTypes.bullet).length == 0){

                        let player = game.objects[0];
                            center = player.getCenter();

                        let bullet = new Box(center.x , center.y - (player.height/2) - (gunHeigth), 7, 9, "white", false, entityTypes.bullet, new Vector(0,-10) , 'bullet.png')
                        game.getSound('shot').play();
                        game.addObject(bullet);
                    };
                }

            }
        }

        var player  = new Box(410, 470, 80, 20, "#522f7f", false,   entityTypes.player, new Vector(0,0) , false),
            ball  =   new Box(340, 300, 24, 24, "blue", false,      entityTypes.ball, new Vector(4,5)   , false),
            left    = new Box(0, 0, 10, 500,    "gray", true,          entityTypes.wall, new Vector(0,0)   , false),
            bottom  = new Box(0, 490, 900, 10,  "black", true,       entityTypes.kill, new Vector(0,0)   , false),
            rigth   = new Box(890, 0, 10, 500,  "gray", true,        entityTypes.wall, new Vector(0,0)   , false),
            top     = new Box(0, 0, 900, 10,    "gray", true,          entityTypes.wall, new Vector(0,0    , false));

        var sound_detroyBlock   = new Sound('destroyBlock.mp3', 'destroyBlock'),
            sound_shot          = new Sound('shot.mp3', 'shot'),
            sound_game          = new Sound('game.mp3', 'game'),
            sound_explosion     = new Sound('explosion.mp3', 'explosion'),
            sound_speed         = new Sound('speed.mp3', 'speed'),
            sound_death         = new Sound('death.mp3', 'death'),
            sound_eat         = new Sound('eat.mp3', 'eat'),
            sound_jump          = new Sound('jump.mp3', 'jump')

            sound_game.loop = true;

            player.handleKeys = handleKeys;
            game.addObject(player)
                .addObject(ball)
                .addObject(bottom)
                .addObject(left)
                .addObject(rigth)
                .addObject(top)

            game.addSound(sound_detroyBlock)
                .addSound(sound_shot)
                .addSound(sound_explosion)
                .addSound(sound_speed)
                .addSound(sound_death)
                .addSound(sound_eat)
                .addSound(sound_jump)
                

            let blocks = []
            let colors = ['#bada55', '#6a0032', '#9494ff', '#82cfa4', '#b01dab']
            let rows = 7,
                columns = 10;
            
            let obstaculos = 5;
                jumps = 10;
                deaths = 10
            
            for (let j=0; j<rows; j++ ) {
                let y = 60 +(21*j)
                for (let i=0; i<columns; i++ ) {
                    let fortune = Math.floor((Math.random() * rows*columns) + 1);

                    let type = fortune <= obstaculos ? entityTypes.wall : entityTypes.enemy;
                        color = fortune <= obstaculos ? '#3d3d3d' : colors[(fortune) % colors.length];


                    let block = new Box(90 + (71*i), y, 70, 20, color, false, type, new Vector(0,0), false);

                    if (fortune > 5 && fortune <= 15 ) {
                        block.addPowerUp(poweUps.increment);

                    }

                    if (fortune > 15 && fortune <= 30 ) {
                        block.addPowerUp(poweUps.death);
                    }

                    if (fortune > 30 && fortune <= 35 ) {
                        block.addPowerUp(poweUps.speed);
                    }

                    if (fortune > 35 && fortune <= 40 ) {
                        block.addPowerUp(poweUps.jump);
                    }

                    if (fortune > 40 && fortune <= 45 ) {
                        block.addPowerUp(poweUps.bomb);
                    }
                    
                    
                    game.addObject(block)
                }
            }
        
        game.start(900, 500, Forces.gravity, false);
    }

    function Game() {
        this.canvas = document.createElement("canvas");
        this.objects = [];
        this.sounds = [];
        this.physics = {};
        this.manualMotion = false;
        this.loop;

        this.start = ( width, height, gravity, manualMotion) => {
            this.canvas.width   = width;
            this.canvas.height  = height;
            this.manualMotion = manualMotion;
            this.canvas.id = 'canvas'

            this.physics = {
                gravity : gravity 
            }

            ctx = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);

            this.applyGravity([this.objects[0]]);
            this.handleKeys();
            this.loop();
        };

        this.addSound = (sound) => {
            this.sounds.push(sound);
            return this;
        }

        this.applyGravity = (objects) => {
            objects.forEach( obj => obj.addForce(this.physics.gravity));
        }

        this.handleKeys = () => {
            window.addEventListener('keydown',  (e) => {
                if (e.keyCode == 81 && this.manualMotion) {
                    this.loop();
                }
                keys = (keys || []);
                keys[e.keyCode] = (e.type == "keydown");
            })

            window.addEventListener('keyup', function (e) {
                keys[e.keyCode] = (e.type == "keydown");            
            })
        }

        this.loop = () => {

            this.updateGame = () => {

                let player = this.objects[0];

                //clean canvas
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                //handle key events
                player.exectHandleKeys();

                let collisionObjects = this.getCollisionObjects();

                collisionObjects.forEach( obj => {
                    obj.collisions = objectWorldCollition(obj, this.getOthers(obj)) ;
                });

                this.objects.forEach( obj => {
                    obj.update();
                    obj.make();
                });
            }

            if (this.manualMotio) {
                this.updateGame()
            } else {
               this.loop = setInterval(this.updateGame, 20);
            }
        }

        this.addObject = function(object) {
            this.objects.push(object);
            return this;
        }

        this.removeObject = (object) => {
            this.objects = this.objects.filter(obj => obj.id != object.id)
        }

        this.getCollisionObjects  = () => {
            return this.objects.filter( obj => obj.type != entityTypes.wall);
        }

        this.getOthers = (object) => {
            return this.objects.filter(obj => obj.id != object.id);
        }

        this.getObject = (id) => {
            return this.objects.filter(obj => obj.id == id)[0];
        }

        this.gameOver = () => {
            let fontSize = 60;
            ctx.font =  fontSize + 'pt Consolas';
            ctx.fillStyle = "white"
            ctx.fillText("GAME OVER", (this.canvas.width/2) - (fontSize*4), 300);
            
            clearInterval(this.loop);
        }

        this.getSound = (name) => {
            return this.sounds.filter( sound => sound.name == name)[0];
        }
 
    }

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }

    function copy(src) {
        let target = {};
        for (let prop in src) {
        if (src.hasOwnProperty(prop)) {
            target[prop] = src[prop];
        }
        }
        return target;
    }

    function collition(obj1, obj2) {

        let a =  obj1;
            b =  obj2;

        let current_top1    = a.position.y,
            current_rigth1  = a.position.x + a.width,
            current_bottom1 = a.position.y + a.height,
            current_left1   = a.position.x;

        let current_top2    = b.position.y,
            current_rigth2  = b.position.x + b.width,
            current_bottom2 = b.position.y + b.height,
            current_left2   = b.position.x;

        let top1    = a.position.y + (a.speed.y ),
            rigth1  = a.position.x + a.width + (a.speed.x ),
            bottom1 = a.position.y + a.height + (a.speed.y ),
            left1   = a.position.x + (a.speed.x );

        let top2    = b.position.y + (b.speed.y ),
            rigth2  = b.position.x + b.width + (b.speed.x ),
            bottom2 = b.position.y + b.height + (b.speed.y ),
            left2   = b.position.x + (b.speed.x );

        let collision = {
            top:    {
                collision : false,
                id: null,
                deep: 0,
                type: '',
                area: 0
            },
            rigth:  {
                collision : false,
                id: null,
                deep: 0,
                type: '',
                area: 0
            },
            bottom: {
                collision : false,
                id: null,
                deep: 0,
                type: '',
                area: 0
            },
            left:   {
                collision : false,
                id: null,
                deep: 0,
                type: '',
                area: 0
            }
        }

        // console.log('--------------------------------------------------');
        // console.log('Player:')
        // console.log('position:' +       JSON.stringify(new Vector(a.position.x , a.position.y + a.height)))
        // console.log('speed:' +          JSON.stringify(a.speed));
        // console.log('aceleration:' +    JSON.stringify(a.getAceleration()));
        // console.log('\n')
        // console.log('obstaculo:')
        // console.log('position:' +       JSON.stringify(b.position));
        // console.log('speed:' +          JSON.stringify(b.speed));
        // console.log('aceleration:' +    JSON.stringify(b.getAceleration()));

        // console.log('--------------------------------------------------');

        let collide = !((bottom1 < top2) || (top1 > bottom2) || (rigth1 < left2) || (left1 > rigth2));

        if (collide) {

            obj1.collide.isCollision = true;
            obj1.collide.type = b.type;

            if (current_rigth1 <= current_left2 && rigth1 >= left2) {
                collision.rigth.collision = true;
                collision.rigth.deep = -Math.abs(rigth1 - left2);
                collision.rigth.type = b.type;
                collision.rigth.id = b.id;

                collision.rigth.area = getAreaCollisionBoxBox(a, b, 'rigth');
            } else if (current_left1 >= current_rigth2 && left1 <= rigth2) {
                collision.left.collision = true;
                collision.left.deep = Math.abs(left1 - rigth2);
                collision.left.type = b.type;
                collision.left.id = b.id;

                collision.top.area = getAreaCollisionBoxBox(a, b, 'left');
            } else if (current_top1 >= current_bottom2 && top1 <= bottom2) {
                collision.top.collision = true;
                collision.top.deep = Math.abs(top1 - bottom2);
                collision.top.type = b.type;
                collision.top.id = b.id;

                collision.top.area = getAreaCollisionBoxBox(a, b, 'top');
            } else if(current_bottom1 <= current_top2 && bottom1 >= top2) {
                collision.bottom.collision = true;
                collision.bottom.deep = -Math.abs(bottom1 - top2);
                collision.bottom.type = b.type;
                collision.bottom.id = b.id;

                collision.top.bottom = getAreaCollisionBoxBox(a, b, 'bottom');
            }
        
        } 


        return collision;

    }

    function getAreaCollisionBoxBox(myBox, otherBox, collisionSide) {
        let sidesMyBox = myBox.getSides(),
            sidesOtherBox = otherBox.getSides(),
            center = myBox.getCenter(),
            points,
            a,
            b;


        if (['top', 'bottom'].indexOf(collisionSide) >= 0) {
            points = [sidesMyBox.left, sidesMyBox.rigth, sidesOtherBox.left, sidesOtherBox.rigth];
            points.sort((a,b) => a-b);
            a = points[1] - center.x;
            b = points[2] - center.x;
        }

        else if(['left', 'rigth'].indexOf(collisionSide) >= 0) {
            points = [sidesMyBox.top, sidesMyBox.bottom, sidesOtherBox.top, sidesOtherBox.bottom];
            points.sort((a,b) => a-b);
            a = points[1] - center.y;
            b = points[2] - center.y;
        }



        return {
            a: a,
            b: b
        }

    }

    function objectWorldCollition(object, world)  {
        var collitions = {
            top:    {
                collision : false,
                id: null,
                deep: 0,
                type: '',
                area: 0
            },
            rigth:  {
                collision : false,
                id: null,
                deep: 0,
                type: '',
                area: 0
            },
            bottom: {
                collision : false,
                id: null,
                deep: 0,
                type: '',
                area: 0
            },
            left:   {
                collision : false,
                id: null,
                deep: 0,
                type: '',
                area: 0
            }
        }


        world.forEach( other =>{
            let currentCollitions = this.collition(object, other);

            collitions.top      = currentCollitions.top.collision      ? (currentCollitions.top)    : collitions.top;
            collitions.rigth    = currentCollitions.rigth.collision    ? (currentCollitions.rigth)  : collitions.rigth;
            collitions.bottom   = currentCollitions.bottom.collision   ? (currentCollitions.bottom) : collitions.bottom;
            collitions.left     = currentCollitions.left.collision     ? (currentCollitions.left)   : collitions.left;
        })


        return collitions;
    }


    function Box(x, y, width, height, color, fixed, type, initialSpeed, image) {
        this.id         = id;
        id              += 1 ;
        this.position   = new Point(x,y);
        this.fixed      = fixed;
        this.mass       = 1;
        this.forces     = [];
        this.type       = type;
        this.powerUps    = [];
        this.band = 20;
        this.color = color;
        this.handleKeys;
        if(image) {
            this.isImage = true;
            this.image = new Image();
            this.image.src =  './images/' + image    ;
        }
        this.collide    = {
            isCollision: false,
            type: '',
        };
        this.collisions = {
            top:    {
                collision : false,
                id: null,
                deep: 0,
                type: '',
                area: 0
            },
            rigth:  {
                collision : false,
                id: null,
                deep: 0,
                type: '',
                area: 0
            },
            bottom: {
                collision : false,
                id: null,
                deep: 0,
                type: '',
                area: 0
            },
            left:   {
                collision : false,
                id: null,
                deep: 0,
                type: '',
                area: 0
            }
        };

        this.width      = width;
        this.height     = height;
        this.speed      = initialSpeed;

        this.update = () => {

                if (this.collisions.top.collision || this.collisions.rigth.collision || this.collisions.bottom.collision || this.collisions.left.collision) {
                    // console.log(this.type)
                    // console.log(this.collisions);
                    
                }
            if (!this.fixed)  {

    
                let aceleration = this.getAceleration();
                    xAceleration = aceleration.xAceleration,
                    yAceleration = aceleration.yAceleration;

                this.position.x += this.speed.x;
                this.position.y += this.speed.y;

                this.speed.x    += xAceleration;
                this.speed.y    += yAceleration;

                    
                if (this.collisions.top.collision) {

                    // choque de jugador con muro
                    if(this.collisions.top.type === entityTypes.wall && this.type == entityTypes.player) { 
                        this.position.y += this.collisions.top.deep;
                        this.speed.y    = 0
                    }

                    //choque jugador con kill
                    if(this.collisions.top.type === entityTypes.kill && this.type == entityTypes.player) { 
                        this.position.y += this.collisions.top.deep;
                        this.speed.y    = 0
                    }

                    // choque bola con kill
                    if(this.collisions.top.type === entityTypes.kill && this.type == entityTypes.ball) { 
                        game.gameOver();
                    }

                    //choque de bola con muro
                    if(this.collisions.top.type === entityTypes.wall && this.type == entityTypes.ball) { 
                        this.position.y += this.collisions.top.deep;
                        this.speed.y    = -this.speed.y
                    }

                    //choque de bola con enemgo
                    if(this.collisions.top.type === entityTypes.enemy && this.type == entityTypes.ball) { 
                        this.position.y += this.collisions.top.deep;
                        this.speed.y    = -this.speed.y
                    }

                    //choque de enemigo con bola
                    if(this.collisions.top.type === entityTypes.ball && this.type == entityTypes.enemy) {
                        game.getSound('destroyBlock').play();
                        this.powerUps.forEach( powerUp => {
                            powerUp.crashBox(this, game)
                        })
                        game.removeObject(this)
                     }

                    //choque de bola con jugador
                    if(this.collisions.top.type === entityTypes.player && this.type == entityTypes.ball) { 
                        this.position.y += this.collisions.top.deep;
                        this.speed.y    = -this.speed.y;
                    }

                    //choque de jugador con bola
                    if(this.collisions.top.type === entityTypes.ball && this.type == entityTypes.player) { 
                    }

                    //choque jugador con powerUp
                    if(this.collisions.top.type === entityTypes.powerUp && this.type == entityTypes.player) { 
                        let powerUp = game.getObject(this.collisions.top.id).powerUps[0];
                        powerUp.getPowerUp(this);
                    }

                    //choque powerUp con jugador
                    if(this.collisions.top.type === entityTypes.player && this.type == entityTypes.powerUp) { 
                        game.removeObject(this);
                    }

                    //choque bala contra muro
                    if(this.collisions.top.type === entityTypes.wall && this.type == entityTypes.bullet) { 
                        game.removeObject(this);
                    }

                    //choque bala contra powerUp
                    if(this.collisions.top.type === entityTypes.powerUp && this.type == entityTypes.bullet) { 
                        game.removeObject(this);
                    }


                    //choque powerUp contra bala
                    if(this.collisions.top.type === entityTypes.bullet && this.type == entityTypes.powerUps) { 
                        game.removeObject(this);
                    }


                }

                if (this.collisions.rigth.collision) {

                    //choque de jugador con muro
                    if(this.collisions.rigth.type === entityTypes.wall && this.type == entityTypes.player) { 
                        this.position.x += this.collisions.rigth.deep;
                        this.speed.x    = 0; 
                    }

                    //choque jugador con kill
                    if(this.collisions.rigth.type === entityTypes.kill && this.type == entityTypes.player) { 
                        this.position.x += this.collisions.rigth.deep;
                        this.speed.x    = 0; 
                    }

                    // choque bola con kill
                    if(this.collisions.rigth.type === entityTypes.kill && this.type == entityTypes.ball) { 
                        game.gameOver();
                    }


                    //choque de bola con muro
                    if(this.collisions.rigth.type === entityTypes.wall && this.type == entityTypes.ball) { 
                        this.position.x += this.collisions.rigth.deep;
                        this.speed.x    = -this.speed.x ; 
                    }

                    //choque de bola con enemigo
                    if(this.collisions.rigth.type === entityTypes.enemy && this.type == entityTypes.ball) { 
                        this.position.x += this.collisions.rigth.deep;
                        this.speed.x    = -this.speed.x ; 
                    }

                    //choque de enemigo con bola
                    if(this.collisions.rigth.type === entityTypes.ball && this.type == entityTypes.enemy) { 
                        game.getSound('destroyBlock').play();
                        this.powerUps.forEach( powerUp => {
                            powerUp.crashBox(this, game)
                        })
                        game.removeObject(this)
                    }

                    //choque de bola con jugador
                    if(this.collisions.rigth.type === entityTypes.player && this.type == entityTypes.ball) { 
                        this.position.x += this.collisions.rigth.deep;
                        this.speed.x    = -Math.abs(this.speed.x) ;
                        this.speed.y    =  -Math.abs(this.speed.y) ;
                    }

                    //choque de jugador con bola
                    if(this.collisions.rigth.type === entityTypes.ball && this.type == entityTypes.player) { 
                    }

                    //choque jugador con powerUp
                    if(this.collisions.rigth.type === entityTypes.powerUp && this.type == entityTypes.player) { 
                        let powerUp = game.getObject(this.collisions.rigth.id).powerUps[0];
                        powerUp.getPowerUp(this);
                    }


                    //choque powerUp con jugador
                    if(this.collisions.rigth.type === entityTypes.player && this.type == entityTypes.powerUp) { 
                        game.removeObject(this);
                    }

                    //choque powerUp contra bala
                    if(this.collisions.rigth.type === entityTypes.powerUp && this.type == entityTypes.bullet) { 
                        game.removeObject(this);
                    }


                }

                if (this.collisions.bottom.collision) {

                    //choque de jugador con muro
                    if(this.collisions.bottom.type === entityTypes.wall && this.type == entityTypes.player) { 
                        this.position.y += this.collisions.bottom.deep;
                        this.speed.y    = 0;
                    }

                    //choque jugador con kill
                    if(this.collisions.bottom.type === entityTypes.kill && this.type == entityTypes.player) { 
                        this.position.y += this.collisions.bottom.deep;
                        this.speed.y    = 0;
                    }

                    // choque bola con kill
                    if(this.collisions.bottom.type === entityTypes.kill && this.type == entityTypes.ball) { 
                        game.gameOver();
                    }


                    //choque de bola con muro
                    if(this.collisions.bottom.type === entityTypes.wall && this.type == entityTypes.ball) { 
                        this.position.y += this.collisions.bottom.deep;
                        this.speed.y    = -this.speed.y;
                    }

                     //choque de bola con enemigo
                     if(this.collisions.bottom.type === entityTypes.enemy && this.type == entityTypes.ball) { 
                        this.position.y += this.collisions.bottom.deep;
                        this.speed.y    = -this.speed.y;
                    }

                    //choque de enemigo con bola
                    if(this.collisions.bottom.type === entityTypes.ball && this.type == entityTypes.enemy) {
                        game.getSound('destroyBlock').play();
                        game.sounds[0].play();
                        this.powerUps.forEach( powerUp => {
                            powerUp.crashBox(this, game)
                        })
                        game.removeObject(this)
                    }


                    //choque de bola con jugador
                    if(this.collisions.bottom.type === entityTypes.player && this.type == entityTypes.ball) { 

                        let player = game.getObject(this.collisions.bottom.id);
             
                            center = player.getCenter();

                        let collisionPlayerBall = player.collisions.top
    
                        let distance = Math.min.apply(Math, 
                                 [Math.abs(collisionPlayerBall.area.a), 
                                  Math.abs(collisionPlayerBall.area.b)]);
                        
                        this.position.y += this.collisions.bottom.deep;
                        this.speed.y    = -this.speed.y;

                        if (distance >= (player.width/2) - player.band) {
                            if (collisionPlayerBall.area.a > 0 && collisionPlayerBall.area.b > 0){
                                this.speed.x    = Math.abs(this.speed.x) ;
                            } else {
                                this.speed.x    = -Math.abs(this.speed.x) ;
                            }
                        }
                    }

                    //choque de jugador con bola
                    if(this.collisions.bottom.type === entityTypes.ball && this.type == entityTypes.player) { 
                    }

                    //choque jugador con powerUp
                    if(this.collisions.bottom.type === entityTypes.powerUp && this.type == entityTypes.player) { 
                        let powerUp = game.getObject(this.collisions.bottom.id).powerUps[0];
                        powerUp.getPowerUp(this);
                    }


                    //choque powerUp con jugador
                    if(this.collisions.bottom.type === entityTypes.player && this.type == entityTypes.powerUp) { 
                        game.removeObject(this);
                    }

                    //choque powerUp contra bala
                    if(this.collisions.bottom.type === entityTypes.bullet && this.type == entityTypes.powerUp) { 
                        game.removeObject(this);
                    }
                }

                if (this.collisions.left.collision) {

                    //choque de jugador con muro
                    if(this.collisions.left.type === entityTypes.wall && this.type == entityTypes.player) { 
                        this.position.x += this.collisions.left.deep;
                        this.speed.x    =  0;
                    }

                    //choque jugador con kill
                    if(this.collisions.left.type === entityTypes.kill && this.type == entityTypes.player) { 
                        this.position.x += this.collisions.left.deep;
                        this.speed.x    =  0;
                    }

                     // choque bola con kill
                     if(this.collisions.left.type === entityTypes.kill && this.type == entityTypes.ball) { 
                        game.gameOver();
                    }

                    //choque de bola con muro
                    if(this.collisions.left.type === entityTypes.wall && this.type == entityTypes.ball) { 
                        this.position.x += this.collisions.left.deep;
                        this.speed.x    =  -this.speed.x;
                    }

                    //choque de bola con enemigo
                    if(this.collisions.left.type === entityTypes.enemy && this.type == entityTypes.ball) { 
                        this.position.x += this.collisions.left.deep;
                        this.speed.x    =  -this.speed.x;
                    }

                    //choque de enemigo con bola
                    if(this.collisions.left.type === entityTypes.ball && this.type == entityTypes.enemy) { 
                        game.getSound('destroyBlock').play();
                        this.powerUps.forEach( powerUp => {
                            powerUp.crashBox(this, game)
                        })
                        game.removeObject(this)
                    }

                    //choque de bola con jugador
                    if(this.collisions.left.type === entityTypes.player && this.type == entityTypes.ball) {
                        this.position.x += this.collisions.left.deep;
                        this.speed.x    =  Math.abs(this.speed.x) ;
                        this.speed.y    =  -Math.abs(this.speed.y) ;
                    }

                    //choque de jugador con bola
                    if(this.collisions.left.type === entityTypes.ball && this.type == entityTypes.player) { 
                    }

                    //choque jugador con powerUp
                    if(this.collisions.left.type === entityTypes.powerUp && this.type == entityTypes.player) { 
                        let powerUp = game.getObject(this.collisions.left.id).powerUps[0];
                        powerUp.getPowerUp(this);
                    }

                    //choque powerUp con jugador
                    if(this.collisions.left.type === entityTypes.player && this.type == entityTypes.powerUp) { 
                        game.removeObject(this);
                    }

                    //choque powerUp contra bala
                    if(this.collisions.left.type === entityTypes.powerUp && this.type == entityTypes.bullet) { 
                        game.removeObject(this);
                    }
                }


                
    
            }

        }

        this.addForce = (force) => {
            this.forces.push(force);
        }

        this.addPowerUp = (powerUp) => {
            this.powerUps.push(powerUp);
        }

        this.getAceleration = () => {
            let xAceleration = 0,
                yAceleration = 0;

            this.forces.forEach( force => {
                let forceAply = force.lambda(this.forces);
                xAceleration += forceAply.x;
                yAceleration += forceAply.y;
            })

            return {
                xAceleration: (xAceleration/this.mass),
                yAceleration: (yAceleration/this.mass)
            }
        }

        this.getSides = () => {
            let top = this.position.y,
                rigth = this.position.x + this.width,
                bottom = this.position.y + this.height,
                left = this.position.x;

            return {
                top: top,
                rigth: rigth,
                bottom: bottom,
                left
            }
        }

        this.make = () => {
            
            if (this.type != entityTypes.player) {
                if (!this.isImage){
                    ctx.fillStyle = this.color;
                    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
                } else {
                    ctx.drawImage(this.image,this.position.x, this.position.y, this.width, this.height);
                }
            } else {

                let center = this.getCenter();

                ctx.fillStyle = '#46286c';
                ctx.fillRect(this.position.x, this.position.y, this.band, this.height)

                ctx.fillStyle = this.color;
                ctx.fillRect(this.position.x + this.band, this.position.y, this.width - this.band, this.height)

                ctx.fillStyle = '#46286c';
                ctx.fillRect(this.position.x + this.width - this.band, this.position.y, this    .band, this.height);

                
                ctx.fillStyle = '#46286c';
                ctx.fillRect(center.x - (gunWidth/2), center.y - (this.height/2) - gunHeigth , gunWidth, gunHeigth);


            }
        }

        this.getCenter = () => {
            let point = new Point(this.position.x + this.width/2, this.position.y + this.height/2);
            return point;
        }

        this.exectHandleKeys = () => {
            this.handleKeys(this);
        }

    }
