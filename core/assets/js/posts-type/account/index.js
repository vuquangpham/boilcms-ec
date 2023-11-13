import AccountPost from "./AccountPost";

document.querySelectorAll('[data-account-wrapper]').forEach(wrapper => new AccountPost(wrapper))
