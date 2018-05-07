class SnakeNode extends Node {
    /**
     * @param {Field} field
     * @return {Null}
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