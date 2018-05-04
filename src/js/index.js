if ( document.getElementById('index') ) {
    const config = {
        field: {
            id: 'canvas',
            width: 1200,
            height: 1200,
            cols: 40,
            rows: 40,
        },
        controls: {
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
        }
    }
    let snake = new Snake( config );
}