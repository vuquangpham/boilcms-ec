const path = require("path");
const {readFilesInFolderInAsync} = require("../../utils/os.utils");

class Controller{
    constructor(){
        this.instances = [];
    }

    init(directory){
        readFilesInFolderInAsync(directory)
            .then(fileNames => {
                // add to instances
                fileNames.forEach(file => this.instances.push(require(path.join(directory, file))));
                this.instances.sort((a, b) => a.order - b.order);

                console.log(this.instances);
            })
            .catch(err => {
                console.error(err);
            });
    }
}

module.exports = Controller;