import PageBuilder from "../../components/page-builder";

document.querySelectorAll('[data-pb]').forEach(e => {
    // init page builder
    window.instance = new PageBuilder(e);
});

// int agree
document.querySelectorAll('[data-remove-post]').forEach(e => {

    Agree.create({
        target: e,
        messageHTML: 'Do you want to delete this post?'
    });
    console.log(e);
});