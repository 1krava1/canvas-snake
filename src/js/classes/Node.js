class Node {
    constructor( x, y ){
        this.pos = {
            x: x,
            y: y
        }
    }

    /**
     * @param {Field} field
     * @return {null}
     */
    draw(field){
        field.ctx.fillRect(
            (field.width/field.cols) * this.pos.x,
            (field.height/field.rows) * this.pos.y,
            field.width/field.cols,
            field.height/field.rows
        );
    }
}