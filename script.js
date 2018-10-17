
    var ctx;
    var id = 0;
    var keys = []
    const LINEAL_SPEED = 2;

    function main(){
        var game = new Game();
        var gravity = new Vector(0, 0.2);

        var player  = new Box(100, 100, 30, 30, "blue", false, true),
            floor1  = new Box(300, 270, 800, 70, "gray", true, true);
            floor2  = new Box(0, 470, 900, 30, "gray", true, true);

        game.addObject(player)
            .addObject(floor1)
            .addObject(floor2)

        game.start(900, 500, gravity);
    }

    function Game() {
        this.canvas = document.createElement("canvas");
        this.objects = [];
        this.physics = {};

        this.start = ( width, height, gravity) => {
            this.canvas.width   = width;
            this.canvas.height  = height;

            this.physics = {
                gravity : gravity 
            }

            ctx = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.handleKeys();
            this.loop();
        };

        this.handleKeys = () =>{
            window.addEventListener('keydown', function (e) {
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
                if (keys) {
                    if (keys[37]) {
                        player.speed.x = -LINEAL_SPEED;
                    }

                    if (keys[39]) {
                        player.speed.x = LINEAL_SPEED;
                    }

                    if (!keys[37] && !keys[39]) {
                        player.speed.x = 0;
                    }

                    if(keys[38]) {
                        player.speed.y = -LINEAL_SPEED;
                    }

                    if(keys[40]) {
                        player.speed.y = LINEAL_SPEED;
                    }

                }

                this.objects.forEach( obj => {
                    obj.collisions = objectWorldCollition(obj, this.getOthers(obj)) ;
                    obj.update();
                    obj.make();
                });
            }

            setInterval(this.updateGame, 20);
        }

        this.addObject = function(object) {
            object.addForce(this.physics.gravity);
            this.objects.push(object);
            return this;
        }

        this.getOthers = (object) => {
            return this.objects.filter(obj => obj.id != object.id);
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

        let top1    = a.position.y + a.speed.y,
            rigth1  = a.position.x + a.width + a.speed.x,
            bottom1 = a.position.y + a.height + a.speed.y,
            left1   = a.position.x + a.speed.x;

        let top2    = b.position.y + b.speed.y,
            rigth2  = b.position.x + b.width + b.speed.x,
            bottom2 = b.position.y + b.height + b.speed.y,
            left2   = b.position.x + b.speed.x;

        let collision = {
            top:    {
                collision : false,
                deep: 0
            },
            rigth:  {
                collision : false,
                deep: 0
            },
            bottom: {
                collision : false,
                deep: 0
            },
            left:   {
                collision : false,
                deep: 0
            }
        }

        let collide = !((bottom1 < top2) || (top1 > bottom2) || (rigth1 < left2) || (left1 > rigth2));

        if (collide) {
            if (current_rigth1 <= current_left2 && rigth1 > left2) {
                collision.rigth.collision = true;
                collision.rigth.deep = -Math.abs(rigth1 - left2);
            } else if (current_left1 >= current_rigth2 && left1 < rigth2) {
                collision.left.collision = true;
                collision.left.deep = Math.abs(left1 - rigth2);
            } else if (current_top1 >= current_bottom2 && top1 < bottom2) {
                collision.top.collision = true;
                collision.top.deep = Math.abs(top1 - bottom2);
            } else if(current_bottom1 <= current_top2 && bottom1 > top2) {
                collision.bottom.collision = true;
                collision.bottom.deep = -Math.abs(bottom1 - top2);
            }
        }

        return collision;

    }

    function objectWorldCollition(object, world)  {
        var collitions = {
            top:    {
                collision : false,
                deep: 0
            },
            rigth:  {
                collision : false,
                deep: 0
            },
            bottom: {
                collision : false,
                deep: 0
            },
            left:   {
                collision : false,
                deep: 0
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

    var Forces = {

        gravity: {
            id: 'gravity',
            time: 0,
            lambda: (obj) => {
                let force = new Vector(0, 0.2);
                return force;
            }
        },

        collision: {
            id: 'collision',
            time: 0,
            lambda: (obj) => {
                let force = new Vector(0, -0.2);
                obj.forces.filter(force => force.id != 'collision')
                return force;
            }
        }


    }


    function Box(x, y, width, height, color, fixed, collide) {
        this.id = id;
        id += 1 ;
        this.position   = new Point(x,y);
        this.fixed      = fixed;
        this.collide    = collide;
        this.mass = 1;
        this.forces = [];
        this.stop = false;
        this.collisions = {
            top:    {
                collision : false,
                deep: 0
            },
            rigth:  {
                collision : false,
                deep: 0
            },
            bottom: {
                collision : false,
                deep: 0
            },
            left:   {
                collision : false,
                deep: 0
            }
        };

        this.width      = width;
        this.height     = height;
        this.speed      = new Vector(0, 0);

        this.update = () => {

                if (this.collisions.top.collision || this.collisions.rigth.collision || this.collisions.bottom.collision || this.collisions.left.collision) {
                    console.log(this.id);
                    console.log(this.collisions);
                }

            let aceleration = this.getAceleration();
                xAceleration = aceleration.xAceleration,
                yAceleration = aceleration.yAceleration;

            if (!this.fixed && !this.stop)  {
                this.position.x += this.speed.x + this.collisions.left.deep + this.collisions.rigth.deep;
                this.position.y += this.speed.y + this.collisions.bottom.deep + this.collisions.top.deep;

                this.speed.x    += xAceleration * (!this.collisions.left.collision)  * (!this.collisions.rigth.collision);
                this.speed.y    += yAceleration * (!this.collisions.top.collision )  * (!this.collisions.bottom.collision);
            }

            // if (this.collisions.top.collision || this.collisions.rigth.collision || this.collisions.bottom.collision || this.collisions.left.collision) {

            //     console.log(this.speed.y);
            // }

        }

        this.addForce = (force) => {
            this.forces.push(force);
        }

        this.getAceleration = () => {
            let xAceleration,
                yAceleration;
            
            this.forces.forEach( force => {
                xAceleration += force.x;
                yAceleration += force.y;
            })

            return {
                xAceleration: (xAceleration/m),
                yAceleration: (yAceleration/m)
            }
        }

        this.make = function() {
            ctx.fillStyle = color;
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }

    }
