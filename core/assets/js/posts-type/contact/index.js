import ContactPost from "./ContactPost";

document.querySelectorAll('[data-contact-wrapper]').forEach(wrapper => new ContactPost(wrapper))