const API_URI = `/api`;
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("user");

if(!username) {
    document.body.innerHTML = "<h2>User not specified</h2>";
} else {
    fetchUserProfile(username);
}

async function fetchUserProfile() {
    try {
        const userId = new URLSearchParams(window.location.search).get("id");
        const res = await fetch(`${API_URI}/users/${userId}`);
        if (!res.ok) throw new Error("User not found");
        const user = await res.json();
        document.getElementById("profile-name").textContent = user.name;
        document.getElementById("profile-bio").textContent = user.bio || "This user has no bio.";
        document.getElementById("profile-date").textContent = `Joined: ${new Date(user.createdAt).toDateString()}`;

        const DEFAULT_PROFILE_PHOTO = "https://i.postimg.cc/KvF0rh0Q/custom-default-avatar.png";
        const photoUrl = user.profilePhoto?.trim() || DEFAULT_PROFILE_PHOTO;
        document.getElementById("profile-photo").src = photoUrl;

        document.getElementById("user-name-label").textContent = user.name;

        // Fetch and display user's posts
        const postsRes = await fetch(`${API_URI}/posts?authorId=${user._id}&limit=1000`);
        if (!postsRes.ok) throw new Error("Failed to fetch user's posts");
        const { posts } = await postsRes.json();
        const postsList = document.getElementById("posts-list");
        postsList.innerHTML = posts.length ? posts.map(p => `
            <div class="post-card" data-slug="${p.slug}">
                <h3>${p.title}</h3>
                <p>${p.content.substring(0, 120) + "..."}</p>
            </div>
            `).join('') : "<p class='no-posts'>No posts available.</p>";

            const postCard = document.querySelectorAll(".post-card");
            postCard.forEach(card => {
                card.addEventListener("click", () => {
                    const slug = card.dataset.slug;
                    window.location.href = `post.html?slug=${slug}`;
                });
            });
    } catch (error) {
        document.body.innerHTML = `<p>${error.message}</p>`;
    }
};