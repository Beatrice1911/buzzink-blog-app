const API_URI = "http://localhost:5000/api";

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("user");

if(!username) {
    document.body.innerHTML = "<h2>User not specified</h2>";
} else {
    fetchUserProfile(username);
}

async function fetchUserProfile(name) {
    try {
        const res = await fetch(`${API_URI}/users/${username}`);
        if (!res.ok) throw new Error("User not found");
        const user = await res.json();
        document.getElementById("profile-name").textContent = user.name;
        document.getElementById("profile-bio").textContent = user.bio || "This user has no bio.";
        document.getElementById("profile-date").textContent = `Joined: ${new Date(user.createdAt).toDateString()}`;

        const photoUrl = user.profilePhoto
            ? (user.profilePhoto.startsWith("http") ? user.profilePhoto : `http://localhost:5000${user.profilePhoto}`)
            : "https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png";
        document.getElementById("profile-photo").src = photoUrl;

        document.getElementById("user-name-label").textContent = user.name;

        // Fetch and display user's posts
        const postsRes = await fetch(`${API_URI}/posts?authorId=${user._id}`);
        if (!postsRes.ok) throw new Error("Failed to fetch user's posts");
        const posts = await postsRes.json();
        const postsList = document.getElementById("posts-list");
        postsList.innerHTML = posts.length ? posts.map(p => `
            <div class="post-card">
                <h3>${p.title}</h3>
                <p>${p.content.substring(0, 120) + "..."}</p>
            </div>
            `).join('') : "<p class='no-posts'>No posts available.</p>";
    } catch (error) {
        document.body.innerHTML = `<p>${error.message}</p>`;
    }
};