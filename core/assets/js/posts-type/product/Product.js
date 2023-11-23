export default class Product{
    constructor(parentWrapper, wrapper){
        this.parentWrapper = parentWrapper;
        this.wrapper = wrapper;

        // json
        this.jsonElement = null;
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

        return true;
    }
}