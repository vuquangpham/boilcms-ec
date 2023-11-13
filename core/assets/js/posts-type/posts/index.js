import PageBuilder from "../../components/page-builder";

document.querySelectorAll('[data-pb]').forEach(e => {
    window.instance = new PageBuilder(e);
});