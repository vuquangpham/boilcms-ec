import OrderPost from "./OrderPost";

document.querySelectorAll('[data-order-wrapper]').forEach(wrapper => new OrderPost(wrapper))