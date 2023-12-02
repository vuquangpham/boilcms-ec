import fetch from "../../../../../assets/js/fetch";

export default class OrderPost{
    constructor(wrapper) {
        this.wrapper = wrapper

        this.elements = {

            editOrder: wrapper.querySelector('[data-order-edit]')
        };

        // handle click action
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this));

        // create popup
        Popup.create({
            target: this.wrapper.querySelector('[data-popup="data-order-edit"]'),

        });
    }

    handleWrapperClick(e){
        let functionHandling = () => {
        };
        let target = null;

        const singleMediaItemEL = e.target.closest('[data-order-edit]');

        // show single media item
        if(singleMediaItemEL){
            console.log('1233')
        }

        // call the function
        functionHandling(target);
    }

}