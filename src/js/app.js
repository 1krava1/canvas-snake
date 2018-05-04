class SnakeNode {
    constructor( x, y, direction ){
        this.direction = direction;
        this.pos = {
            x: x,
            y: y,
        }
    }
}
class AppleNode {
    constructor( x, y ){
        this.pos = {
            x: x,
            y: y,
        }
    }
}
class Field {
    constructor( id = 'canvas', width = 1200, height = 900, cols = 40, rows = 30 ){
        this.width = width;
        this.height = height;
        this.cols = cols;
        this.rows = rows;
        this.canvas = document.getElementById(id);
        this.canvas.width = width;
        this.canvas.height = height;
        // this.canvas.style.width = width/2 + 'px';
        // this.canvas.style.height = height/2 + 'px';
        this.ctx = this.canvas.getContext('2d');
        this.ctx.strokeStyle = "#fff";
    }
    clear(){
        this.ctx.clearRect( 0, 0, this.width, this.height );
    }
}
class Snake {
    constructor(){
        if ( !document.getElementById('canvas') ) return;
        this.direction = 90;
        this.directionsPull = [];
        this.speed = .25;
        this.field = new Field();
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
        this.field.ctx.beginPath();
        this.nodes.forEach((node) => {
            this.field.ctx.rect(
                (this.field.width/this.field.cols) * node.pos.x,
                (this.field.height/this.field.rows) * node.pos.y,
                this.field.width/this.field.cols,
                this.field.height/this.field.rows,
            );
        });
        this.field.ctx.stroke();
    }
    drawApples() {
        this.field.ctx.save();
        this.field.ctx.beginPath();
        this.field.ctx.fillStyle = "#f00";
        this.apples.forEach((apple) => {
            this.field.ctx.moveTo(
                ((this.field.width/this.field.cols) * apple.pos.x) + (this.field.width/this.field.cols),
                ((this.field.height/this.field.rows) * apple.pos.y) + (this.field.height/this.field.rows)
            );
            this.field.ctx.arc(
                ((this.field.width/this.field.cols) * apple.pos.x) + (this.field.width/this.field.cols)/2,
                ((this.field.height/this.field.rows) * apple.pos.y) + (this.field.height/this.field.rows)/2,
                10,
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
                newHead.pos.x = newHead.pos.x === 0 - 1 ? this.field.cols - 1 : newHead.pos.x - 1;
                break;
            case 0:
                newHead.pos.y = newHead.pos.y === 0 - 1 ? this.field.rows - 1 : newHead.pos.y - 1;
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
            left: document.getElementById('move-left'),
            top: document.getElementById('move-top'),
            right: document.getElementById('move-right'),
            down: document.getElementById('move-down'),
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
        if ( !direction ) return;
        switch( direction ){
            case('left'):
                if ( this.directionsPull.length === 0 && this.direction !== 90 ) {
                    this.directionsPull.push(270);
                } else if ( this.directionsPull.length > 0 && this.directionsPull.length < 2 && this.directionsPull[this.directionsPull.length - 1] !== 90 ) {
                    this.directionsPull.push(270);
                }
                break;
            case('top'):
                if ( this.directionsPull.length === 0 && this.direction !== 180 ) {
                    this.directionsPull.push(0);
                } else if ( this.directionsPull.length > 0 && this.directionsPull.length < 2 && this.directionsPull[this.directionsPull.length - 1] !== 180 ) {
                    this.directionsPull.push(0);
                }
                break;
            case('right'):
                if ( this.directionsPull.length === 0 && this.direction !== 270 ) {
                    this.directionsPull.push(90);
                } else if ( this.directionsPull.length > 0 && this.directionsPull.length < 2 && this.directionsPull[this.directionsPull.length - 1] !== 270 ) {
                    this.directionsPull.push(90);
                }
                break;
            case('down'):
                if ( this.directionsPull.length === 0 && this.direction !== 0 ) {
                    this.directionsPull.push(180);
                } else if ( this.directionsPull.length > 0 && this.directionsPull.length < 2 && this.directionsPull[this.directionsPull.length - 1] !== 0 ) {
                    this.directionsPull.push(180);
                }
                break;
        }
    }
    togglePauseControls(){
        document.getElementById('togglePause').addEventListener( 'click', (e) => this.togglePause() );
    }
    restartControls(){
        document.getElementById('restart').addEventListener( 'click', (e) => this.restart() );
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
        this.field = new Field();
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
let snake = new Snake();

document.querySelector('.play-pause').addEventListener('click', function(e){
    e.preventDefault();
    if ( this.classList.contains('paused') ){
        this.classList.remove('paused');
    } else {
        this.classList.add('paused');
    }
});
