export default class Product{
    constructor(parentWrapper, wrapper){
        this.parentWrapper = parentWrapper;
        this.wrapper = wrapper;
    }

    generateObjectToDOM(){

    }

    generateDOMToObject(){

    }

    save(){
        this.generateDOMToObject();
        console.log('save method');
    }
}