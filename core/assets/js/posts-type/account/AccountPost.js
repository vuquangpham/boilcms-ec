import fetch from "@global/js/fetch";

export default class AccountPost{
    constructor(wrapper){
        this.wrapper = wrapper;

        this.elements = {

            // popup form
            closePopupForm: wrapper.querySelector('[data-account-close-btn]'),

            // input fields
            currentPasswordInput: wrapper.querySelector('[data-current-password]'),
            passwordInput: wrapper.querySelector('[data-password]'),
            confirmPasswordInput: wrapper.querySelector('[data-confirm-password]'),

            // error message
            errorMessagePopup: wrapper.querySelector('[data-error-message]')
        };

        // vars
        const urlObject = new URL(location.href);
        const adminPath = urlObject.pathname.split('/')[1];
        this.FETCH_URL = urlObject.origin + '/' + adminPath + '/user'

        // create popup
        Popup.create({
            target: this.wrapper.querySelector('[data-popup="change-password-popup"]'),

            onBeforeOpen: (_) => {
                //  clear input when show account popup
                this.elements.currentPasswordInput.value = '';
                this.elements.passwordInput.value = '';
                this.elements.confirmPasswordInput.value = '';

                // clear message
                this.elements.errorMessagePopup.innerHTML = '';
                this.elements.errorMessagePopup.classList.add('hidden');
            },

            onPopupContentClick: (self) => {
                const eventTarget = self.event.target;

                const target = eventTarget.closest('button[data-account-password-update-btn]');
                if(!target) return;

                this.handleUpdatePasswordAccount(target);
            }
        });
    }

    handleUpdatePasswordAccount(target){

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
            .then(res => res.json())
            .then(result => {
                if(result.errorMessage){
                    this.elements.errorMessagePopup.innerHTML = result.errorMessage;
                    this.elements.errorMessagePopup.classList.remove('hidden');
                    return;
                }

                this.elements.errorMessagePopup.innerHTML = 'The password has been updated';
            })
            .catch(err => {
                console.log(err);
            });
    }
}