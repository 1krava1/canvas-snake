class Field {
    constructor( config ){
        const defaultConfig = {
            id: 'canvas',
            width: 1200,
            height: 900,
            cols: 40,
            rows: 30
        };
        config = Object.assign(defaultConfig, config);
        this.width = config.width;
        this.height = config.height;
        this.cols = config.cols;
        this.rows = config.rows;
        this.canvas = document.getElementById(config.id);
        this.canvas.width = config.width;
        this.canvas.height = config.height;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.strokeStyle = "#fff";
    }
    clear(){
        this.ctx.clearRect( 0, 0, this.width, this.height );
    }
}
