import fetch from "@global/js/fetch";

export default class AddUser {
    constructor(wrapper) {
        this.wrapper = wrapper

        this.elements = {

            // popup
            closePopupForm: wrapper.querySelector('[data-user-close-btn]'),

            // register popup input fields
            userNameRegisterInput: wrapper.querySelector('[data-user-register-name]'),
            userEmailRegisterInput: wrapper.querySelector('[data-user-register-email]'),
            userPasswordRegisterInput: wrapper.querySelector('[data-user-register-password]'),
            userConfirmPasswordRegisterInput: wrapper.querySelector('[data-user-register-confirm-password]'),

            // select register value
            selectRoleRegisterInput: wrapper.querySelector('[data-user-register-role]'),
            selectStateRegisterInput: wrapper.querySelector('[data-user-register-state]'),

        }

        // vars
        const urlObject = new URL(location.href);
        this.FETCH_URL = urlObject.origin + urlObject.pathname;

        // handle click action
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this));
    }


    /**
     * Handle add new user
     * */
    handleAddNewUser() {

        const formData = new FormData();
        formData.append('name', this.elements.userNameRegisterInput.value);
        formData.append('email', this.elements.userEmailRegisterInput.value);
        formData.append('password', this.elements.userPasswordRegisterInput.value);
        formData.append('confirmPassword', this.elements.userConfirmPasswordRegisterInput.value);
        formData.append('role', this.elements.selectRoleRegisterInput.value);
        formData.append('state', this.elements.selectStateRegisterInput.value)

        fetch(this.FETCH_URL, {
            method: 'post',
            action: 'add',
            getJSON: true,

        }, {
            method: 'post',
            body: formData
        })
            .then(res => res.json())
            .then(_ => {

                // close the popup
                this.elements.closePopupForm.click();
            })
            .catch(err => console.error(err));
    }

    handleWrapperClick(e) {
        let functionHandling = () => {
        };
        let target = null;

        const addNewUserBtnEl = e.target.closest('button[data-add-new-user-btn]')

        if (addNewUserBtnEl) {
            functionHandling = this.handleAddNewUser.bind(this);
        }


        // call the function
        functionHandling(target);
    }
}