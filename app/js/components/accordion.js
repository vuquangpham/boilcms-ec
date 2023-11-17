document.querySelectorAll('.accordion').forEach(wrapper => {
    Accordion.create({
        target: wrapper,
        allowExpandAll: false
    });
});