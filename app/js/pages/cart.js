document.querySelectorAll('.cart-page').forEach(wrapper => {
    // cart form
    const cartForm = wrapper.querySelector('form.cart');
    const variationInputs = Array.from(cartForm.querySelectorAll('input[name="variations"]'));
    const submitButton = cartForm.querySelector('.submit-btn');

    variationInputs.forEach(input => {

        input.addEventListener('change', (e) => {
            const hasChecked = variationInputs.map(i => i.checked).some(i => i);
            if(hasChecked){
                submitButton.removeAttribute('disabled');
            }else{
                submitButton.setAttribute('disabled', '');
            }
        });

    });
});