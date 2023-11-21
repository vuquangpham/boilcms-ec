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
        // re-assign object
        this.object = this.generateDOMToObject();

        // save to the dom
        this.jsonElement.innerHTML = JSON.stringify(this.object);
        console.log('save method');
    }
}