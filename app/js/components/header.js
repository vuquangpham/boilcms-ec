document.querySelectorAll('header').forEach(wrapper => {
    const loginPopup = wrapper.querySelector('[data-popup="login"]');

    if(loginPopup){
        Popup.create({
            target: loginPopup
        });
    }
});