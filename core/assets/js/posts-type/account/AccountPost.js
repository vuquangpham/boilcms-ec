import fetch from "@global/js/fetch";

export default class AccountPost {
    constructor(wrapper) {
        this.wrapper = wrapper

        this.elements = {

            // popup form
            closePopupForm: wrapper.querySelector('[data-account-close-btn]'),

            // input fields
            currentPasswordInput: wrapper.querySelector('[data-current-password]'),
            passwordInput: wrapper.querySelector('[data-password]'),
            confirmPasswordInput: wrapper.querySelector('[data-confirm-password]'),

            // error message
            errorMessagePopup: wrapper.querySelector('[data-error-message]')
        }

        // vars
        const urlObject = new URL(location.href);
        this.FETCH_URL = urlObject.origin + '/boiler-admin/user';

        // handle click action
        this.wrapper.addEventListener('click', this.handleWrapperClick.bind(this))
    }

    handleShowAccountPopup() {

        //  clear input when show account popup
        this.elements.currentPasswordInput.value = '';
        this.elements.passwordInput.value = '';
        this.elements.confirmPasswordInput.value = '';

        // clear message
        this.elements.errorMessagePopup.innerHTML = ''
    }

    handleUpdatePasswordAccount(target) {

        const formEl = target.closest('[data-account-form]');
        const id = formEl.getAttribute('data-id');

        const formData = new FormData();
        formData.append('currentPassword', this.elements.currentPasswordInput.value);
        formData.append('password', this.elements.passwordInput.value);
        formData.append('confirmPassword', this.elements.confirmPasswordInput.value);

        fetch(this.FETCH_URL, {
            method: 'post',
            action: 'edit',
            getJSON: true,
            id: id
        }, {
            method: 'post',
            body: formData
        })
            .then(result => {

                // only false return json, if true it not return json
                if (result.ok !== true) {
                    return result.json()
                        .then(res => {
                            this.elements.errorMessagePopup.innerHTML = res.errorMessage
                        })
                } else this.elements.errorMessagePopup.innerHTML = 'Password updated';

            })
            .catch(err => console.error(err));
    }

    handleWrapperClick(e) {
        let functionHandling = () => {
        };
        let target = null;

        const updatePasswordBtnEl = e.target.closest('button[data-account-password-update-btn]')
        const showPopupChangePasswordBtnEl = e.target.closest('button[data-change-password]')

        if (updatePasswordBtnEl) {
            functionHandling = this.handleUpdatePasswordAccount.bind(this)
            target = updatePasswordBtnEl

        } else if (showPopupChangePasswordBtnEl) {
            functionHandling = this.handleShowAccountPopup.bind(this)
        }

        // call the function
        functionHandling(target)
    }
}