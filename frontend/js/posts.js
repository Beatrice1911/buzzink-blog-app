import { apiFetch } from "./api.js";
import { API_URL } from "./config.js";
import { showToast } from "./ui.js";
import { fetchComments, updateCommentCount } from "./comments.js";

const search = document.querySelectorAll(".search");

let state = {
  all: [],
  mine: [],
  saved: [],
};
let totalPages = 1;
export let currentPage = Number(sessionStorage.getItem("postsPage")) || 1;
export let currentCategory = sessionStorage.getItem("postsCategory") || "";
export let currentSearch = sessionStorage.getItem("postsSearch") || "";

function getImageUrl(image) {
  return image && image.startsWith("http") ? image : "/Images/fallback.jpg";
}

function renderNoAuthorPost(container) {
  container.innerHTML = `<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`;
}

export async function fetchPosts(page = 1, limit = 6) {
  try {
    const categoryFilter = document.getElementById("categoryFilter")?.value;
    const searchInputs = document.querySelectorAll(".search");

    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    if (categoryFilter && categoryFilter !== "all")
      queryParams.append("category", categoryFilter);

    searchInputs.forEach((input) => {
      if (input) {
        const searchValue = input.value.trim();
        if (searchValue) queryParams.append("search", searchValue);
      }
    });

    const res = await apiFetch(`${API_URL}?${queryParams.toString()}`);
    const data = await res.json();

    state.all = Array.isArray(data.posts) ? data.posts : [];
    currentPage = data.currentPage ?? 1;
    totalPages = data.totalPages ?? 1;

    if (typeof currentPage !== "undefined") {
      sessionStorage.setItem("postsPage", currentPage);
    }
    sessionStorage.setItem(
      "postsCategory",
      categoryFilter && categoryFilter !== "all" ? categoryFilter : "",
    );
    const activeSearch =
      [...searchInputs].find((i) => i.value.trim())?.value.trim() || "";
    sessionStorage.setItem("postsSearch", activeSearch);

    displayPosts("allPostsContainer");
    renderPagination("allPostsContainer", currentPage, totalPages);
  } catch (err) {
    console.error("Error fetching posts:", err);
    showToast("Something went wrong while displaying posts!", "error");
  }
}

// Fetch posts created by the logged-in user
export async function fetchMyPosts(page = 1, limit = 6) {
  try {
    const searchInputs = document.querySelectorAll(".search");
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    searchInputs.forEach((input) => {
      if (input) {
        const searchValue = input.value.trim();
        if (searchValue) queryParams.append("search", searchValue);
      }
    });

    const res = await apiFetch(`${API_URL}/mine?${queryParams.toString()}`);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to fetch your posts");
    }

    const data = await res.json();

    state.mine = Array.isArray(data.posts) ? data.posts : [];
    currentPage = data.currentPage || 1;
    totalPages = data.totalPages || 1;

    sessionStorage.setItem("postsPage", currentPage);
    const activeSearch =
      [...searchInputs].find((i) => i.value.trim())?.value.trim() || "";
    sessionStorage.setItem("postsSearch", activeSearch);

    const containerId = "myPostsContainer";
    displayPosts("myPostsContainer", null, "You haven't made any posts yet...");
    renderPagination(containerId, currentPage, totalPages);
    if (state.mine.length === 0) {
      const container = document.getElementById("myPostsContainer");
      if (container) renderNoAuthorPost(container);
    }
  } catch (err) {
    console.error("Error fetching my posts:", err);
    showToast("Failed to load your posts!", "error");
  }
}

export function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return rtf.format(-count, interval.label);
    }
  }

  return "Just now";
}

export function formatText(text) {
  return text.replace(/\n/g, "<br>");
}

// Display posts in specified container
export function displayPosts(containerId, limit = null, emptyMessage = null) {
  const userId = window.currentUser?._id || window.currentUser?.id;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  let displayList = [];

  if (
    containerId === "allPostsContainer" ||
    containerId === "featuredPostsContainer"
  ) {
    displayList = [...state.all];
  } else if (containerId === "myPostsContainer") {
    displayList = [...state.mine];
  } else if (containerId === "savedPostsContainer") {
    displayList = [...state.saved];
  }

  if (limit) displayList = displayList.slice(0, limit);

  if (displayList.length === 0) {
    container.innerHTML =
      emptyMessage ??
      `<p style="text-align:center; color:gray; font-size:20px;">No results found...</p>`;
    return;
  }

  displayList.forEach((post) => {
    const div = document.createElement("div");
    div.classList.add("post");

    const preview =
      post.content.length > 150
        ? post.content.substring(0, 150) + "..."
        : post.content;

    const postAuthorId =
      typeof post.authorId === "object" && post.authorId !== null
        ? post.authorId._id
        : post.authorId;

    const authorName =
      typeof post.authorId === "object" && post.authorId !== null
        ? post.authorId.name
        : post.authorName || "Unknown";

    const isAuthor = userId && String(postAuthorId) === String(userId);

    div.innerHTML = `
      ${
        post.image
          ? `<a href="post.html?slug=${post.slug}">
             <img src="${getImageUrl(post.image)}" alt="${post.title}" class="post-image" loading="lazy">
           </a>`
          : ""
      }
        <p class="tag">${post.category}</p>
        <h2>
          <a href="post.html?slug=${post.slug}" class="post-link">${post.title}</a>
        </h2>
        <p>${preview} <a href="post.html?slug=${post.slug}" class="read-more">Read more</a></p>
        <a href="profile.html?id=${postAuthorId}" class="author"><em>By ${authorName}</em></a>
        <small title="${new Date(post.date).toLocaleString()}">
          ${timeAgo(post.date)}
        </small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${post.likedByUser ? "liked" : ""}" data-slug="${post.slug}">
              <i class="${post.likedByUser ? "fa-solid" : "fa-regular"} fa-heart"></i>
              <span class="like-count">${post.likesCount || 0}</span>
            </button>
            <button class="comment-btn" data-slug="${post.slug}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${post.commentsCount || 0}</span>
            </button>
            <button class="share-btn" data-slug="${post.slug}">
              <i class="fa-solid fa-share"></i>
              <span class="share-count">${post.shares}</span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div id="likesModal-${post.slug}" class="likes-modal hidden slide-up">
          <div class="likes-modal-content">
            <span id="closeLikesModal-${post.slug}" class="close-btn">&times;</span>
            <h3>Liked by</h3>
            <ul id="likesList-${post.slug}" class="likes-list"></ul>            
          </div>
        </div>
        <div class="comments-section">
          <form class="comment-form">
            <input type="text" class="comment-input" placeholder="Write a comment..." required />
            <button type="submit">Comment</button>
          </form>
          <div class="comments-list"></div>
        </div>
        ${
          isAuthor
            ? `
        <div class="post-actions">
            <button class="edit-btn btn" data-slug="${post.slug}">Edit</button>
            <button class="delete-btn btn" data-slug="${post.slug}">Delete</button>
        </div>
        `
            : ""
        }
    `;
    container.appendChild(div);

    const img = div.querySelector(".post-image");
    if (img) {
      img.onerror = function () {
        this.onerror = null;
        this.src = "/Images/fallback.jpg";
      };
    }

    const likeBtn = div.querySelector(".like-btn");
    const heart = likeBtn.querySelector("i");
    const likedByEl = div.querySelector(".liked-by");

    likedByEl.dataset.slug = post.slug;
    likedByEl.dataset.likedBy = JSON.stringify(post.likedBy || []);

    if (post.likedBy && post.likedBy.length > 0) {
      likedByEl.classList.remove("disabled");
    } else {
      likedByEl.classList.add("disabled");
    }

    const likedByIds = Array.isArray(post.likes)
      ? post.likes.map((l) => (typeof l === "object" ? l._id : l))
      : [];

    if (userId && (likedByIds.includes(userId) || post.likedByUser)) {
      likeBtn.classList.add("liked");
      heart.className = "fa-solid fa-heart";
    } else {
      likeBtn.classList.remove("liked");
      heart.className = "fa-regular fa-heart";
    }

    if (!post.likedBy || post.likedBy.length === 0) {
      likedByEl.textContent = "No likes yet";
    } else if (post.likedBy.length === 1) {
      likedByEl.textContent = `Liked by ${post.likedBy[0]}`;
    } else {
      likedByEl.textContent = `Liked by ${post.likedBy[0]} and ${post.likedBy.length - 1} others`;
    }

    const commentCountSpan = div.querySelector(".comment-count");
    updateCommentCount(post.slug, commentCountSpan);
  });   
}

// Add a new post
export async function addPost(title, content, category, imageFile) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("category", category);
  if (imageFile) formData.append("image", imageFile);

  const res = await apiFetch(`${API_URL}`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to add post");
  return await res.json();
}

// Delete a post
export async function deletePost(slug) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await apiFetch(`${API_URL}/${slug}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to delete post");
    }

    showToast("Post deleted successfully!", "success");
    if (window.location.pathname.endsWith("my-posts.html")) {
      fetchMyPosts(currentPage);
    } else {
      fetchPosts(currentPage);
    }
  } catch (err) {
    console.error("Error deleting post:", err);
    showToast("Failed to delete post!", "error");
  }
}

export function editPost(slug) {
  if (!slug) return;
  localStorage.setItem("editSlug", slug);
  window.location.href = "write.html";
}

export function initPostForm() {
  const postForm = document.getElementById("postForm");
  const addPostBtn = document.querySelector(".add-post-btn");

  if (!postForm) return;

  const editSlug = localStorage.getItem("editSlug");

  const setPostingState = (isPosting) => {
    addPostBtn.disabled = isPosting;
    addPostBtn.innerHTML = isPosting
      ? `<i class="fa-solid fa-spinner fa-spin"></i> Posting...`
      : editSlug
        ? "Update Post"
        : "Add Post";
  };

  if (editSlug && editSlug !== "null") {
    (async () => {
      try {
        const res = await apiFetch(`${API_URL}/${editSlug}`);
        if (!res.ok) throw new Error("Post not found");
        const post = await res.json();

        document.getElementById("title").value = post.title || "";
        document.getElementById("content").value = post.content || "";
        document.getElementById("category").value = post.category || "";

        if (post.image) {
          const imgPreview = document.getElementById("imagePreview");
          imgPreview.src = post.image;
          imgPreview.style.display = "block";
        }
      } catch (err) {
        console.error("Error loading post:", err);
      }
    })();

    postForm.onsubmit = async function (e) {
      e.preventDefault();

      const formData = new FormData();
      formData.append("title", document.getElementById("title").value);
      formData.append("content", document.getElementById("content").value);
      formData.append("category", document.getElementById("category").value);

      const imageFile = document.getElementById("image").files[0];
      if (imageFile) {
        formData.append("image", imageFile);
      }

      try {
        setPostingState(true);
        const res = await apiFetch(`${API_URL}/${editSlug}`, {
          method: "PUT",
          body: formData,
        });

        if (res.ok) {
          showToast("Post updated successfully!", "success");
          localStorage.removeItem("editSlug");
          window.location.href = "all-posts.html";
        } else {
          console.error("Update failed:", await res.text());
        }
      } catch (err) {
        console.error("Error updating post:", err);
        showToast("Failed to update post!", "error");
      } finally {
        setPostingState(false);
      }
    };
  } else {
    localStorage.removeItem("editSlug");
    postForm?.addEventListener("submit", async function (e) {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;
      const category = document.getElementById("category").value;
      const imageFile = document.getElementById("image").files[0];

      console.log("Submitting new post:", {
        title,
        content,
        category,
        imageFile,
      });

      try {
        setPostingState(true);
        const newPost = await addPost(title, content, category, imageFile);
        console.log("Post created successfully!", newPost);
        showToast("Post created successfully!", "success");
        postForm.reset();
        window.location.href = "all-posts.html";
        localStorage.removeItem("editSlug");
      } catch (err) {
        console.error("Error adding post:", err);
        showToast("Failed to add post!", "error");
      } finally {
        setPostingState(false);
      }
    });
  }
}

export async function loadSinglePost() {
  const params = new URLSearchParams(window.location.search);
  const postSlug = params.get("slug");

  if (postSlug) {
    apiFetch(`/api/posts/${postSlug}/view`, {
      method: "POST",
    }).catch((err) => {
      console.error("Failed to increment view", err);
    });
  }

  if (!postSlug) return;

  try {
    const res = await apiFetch(`${API_URL}/${postSlug}`);
    if (!res.ok) throw new Error("Failed to fetch post");
    const post = await res.json();

    const userId = window.currentUser?._id || window.currentUser?.id;

    const postAuthorId =
      typeof post.authorId === "object" && post.authorId !== null
        ? post.authorId._id
        : post.authorId;

    const authorName =
      typeof post.authorId === "object" && post.authorId !== null
        ? post.authorId.name
        : post.authorName || "Unknown";

    const isAuthor = userId && String(postAuthorId) === String(userId);

    const container = document.getElementById("singlePostContainer");

    container.innerHTML = `
      ${post.image ? `<img src="${getImageUrl(post.image)}" alt="${post.title}" class="post-image" loading="lazy">` : ""}
      <h1>${post.title}</h1>
      <p class="tag">${post.category}</p>
      <p onclick="window.location.href='profile.html?id=${postAuthorId}'" style="cursor: pointer;" class="author"><em>By ${authorName}</em></p>
      <small title="${new Date(post.date).toLocaleString()}">
        ${timeAgo(post.date)}
      </small>
      <div class="content">
        <p>${formatText(post.content)}</p>
      </div>
      <div class="post-interactions-container">
        <div class="post-interactions">
          <button class="like-btn ${post.likedByUser ? "liked" : ""}" data-slug="${post.slug}">
            <i class="${post.likedByUser ? "fa-solid" : "fa-regular"} fa-heart"></i>
            <span class="like-count">${post.likesCount || 0}</span>
          </button>
          <button class="comment-btn" data-slug="${post.slug}">
            <i class="fa-regular fa-comment"></i>
            <span class="comment-count">${post.commentsCount || 0}</span>
          </button>
          <button class="share-btn" data-slug="${post.slug}">
            <i class="fa-solid fa-share"></i>
            <span class="share-count">${post.shares}</span>
          </button>
          <span class="bookmark ${post.savedByUser ? "saved" : ""}" data-saved="${post.savedByUser ? "true" : "false"}" data-slug="${post.slug}">
            <i class="${post.savedByUser ? "fa-solid" : "fa-regular"} fa-bookmark"></i>
          </span>
        </div>
        <span class="liked-by likes-info">No likes yet</span>
      </div>
      <div id="likesModal-${post.slug}" class="likes-modal hidden slide-up">
        <div class="likes-modal-content">
          <span id="closeLikesModal-${post.slug}" class="close-btn">&times;</span>
          <h3>Liked by</h3>
          <ul id="likesList-${post.slug}" class="likes-list"></ul>            
        </div>
      </div>
      <div class="comments-section show">
        <form class="comment-form">
          <input type="text" class="comment-input" placeholder="Write a comment..." required />
          <button type="submit">Comment</button>
        </form>
        <div class="comments-list"></div>
      </div>
      ${
        isAuthor
          ? `
      <div class="post-actions">
        <button class="edit-btn btn" data-slug="${post.slug}">Edit</button>
        <button class="delete-btn btn" data-slug="${post.slug}">Delete</button>
      </div>`
          : ""
      }
    `;

    const img = container.querySelector(".post-image");
    if (img) {
      img.onerror = function () {
        this.onerror = null;
        this.src = "/Images/fallback.jpg";
      };
    }

    const likeBtn = container?.querySelector(".like-btn");
    const heart = likeBtn?.querySelector("i");
    const likedByEl = container?.querySelector(".liked-by");

    likedByEl.dataset.slug = post.slug;
    likedByEl.dataset.likedBy = JSON.stringify(post.likedBy || []);

    if (post.likedBy && post.likedBy.length > 0) {
      likedByEl.classList.remove("disabled");
    } else {
      likedByEl.classList.add("disabled");
    }

    const likedByIds = Array.isArray(post.likes)
      ? post.likes.map((l) => (typeof l === "object" ? l._id : l))
      : [];

    if (userId && (likedByIds.includes(userId) || post.likedByUser)) {
      likeBtn.classList.add("liked");
      heart.className = "fa-solid fa-heart";
    } else {
      likeBtn.classList.remove("liked");
      heart.className = "fa-regular fa-heart";
    }

    if (!post.likedBy || post.likedBy.length === 0) {
      likedByEl.textContent = "No likes yet";
    } else if (post.likedBy.length === 1) {
      likedByEl.textContent = `Liked by ${post.likedBy[0]}`;
    } else {
      likedByEl.textContent = `Liked by ${post.likedBy[0]} and ${post.likedBy.length - 1} others`;
    }

    const commentCountSpan = container.querySelector(".comment-count");
    updateCommentCount(post.slug, commentCountSpan);

    const commentsSection = document.querySelector(".comments-section");
    const commentsList = commentsSection.querySelector(".comments-list");

    if (commentsSection && commentsList) {
      await fetchComments(post.slug, commentsList, Infinity);
    }

    const bookmarkIcon = container.querySelector(".bookmark");

    function setBookmarkState(isSaved) {
      bookmarkIcon.dataset.saved = isSaved ? "true" : "false";
      bookmarkIcon.classList.toggle("saved", isSaved);
      const icon = bookmarkIcon.querySelector("i");
      icon.classList.toggle("fa-solid", isSaved);
      icon.classList.toggle("fa-regular", !isSaved);
    }

    bookmarkIcon?.addEventListener("click", async () => {
      const slug = bookmarkIcon.dataset.slug;
      const isSaved = bookmarkIcon.dataset.saved === "true";

      if (!window.currentUser) {
        showToast("Please log in to save posts");
        return;
      }

      bookmarkIcon.classList.add("clicked");
      setTimeout(() => bookmarkIcon.classList.remove("clicked"), 200);

      const url = isSaved
        ? `/api/posts/${slug}/unsave`
        : `/api/posts/${slug}/save`;

      try {
        const res = await apiFetch(url, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to toggle bookmark");
        setBookmarkState(!isSaved);
        showToast(
          !isSaved ? "Post saved" : "Removed from saved posts",
          "success",
        );
      } catch (err) {
        console.error("Failed to toggle bookmark", err);
        showToast("Something went wrong", "error");
      }
    });
  } catch (err) {
    console.error(err);
    document.getElementById("singlePostContainer").innerHTML =
      "<p>Error loading post.</p>";
  }

  fetchRelatedPosts(postSlug);
}

export const fetchTrendingPosts = async () => {
  const res = await apiFetch(`${API_URL}/trending?limit=5`);
  const data = await res.json();

  const trendingList = document.getElementById("trending-list");
  trendingList.innerHTML = data
    .map((post, index) => {
      const rankIcons = ["🥇", "🥈", "🥉"];
      const rankDisplay = rankIcons[index] || `#${index + 1}`;
      return `
    <li>
      <span class="trending-rank">${rankDisplay}</span>
      <a href="post.html?slug=${post.slug}" class="trending-title">${post.title}</a>
      <i class="fa-solid fa-bolt trending-icon" title="Trending now"></i>
    </li>
  `;
    })
    .join("");
};

function renderRelatedPosts(posts) {
  const container = document.getElementById("related-posts-container");
  if (!posts.length) {
    container.innerHTML =
      "<p style='margin: 0 5px;'>No related posts found.</p>";
    return;
  }

  container.innerHTML = posts
    .map(
      (post) => `
      <article class="related-post-card">
        <h4><a href="post.html?slug=${post.slug}">${post.title}</a></h4>
        <small>${post.category}</small>
      </article>
    `,
    )
    .join("");
}

export const fetchRelatedPosts = async (slug) => {
  try {
    const res = await apiFetch(`${API_URL}/slug/${slug}/related`);
    const relatedPosts = await res.json();

    renderRelatedPosts(relatedPosts);
  } catch (err) {
    console.error("Failed to fetch related posts.", err);
  }
};

const savedPostsContainer = document.getElementById("savedPostsContainer");

export async function loadSavedPosts(page = 1, limit = 6) {
  try {
    const searchInputs = document.querySelectorAll(".search");
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    searchInputs.forEach((input) => {
      if (input) {
        const searchValue = input.value.trim();
        if (searchValue) queryParams.append("search", searchValue);
      }
    });

    const res = await apiFetch(`${API_URL}/saved/me?${queryParams.toString()}`);

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();

    state.saved = Array.isArray(data.posts) ? data.posts : [];
    currentPage = data.currentPage || 1;
    totalPages = data.totalPages || 1;

    sessionStorage.setItem("postsPage", currentPage);

    const container = savedPostsContainer;
    if (!container) return;

    if (state.saved.length === 0) {
      container.innerHTML = "<p>You have no saved posts yet.</p>";
      return;
    }

    container.innerHTML = state.saved
      .map(
        (post) => `
      <article class="post-card">
        ${
          post.image
            ? `
          <img 
            src="${getImageUrl(post.image)}" 
            alt="${post.title}" 
            class="post-image"
            loading="lazy"
            onclick="window.location.href='post.html?slug=${post.slug}'"
          >
        `
            : ""
        }
        <div class="post-body" onclick="window.location.href='post.html?slug=${post.slug}'">
          <h2>${post.title}</h2>
          <p class="tag">${post.category}</p>
          <p class="excerpt">
            ${post.content.slice(0, 150)}...
          </p>
          <div class="post-meta">
            <small>By ${post.authorId?.name || "Unknown"}</small>
            <small title="${new Date(post.date).toLocaleString()}">${timeAgo(post.date)}</small>
          </div>
        </div>
        <button 
          class="bookmark saved"
          data-slug="${post.slug}"
          title="Remove from saved"
        >
          <i class="fa-solid fa-bookmark"></i>
        </button>
      </article>
    `,
      )
      .join("");

    document.querySelectorAll(".bookmark").forEach((btn) => {
      btn?.addEventListener("click", async (e) => {
        e.stopPropagation();

        const slug = btn.dataset.slug;

        try {
          await apiFetch(`${API_URL}/${slug}/unsave`, {
            method: "POST",
          });

          btn.closest(".post-card").remove();
          showToast("Removed from saved posts", "success");
        } catch (err) {
          console.error(err);
          showToast("Failed to remove", "error");
        }
      });
    });

    renderPagination("savedPostsContainer", currentPage, totalPages);
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading saved posts.</p>";
  }
}

export function refreshPage() {
  if (document.getElementById("allPostsContainer")) {
    displayPosts("allPostsContainer");
  }
  if (document.getElementById("featuredPostsContainer")) {
    displayPosts("featuredPostsContainer", 3);
  }
  if (document.getElementById("myPostsContainer")) {
    displayPosts("myPostsContainer", null, "You haven't made any posts yet...");
  }
}

document
  .getElementById("categoryFilter")
  ?.addEventListener("change", () => fetchPosts(1));

search.forEach((input) =>
  input?.addEventListener("keyup", () => fetchPosts(1)),
);

function renderPagination(containerId, page, total) {
  const container = document.getElementById("pagination");
  if (!container) return;
  container.innerHTML = "";

  for (let i = 1; i <= total; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === page ? "pg-active" : "";
    btn?.addEventListener("click", () => {
      if (containerId === "myPostsContainer") {
        fetchMyPosts(i);
      } else if (containerId === "savedPostsContainer") {
        loadSavedPosts(i);
      } else {
        fetchPosts(i);
      }
    });
    container.appendChild(btn);
  }
}
