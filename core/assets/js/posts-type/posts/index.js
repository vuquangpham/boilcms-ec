import PageBuilder from "../../components/page-builder";

document.querySelectorAll('[data-pb]').forEach(e => {
    // init page builder
    window.instance = new PageBuilder(e);
});

// int agree
document.querySelectorAll('[data-remove-post]').forEach(e => {
    // create the Agree.js popup
    Agree.create({
        target: e,
        messageHTML: 'Do you want to delete this post?',
        confirmButtonHTML: '<button class="btn_primary">Confirm</button>',
        cancelButtonHTML: '<button class="btn_primary error">Cancel</button>'
    });
});