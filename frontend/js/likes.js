import { apiFetch } from "./api.js";
import { showToast } from "./ui.js";

export async function handleLike(btn) {
  const slug = btn.dataset.slug;
  const heart = btn.querySelector("i");
  const countEl = btn.querySelector(".like-count");
  const likedByEl = btn
    .closest(".post-interactions-container")
    ?.querySelector(".liked-by");

  if (!window.currentUser) {
    showToast("Please log in to like or unlike posts.", "error");
    return;
  }

  const alreadyLiked = btn.classList.contains("liked");

  try {
    const res = await apiFetch(
      `/api/posts/${slug}/${alreadyLiked ? "unlike" : "like"}`,
      { method: "POST" },
    );

    const data = await res.json();

    if (res.ok) {
      btn.classList.toggle("liked", !alreadyLiked);
      heart.className = !alreadyLiked
        ? "fa-solid fa-heart"
        : "fa-regular fa-heart";

      const likesCount = data.likesCount ?? data.likes ?? 0;
      countEl.textContent = likesCount;

      if (likedByEl) {
        if (!likesCount) {
          likedByEl.textContent = "No likes yet";
          likedByEl.classList.add("disabled");
        } else {
          likedByEl.textContent =
            likesCount === 1 ? "1 like" : `${likesCount} likes`;
          likedByEl.classList.remove("disabled");
        }

        if (Array.isArray(data.likedBy)) {
          likedByEl.dataset.slug = slug;
          likedByEl.dataset.likedBy = JSON.stringify(data.likedBy);
        }
      }
    } else {
      showToast(`Failed to update likes: ${data.message}`, "error");
    }
  } catch (err) {
    console.error("Like action failed:", err);
    showToast("Error updating like. Please try again.", "error");
  }
}
