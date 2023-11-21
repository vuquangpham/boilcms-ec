import Product from "./Product";

export default class VariableProduct extends Product{
    constructor(parentWrapper, wrapper){
        super(parentWrapper, wrapper);


        // init tabs
        Accordion.create({
            target: this.wrapper.querySelector('[data-tab]'),
            type: 'fade'
        });

        Accordion.create({
            target: this.wrapper.querySelector('[data-accordion]'),
            triggerAttr: 'data-acc-trigger',
            receiverAttr: 'data-acc-receiver',
            triggerSelector: '[data-acc-trigger]',
            receiverSelector: '[data-acc-receiver]',
        });
    }
}