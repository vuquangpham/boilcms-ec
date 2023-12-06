const validate = (input, cb = v => v) => {
    const value = input.value.trim();
    const field = input.closest('.field');
    if(!cb(value, input)){
        field.classList.add('invalid');
        return false;
    }else{
        field.classList.remove('invalid');
    }

    return true;
};

document.querySelectorAll('body.register').forEach(wrapper => {

    const form = wrapper.querySelector('[data-form-submit]');
    if(!form) return;

    const inputs = form.querySelectorAll('[data-password-input], [data-name-input], [data-email-input], [data-confirm-password-input], [data-consent-input]');
    form.addEventListener('submit', (e) => {

        let hasError = false;
        inputs.forEach(input => {
            const isNameInput = input.hasAttribute('data-name-input');
            const isEmailInput = input.hasAttribute('data-email-input');
            const isPasswordInput = input.hasAttribute('data-password-input');
            const isConfirmPasswordInput = input.hasAttribute('data-confirm-password-input');
            const isConsentField = input.hasAttribute('data-consent-input');

            // name input
            if(isNameInput && !validate(input))
                return hasError = true;

            // email input
            if(isEmailInput && !validate(input, value => value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))) return hasError = true;

            // password input
            if(isPasswordInput && !validate(input, value => value.match(/^[0-9a-zA-Z\W]{8,}$/)))
                return hasError = true;

            // confirm password input
            if(isConfirmPasswordInput && !validate(input, value => {
                const passwordField = form.querySelector('[data-password-input]').value;
                return value === passwordField && value.length;
            }))
                return hasError = true;

            // consent field
            if(isConsentField && !validate(input, _ => input.checked)) return hasError = true;
        });

        if(hasError) return e.preventDefault();
    });
});