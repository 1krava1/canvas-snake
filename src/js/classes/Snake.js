class Snake extends NodeList {
    /**
     * @param {SnakeNode[]} nodeFrom
     */
    constructor(nodes){
        this.nodes = nodes;
        this.id = 1;
        this.points = 0;
        this.direction = 90;
        this.speed = .25;
        this.gameover = false;
    }
}