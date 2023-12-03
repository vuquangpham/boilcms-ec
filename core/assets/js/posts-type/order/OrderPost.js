import fetch from "../../../../../assets/js/fetch";

export default class OrderPost{
    constructor(wrapper) {
        this.wrapper = wrapper

        this.elements = {

            editOrder: wrapper.querySelector('[data-order-edit]')
        };

        // handle click action
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this));

        // create popup for each [data-order-edit] element
        this.editOrderPopup = Popup.create({
            target: document.createElement('div'),
            popupContent: this.wrapper.querySelector('[data-popup-content="data-order-edit"]')

        })

    }

    showSingleOrder(){
        this.editOrderPopup.open()
    }

    handleWrapperClick(e){
        let functionHandling = () => {
        };
        let target = null;

        const singleOrderItemEL = e.target.closest('[data-order-edit]');

        // show single media item
        if(singleOrderItemEL){
            functionHandling = this.showSingleOrder.bind(this);
            target = singleOrderItemEL;
        }

        // call the function
        functionHandling(target);
    }

}