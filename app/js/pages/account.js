import fetch from '@global/js/fetch';

document.querySelectorAll('body.account-page').forEach(wrapper => {

    // init tab
    Accordion.create({
        target: wrapper.querySelector('[data-tab]'),
        type: 'fade'
    });

    // elements
    const form = wrapper.querySelector('[data-form-update-password]');

    const elements = {
        currentPasswordInput: wrapper.querySelector('[data-current-password]'),
        passwordInput: wrapper.querySelector('[data-password]'),
        confirmPasswordInput: wrapper.querySelector('[data-confirm-password]'),

        errorMessage: wrapper.querySelector('[data-error-message]')
    };
    const fetchURL = form.getAttribute('action');

    // update password
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        console.log('submit');
        const id = form.getAttribute('data-id');

        const formData = new FormData();
        formData.append('currentPassword', elements.currentPasswordInput.value);
        formData.append('password', elements.passwordInput.value);
        formData.append('confirmPassword', elements.confirmPasswordInput.value);

        fetch(fetchURL, {
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
                    elements.errorMessage.innerHTML = result.errorMessage;
                    elements.errorMessage.classList.remove('hidden');
                    return;
                }

                // success
                const instance = Popup.create({
                    target: document.createElement('div'),
                    popupContent: 'The password has been updated',
                    onAfterInit: (self) => {
                        setTimeout(_ => {
                            self.open();
                        }, 100);
                    },
                    onAfterClose: (self) => {
                        location.reload();
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
    });
});