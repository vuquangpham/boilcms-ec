class AccountType {
    constructor() {
        this.types = {
            SIGNIN: {
                name: 'sign-in'
            },
            SIGNUP: {
                name: 'sign-up'
            },
            LOGOUT: {
                name: 'log-out'
            },
            FORGET: {
                name: 'forget-password'
            },
            RESET: {
                name: 'reset-password'
            },
            VERIFY: {
                name: 'verify'
            }
        };
    }

    /**
     * Get action type
     * @param type {string}
     * @param defaultAction {Object}
     * @return {Object}
     * */
    getActionType(type, defaultAction = this.types.SIGNIN) {
        return this.isValidAction(type)
            ? Object.values(this.types).find(instance => instance.name === type)
            : defaultAction;
    }

    /**
     * Validate action
     * @param actionType
     * @return boolean
     */
    isValidAction(actionType) {
        return !!Object.values(this.types).find(instance => instance.name === actionType);
    }
}

module.exports = new AccountType();