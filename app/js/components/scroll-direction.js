class ScrollDirection{
    constructor(){
        // classes
        this.CLASSES = {
            TOP: 'scroll-top',
            MIDDLE: 'scroll-middle',
            BOTTOM: 'scroll-bottom',
            UP: 'scroll-up',
            DOWN: 'scroll-down'
        };

        // height for controlling the direction
        this.heightForControlling = parseInt(Theme.getCSSVariable(document.documentElement, '--header-height'));

        // register event listener for calculating the position
        this.registerEventListener();

        // run the scroll event
        this.handleWindowScroll();
    }

    registerEventListener(){

        // resize event
        window.addEventListener('resize', Theme.debounce(this.handleWindowResize.bind(this)));

        // scroll event
        window.addEventListener('scroll', this.handleWindowScroll.bind(this));
    }

    handleWindowResize(){
        // height for controlling the direction
        this.heightForControlling = parseInt(Theme.getCSSVariable(document.documentElement, '--header-height'));
    }

    handleWindowScroll(){
        // vars
        const maxHeightOfTheScrollY = parseInt(document.documentElement.offsetHeight - innerHeight);
        const scrollY = parseInt(window.scrollY);

        /* equal to 0 */
        if(scrollY === 0){
            document.documentElement.classList.add(this.CLASSES.TOP);
        }else{
            document.documentElement.classList.remove(this.CLASSES.TOP);
        }

        /* in zone of [heightForController, max] */
        if(scrollY > this.heightForControlling){
            document.documentElement.classList.add(this.CLASSES.MIDDLE);
        }else{
            document.documentElement.classList.remove(this.CLASSES.MIDDLE);
        }

        /* at the end of the page */
        if(scrollY === maxHeightOfTheScrollY){
            document.documentElement.classList.add(this.CLASSES.BOTTOM);
        }else{
            document.documentElement.classList.remove(this.CLASSES.BOTTOM);
        }

        // remove up/down scroll at the beginning of the page or at the end
        if(scrollY > 0 && scrollY < maxHeightOfTheScrollY){

            /* up/down scroll */
            if(scrollY > this.previouScroll){
                document.documentElement.classList.remove(this.CLASSES.UP);
                document.documentElement.classList.add(this.CLASSES.DOWN);
            }else{
                document.documentElement.classList.add(this.CLASSES.UP);
                document.documentElement.classList.remove(this.CLASSES.DOWN);
            }

        }else{
            document.documentElement.classList.remove(this.CLASSES.UP);
            document.documentElement.classList.remove(this.CLASSES.DOWN);
        }

        // register previous scroll
        this.previouScroll = scrollY;
    }
}

export default new ScrollDirection();