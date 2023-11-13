import MediaPost from "./MediaPost";

// media posts
document.querySelectorAll('[data-media-wrapper]').forEach(wrapper => new MediaPost(wrapper));