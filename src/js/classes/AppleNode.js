class AppleNode extends Node {
    /**
     * @return {Int}
     */
    get weight(){
        return 1;
    }
    /**
     * @return {Int}
     */
    get points(){
        return 1;
    }
    /**
     * @param {Field} field
     * @return {Null}
     */
    draw(field){
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
    }
}