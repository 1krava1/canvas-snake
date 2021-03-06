class Food extends NodeList {}
class Game {
    constructor( config ){
        const controlsDefault = {
            direction: {
                left: 'move-left',
                top: 'move-top',
                right: 'move-right',
                down: 'move-down',
            },
            game: {
                pause: 'togglePause',
                restart: 'restart',
            }
        };
        this.controls = Object.assign(controlsDefault, config.controls);
        if ( !document.getElementById('canvas') ) return;
        this.direction = 90;
        this.directionsPull = [];
        this.speed = .25;
        this.field = new Field( config.field );
        this.lastFrame = 0;
        this.points = 0;
        this.gameover = false;
        this.removedSnakeNode = false;
        this.nodes = [
            new SnakeNode(7, 1),
            new SnakeNode(6, 1),
            new SnakeNode(5, 1),
            new SnakeNode(4, 1),
            new SnakeNode(3, 1),
            new SnakeNode(2, 1),
            new SnakeNode(1, 1),
        ];
        this.apples = [];
        this.bindGameControls();
        this.play();
    }

    drawSnake() {
        this.field.ctx.save();
        this.field.ctx.beginPath();
        this.nodes.forEach((node) => {
            this.field.ctx.rect(
                (this.field.width/this.field.cols) * node.pos.x,
                (this.field.height/this.field.rows) * node.pos.y,
                this.field.width/this.field.cols,
                this.field.height/this.field.rows,
            );
        });
        this.field.ctx.fillStyle = "rgba(255, 255, 255, .4)";
        this.field.ctx.fillRect(
            (this.field.width/this.field.cols) * this.nodes[0].pos.x,
            (this.field.height/this.field.rows) * this.nodes[0].pos.y,
            this.field.width/this.field.cols,
            this.field.height/this.field.rows
        );
        this.field.ctx.lineWidth = 5;
        this.field.ctx.stroke();
        this.field.ctx.restore();
    }
    drawApples() {
        this.field.ctx.save();
        this.field.ctx.beginPath();
        this.field.ctx.fillStyle = "#4e494a";
        this.apples.forEach((apple) => {
            this.field.ctx.moveTo(
                ((this.field.width/this.field.cols) * apple.pos.x) + (this.field.width/this.field.cols),
                ((this.field.height/this.field.rows) * apple.pos.y) + (this.field.height/this.field.rows)
            );
            this.field.ctx.arc(
                ((this.field.width/this.field.cols) * apple.pos.x) + (this.field.width/this.field.cols)/2,
                ((this.field.height/this.field.rows) * apple.pos.y) + (this.field.height/this.field.rows)/2,
                (this.field.width/this.field.cols)*.4,
                0,
                2*Math.PI
            );
        });
        this.field.ctx.fill();
        this.field.ctx.restore();
        this.field.ctx.strokeStyle = "#fff";
    }

    displayPoints(){
        document.getElementById('points').innerText = this.points;
    }
    incPoints(){
        this.points++;
        switch (true) {
            case this.points > 90:
                this.speed = .08;
                break;
            case this.points > 80:
                this.speed = .09;
                break;
            case this.points > 70:
                this.speed = .10;
                break;
            case this.points > 60:
                this.speed = .11;
                break;
            case this.points > 50:
                this.speed = .12;
                break;
            case this.points > 40:
                this.speed = .14;
                break;
            case this.points > 30:
                this.speed = .16;
                break;
            case this.points > 20:
                this.speed = .18;
                break;
            case this.points > 10:
                this.speed = .2;
                break;
        }
        this.displayPoints();
    }

    spawnApple() {
        const newApple = {
            pos: {
                x: Math.floor(Math.random()*this.field.cols),
                y: Math.floor(Math.random()*this.field.rows)
            }
        };
        if ( this.nodes.filter( (node, index) => {
            return node.pos.x === newApple.pos.x && node.pos.y === newApple.pos.y;
        }).length === 0 ) {
            if ( this.apples.length < 3 ) {
                this.apples.push(
                    new AppleNode(
                        newApple.pos.x,
                        newApple.pos.y
                    )
                );
            }
        } else {
            this.spawnApple();
        }
    }
    spawnNewSnakeNode() {
        this.nodes.push( this.removedSnakeNode );
    }

    checkForSnakeColision() {
        this.nodes.forEach((node, index, nodes) => {
            this.apples = this.apples.filter( (apple) => {
                if ( apple.pos.x === node.pos.x && apple.pos.y === node.pos.y ) {
                    this.spawnNewSnakeNode();
                    this.incPoints();
                }
                return apple.pos.x !== node.pos.x || apple.pos.y !== node.pos.y;
            });
        });
        this.gameover = this.nodes.some( (node, index) => {
            return this.nodes.filter( (n, i) => {
                return index !== i && node.pos.x === n.pos.x && node.pos.y === n.pos.y;
            }).length > 0;
        });
    }

    move() {
        let newHead = new SnakeNode(
            this.nodes[0].pos.x,
            this.nodes[0].pos.y,
        );
        switch (this.direction) {
            case 90:
                newHead.pos.x = newHead.pos.x === this.field.cols - 1 ? 0 : newHead.pos.x + 1;
                break;
            case 180:
                newHead.pos.y = newHead.pos.y === this.field.rows - 1 ? 0 : newHead.pos.y + 1;
                break;
            case 270:
                newHead.pos.x = newHead.pos.x === 0 ? this.field.cols - 1 : newHead.pos.x - 1;
                break;
            case 0:
                newHead.pos.y = newHead.pos.y === 0 ? this.field.rows - 1 : newHead.pos.y - 1;
                break;
        }
        this.nodes.unshift(newHead);
        this.removedSnakeNode = this.nodes.pop();
    }

    bindGameControls(){
        this.turnControls();
        this.togglePauseControls();
        this.restartControls();
    }
    turnControls() {
        window.addEventListener('keydown', (e) => {
            switch( e.keyCode ){
                case(37):
                    this.triggerDirection('left');
                    break;
                case(38):
                    this.triggerDirection('top');
                    break;
                case(39):
                    this.triggerDirection('right');
                    break;
                case(40):
                    this.triggerDirection('down');
                    break;
            }
        });
        const moveButtons = {
            left: document.getElementById(this.controls.direction.left),
            top: document.getElementById(this.controls.direction.top),
            right: document.getElementById(this.controls.direction.right),
            down: document.getElementById(this.controls.direction.down),
        };
        moveButtons.left.addEventListener('click', (e) => {
            e.preventDefault();
            this.triggerDirection('left');
        });
        moveButtons.top.addEventListener('click', (e) => {
            e.preventDefault();
            this.triggerDirection('top');
        });
        moveButtons.right.addEventListener('click', (e) => {
            e.preventDefault();
            this.triggerDirection('right');
        });
        moveButtons.down.addEventListener('click', (e) => {
            e.preventDefault();
            this.triggerDirection('down');
        });
    }
    triggerDirection( direction ){
        if ( !direction || this.isPaused ) return;
        switch( direction ){
            case('left'):
                document.getElementById(this.controls.direction.left).classList.add('active');
                setTimeout(() => {
                    document.getElementById(this.controls.direction.left).classList.remove('active');
                }, 100);
                if ( this.directionsPull.length === 0 && this.direction !== 90 ) {
                    this.directionsPull.push(270);
                } else if ( this.directionsPull.length > 0 && this.directionsPull.length < 2 && this.directionsPull[this.directionsPull.length - 1] !== 90 ) {
                    this.directionsPull.push(270);
                }
                break;
            case('top'):
                document.getElementById(this.controls.direction.top).classList.add('active');
                setTimeout(() => {
                    document.getElementById(this.controls.direction.top).classList.remove('active');
                }, 100);
                if ( this.directionsPull.length === 0 && this.direction !== 180 ) {
                    this.directionsPull.push(0);
                } else if ( this.directionsPull.length > 0 && this.directionsPull.length < 2 && this.directionsPull[this.directionsPull.length - 1] !== 180 ) {
                    this.directionsPull.push(0);
                }
                break;
            case('right'):
                document.getElementById(this.controls.direction.right).classList.add('active');
                setTimeout(() => {
                    document.getElementById(this.controls.direction.right).classList.remove('active');
                }, 100);
                if ( this.directionsPull.length === 0 && this.direction !== 270 ) {
                    this.directionsPull.push(90);
                } else if ( this.directionsPull.length > 0 && this.directionsPull.length < 2 && this.directionsPull[this.directionsPull.length - 1] !== 270 ) {
                    this.directionsPull.push(90);
                }
                break;
            case('down'):
                document.getElementById(this.controls.direction.down).classList.add('active');
                setTimeout(() => {
                    document.getElementById(this.controls.direction.down).classList.remove('active');
                }, 100);
                if ( this.directionsPull.length === 0 && this.direction !== 0 ) {
                    this.directionsPull.push(180);
                } else if ( this.directionsPull.length > 0 && this.directionsPull.length < 2 && this.directionsPull[this.directionsPull.length - 1] !== 0 ) {
                    this.directionsPull.push(180);
                }
                break;
        }
    }
    togglePauseControls(){
        document.getElementById(this.controls.game.pause).addEventListener( 'click', (e) => this.togglePause() );
    }
    restartControls(){
        document.getElementById(this.controls.game.restart).addEventListener( 'click', (e) => this.restart() );
    }

    play() {
        window.requestAnimationFrame((now) => {
            if(!this.lastFrame || now - this.lastFrame >= this.speed*1000) {
                this.lastFrame = now;
                this.direction = this.directionsPull.length > 0 ? this.directionsPull.shift() : this.direction;

                this.checkForSnakeColision();
                if ( !this.gameover && !this.isPaused ) {
                    this.move();
                } else if ( this.gameover ) {
                    let pointsField = document.getElementById('points');
                    pointsField.innerText = this.points + ' game is over';
                }
                this.spawnApple();
                this.field.clear();
                this.drawSnake();
                this.drawApples();
            }
            this.play();
        })
    }
    togglePause() {
        this.isPaused = !this.isPaused;
    }
    restart() {
        this.direction = 90;
        this.directionsPull = [];
        this.speed = .25;
        this.lastFrame = 0;
        this.points = 0;
        this.gameover = false;
        this.nodes = [
            new SnakeNode(7, 1, this.direction),
            new SnakeNode(6, 1, this.direction),
            new SnakeNode(5, 1, this.direction),
            new SnakeNode(4, 1, this.direction),
            new SnakeNode(3, 1, this.direction),
            new SnakeNode(2, 1, this.direction),
            new SnakeNode(1, 1, this.direction),
        ];
        this.apples = [];
        this.displayPoints();
    }
}
