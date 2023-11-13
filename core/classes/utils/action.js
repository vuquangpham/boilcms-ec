class Action{
    constructor(){
        this.actions = {
            DEFAULT: {
                name: 'get',
                fileName: 'index'
            },
            ADD: {
                name: 'add',
                fileName: 'detail'
            },
            EDIT: {
                name: 'edit',
                fileName: 'detail'
            },
            DELETE:{
                name: 'delete',
            }
        };
    }

    /**
     * Get action type based on type name
     * @param type {string}
     * @param defaultAction {Object}
     * @return {Object}
     * */
    getActionType(type, defaultAction = this.actions.DEFAULT){
        return this.isValidAction(type)
            ? Object.values(this.actions).find(instance => instance.name === type)
            : defaultAction;
    }

    /**
     * Validate action
     * @param actionType
     * @return boolean
     */
    isValidAction(actionType){
        return !!Object.values(this.actions).find(instance => instance.name === actionType);
    }
}

module.exports = new Action();