if ( document.querySelector('.play-pause') ) {
    document.querySelector('.play-pause').addEventListener('click', function(e){
        e.preventDefault();
        if ( this.classList.contains('paused') ){
            this.classList.remove('paused');
        } else {
            this.classList.add('paused');
        }
    });
}