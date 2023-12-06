const Category = require('../classes/category/category')
const Type = require("../classes/utils/type");
const {replyCustomerMessageViaEmail} = require("../utils/email.utils");

class Contact extends Category{
    constructor(config) {
        super(config);
    }

    validateInputData(inputData) {
        const request = inputData.request;
        const response = inputData.response;

        // input
        const name = request.body.name;
        const email = request.body.email;
        const content = request.body.content;
        const reply = request.body.reply;

        return {
            name,
            email,
            content,
            reply
        }
    }

    update(id, data) {
        return new Promise((resolve, reject) => {
            try{
                this.databaseModel.findOneAndUpdate({_id: id}, data)
                    .then(_ => {
                        replyCustomerMessageViaEmail(data)
                            .then(data => console.log(data))
                    })
                resolve(this.databaseModel.findById(id))
            }catch(error){
                reject(error)
            }
        })
    }
}

module.exports = new Contact({
    name: 'Contact',
    url: '/contact',
    type: 'contact',
    order: 1,
    contentType: Type.types.CONTACT,
})