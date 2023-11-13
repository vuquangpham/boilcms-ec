import ProductPost from "./ProductPost";

document.querySelectorAll('[data-product-wrapper]').forEach(wrapper => new ProductPost(wrapper))