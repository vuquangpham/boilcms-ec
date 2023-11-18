document.querySelectorAll('body.account').forEach(wrapper => {
    console.log(wrapper);
    // init tab
    Accordion.create({
        target: wrapper.querySelector('[data-tab]'),
        type: 'fade'
    });
});