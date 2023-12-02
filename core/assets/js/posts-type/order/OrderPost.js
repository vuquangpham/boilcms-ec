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
        const editOrderElements = wrapper.querySelectorAll('[data-order-edit]');
        editOrderElements.forEach(element => {
            console.log(element)
            Popup.create({
                target: element,
            });
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