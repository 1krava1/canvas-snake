if ( document.getElementById('new-ui') ) {
    if ( document.querySelector('#play-pause') ) {
        document.querySelector('#play-pause').addEventListener('click', function(e){
            e.preventDefault();
            if ( this.classList.contains('paused') ){
                this.classList.remove('paused');
            } else {
                this.classList.add('paused');
            }
        });
    }
    const config = {
        field: {
            id: 'canvas',
            width: 1200,
            height: 1200,
            cols: 25,
            rows: 25,
        },
        controls: {
            direction: {
                left: 'move-left',
                top: 'move-top',
                right: 'move-right',
                down: 'move-down',
            },
            game: {
                pause: 'play-pause',
                restart: 'restart',
            }
        }
    }
    let snake = new Snake( config );
}