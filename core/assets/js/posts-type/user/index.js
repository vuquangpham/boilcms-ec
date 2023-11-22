import EditUser from "./EditUser"

// handle edit user
document.querySelectorAll('[data-edit-user-wrapper]').forEach(wrapper => new EditUser(wrapper))