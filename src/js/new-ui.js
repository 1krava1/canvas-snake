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
    function setGameSize( selector ){
        if ( document.querySelector(selector) ) {
            document.querySelector(selector).style.width = document.body.clientWidth + 'px';
            document.querySelector(selector).style.height = document.body.clientHeight + 'px';
        }
    }
    setGameSize('.game');
    function setCanvasSize( selector ){
        if ( document.getElementById(selector) ) {
            document.getElementById(selector).style.width = document.body.clientWidth - 30 + 'px';
            document.getElementById(selector).style.height = document.body.clientWidth - 30 + 'px';
        }
    }
    setCanvasSize('canvas');
    window.addEventListener('resize', function(){
        window.requestAnimationFrame(function(){
            setGameSize('.game');
            setCanvasSize('canvas');
        });
    });

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
    let game = new Game( config );
}