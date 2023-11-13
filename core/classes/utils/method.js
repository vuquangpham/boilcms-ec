class Method{
    constructor(){
        this.methods = {
            GET: {
                name: 'get'
            },
            POST: {
                name: 'post'
            }
        };
    }

    getValidatedMethod(method){
        const result = Object.values(this.methods).find(instance => instance.name === method);
        return result || this.methods.GET;
    }
}

module.exports = new Method();