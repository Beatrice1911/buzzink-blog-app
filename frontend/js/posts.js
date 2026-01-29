import { apiFetch } from "./api.js";
import { API_URL } from "./config.js";
import { showToast } from "./ui.js";
import { updateCommentCount } from "./comments.js";

const search = document.querySelectorAll(".search");

export let posts = [];
export let currentPage = 1;
export let totalPages = 1;

function getImageUrl(image) {
  if (!image) return "/Images/fallback.jpg";

  if (image.startsWith("http")) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    return "/Images/fallback.jpg";
  }

  return "/Images/fallback.jpg";
}

function renderNoResults(container) {
  container.innerHTML = `<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">No results found...</p>`;
}

function renderNoAuthorPost(container) {
  container.innerHTML = `<p style="text-align:center; color:gray; font-size: 20px; font-weight: bold;">You haven't made any posts yet...</p>`;
}

export async function fetchPosts(page = 1, limit = 6) {
  try {
    const res = await apiFetch(`${API_URL}?page=${page}&limit=${limit}`, {
      credentials: "include",
    });
    const data = await res.json();

    posts = Array.isArray(data.posts) ? data.posts : [];
    currentPage = data.currentPage ?? 1;
    totalPages = data.totalPages ?? 1;

    refreshPage();
    renderPagination();
  } catch (err) {
    console.error("Error fetching posts:", err);
    showToast("Something went wrong while displaying posts!", "error");
  }
}

// Fetch posts created by the logged-in user
export async function fetchMyPosts(page = 1, limit = 6) {
  try {
    const res = await apiFetch(`${API_URL}/mine?page=${page}&limit=${limit}`, {
      credentials: "include",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to fetch your posts");
    }

    const data = await res.json();

    posts = Array.isArray(data.posts) ? data.posts : [];
    currentPage = data.currentPage || 1;
    totalPages = data.totalPages || 1;

    const containerId = "myPostsContainer";
    displayPosts(containerId);
    renderPagination();
    if (posts.length === 0) {
      const container = document.getElementById("myPostsContainer");
      if (container) renderNoAuthorPost(container);
    }
  } catch (err) {
    console.error("Error fetching my posts:", err);
    showToast("Failed to load your posts!", "error");
  }
}

function formatText(text) {
  return text.replace(/\n/g, "<br>");
}

// Display posts in specified container
export function displayPosts(containerId, limit = null) {
  const userId = window.currentUser?._id || window.currentUser?.id;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  let displayList = [...posts];

  if (containerId === "allPostsContainer") {
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) {
      const selectedCategory = categoryFilter?.value;
      if (selectedCategory !== "all") {
        displayList = displayList.filter(
          (post) => post.category === selectedCategory,
        );
      }
    }
  }

  if (containerId === "myPostsContainer" && userId) {
    displayList = displayList.filter((post) => {
      const postAuthorId =
        typeof post.authorId === "object" && post.authorId !== null
          ? post.authorId._id
          : post.authorId;

      return String(postAuthorId) === String(userId);
    });
  }

  if (limit) displayList = displayList.slice(0, limit);

  if (displayList.length === 0) {
    renderNoResults(container);
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
        <small>${new Date(post.date).toLocaleString()}</small>
        <br>
        <div class="post-interactions-container">
          <div class="post-interactions">
            <button class="like-btn ${post.likedByUser ? "liked" : ""}" data-post-id="${post._id}">
              <i class="${post.likedByUser ? "fa-solid" : "fa-regular"} fa-heart"></i>
              <span class="like-count">${post.likesCount || 0}</span>
            </button>
            <button class="comment-btn" data-post-id="${post._id}">
              <i class="fa-regular fa-comment"></i>
              <span class="comment-count">${post.commentsCount || 0}</span>
            </button>
            <button class="share-btn">
              <i class="fa-solid fa-share"></i>
              <span class="share-count"></span>
            </button>
          </div>
          <span class="liked-by likes-info">No likes yet</span>
        </div>
        <div id="likesModal-${post._id}" class="likes-modal hidden slide-up">
          <div class="likes-modal-content">
            <span id="closeLikesModal-${post._id}" class="close-btn">&times;</span>
            <h3>Liked by</h3>
            <ul id="likesList-${post._id}" class="likes-list"></ul>            
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

    likedByEl.dataset.postId = post._id;
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

    updateCommentCount(post._id, commentCountSpan);
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
    credentials: "include",
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
      credentials: "include",
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

if (
  window.location.pathname.endsWith("write.html") &&
  !localStorage.getItem("editSlug")
) {
  localStorage.removeItem("editSlug");
}

export function editPost(slug) {
  localStorage.removeItem("editSlug");
  localStorage.setItem("editSlug", slug);
  window.location.href = "write.html";
}

export function initPostForm() {
  const addPostBtn = document.querySelector(".add-post-btn");

  const setPostingState = (isPosting) => {
    if (isPosting) {
      addPostBtn.disabled = true;
      addPostBtn.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i> Posting...
    `;
    } else {
      addPostBtn.disabled = false;
      addPostBtn.innerHTML = "Add Post";
    }
  };
  const postForm = document.getElementById("postForm");
  if (postForm) {
    const editSlug = localStorage.getItem("editSlug");

    if (editSlug && editSlug !== "null") {
      (async () => {
        try {
          const res = await apiFetch(`${API_URL}/${editSlug}`, {
            credentials: "include",
          });
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
            credentials: "include",
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
}

function injectPostJsonLd(post) {
  const oldScript = document.getElementById("post-jsonld");
  if (oldScript) oldScript.remove();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.content.slice(0, 160),
    image: post.image ? [post.image] : [],
    author: {
      "@type": "Person",
      name: post.authorName || "BuzzInk Contributor",
    },
    publisher: {
      "@type": "Organization",
      name: "BuzzInk",
      logo: {
        "@type": "ImageObject",
        url: "https://buzzink.onrender.com/Images/logo_optimized.png",
      },
    },
    datePublished: post.createdAt || post.date,
    dateModified: post.updatedAt || post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": window.location.href,
    },
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "post-jsonld";
  script.textContent = JSON.stringify(jsonLd);

  document.head.appendChild(script);
}

export async function loadSinglePost() {
  const params = new URLSearchParams(window.location.search);
  const postSlug = params.get("slug");

  if (!postSlug) return;

  try {
    const res = await apiFetch(`${API_URL}/${postSlug}`, {
      credentials: "include",
    });
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
      <small>${new Date(post.date).toLocaleString()}</small>
      <div class="content">
        <p>${formatText(post.content)}</p>
      </div>
      <div class="post-interactions-container">
        <div class="post-interactions">
          <button class="like-btn ${post.likedByUser ? "liked" : ""}" data-post-id="${post._id}">
            <i class="${post.likedByUser ? "fa-solid" : "fa-regular"} fa-heart"></i>
            <span class="like-count">${post.likesCount || 0}</span>
          </button>
          <button class="comment-btn" data-post-id="${post._id}">
            <i class="fa-regular fa-comment"></i>
            <span class="comment-count">${post.commentsCount || 0}</span>
          </button>
          <button class="share-btn">
            <i class="fa-solid fa-share"></i>
            <span class="share-count"></span>
          </button>
          <span class="bookmark ${post.savedByUser ? "saved" : ""}" data-saved="${post.savedByUser ? "true" : "false"}" data-slug="${post.slug}">
            <i class="${post.savedByUser ? "fa-solid" : "fa-regular"} fa-bookmark"></i>
          </span>
        </div>
        <span class="liked-by likes-info">No likes yet</span>
      </div>
      <div id="likesModal-${post._id}" class="likes-modal hidden slide-up">
        <div class="likes-modal-content">
          <span id="closeLikesModal-${post._id}" class="close-btn">&times;</span>
          <h3>Liked by</h3>
          <ul id="likesList-${post._id}" class="likes-list"></ul>            
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

    likedByEl.dataset.postId = post._id;
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
    updateCommentCount(post._id, commentCountSpan);

    const commentsSection = document.querySelector(".comments-section");
    const commentsList = commentsSection.querySelector(".comments-list");

    if (commentsSection && commentsList) {
      await fetchComments(post._id, commentsList, Infinity);
    }

    const bookmarkIcon = container.querySelector(".bookmark");

    function setBookmarkState(isSaved) {
      bookmarkIcon.dataset.saved = isSaved ? "true" : "false";
      bookmarkIcon.classList.toggle("saved", isSaved);
      const icon = bookmarkIcon.querySelector("i");
      icon.classList.toggle("fa-solid", isSaved);
      icon.classList.toggle("fa-regular", !isSaved);
    }

    bookmarkIcon.addEventListener("click", async () => {
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
          credentials: "include",
        });
        const data = await res.json();
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

    injectPostJsonLd(post);
  } catch (err) {
    console.error(err);
    document.getElementById("singlePostContainer").innerHTML =
      "<p>Error loading post.</p>";
  }

  fetchRelatedPosts(postSlug);
}

export const fetchTrendingPosts = async () => {
  const res = await apiFetch(`${API_URL}/trending?limit=5`, {
    credentials: "include",
  });
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
    container.innerHTML = "<p>No related posts found.</p>";
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
    const res = await apiFetch(`${API_URL}/slug/${slug}/related`, {
      credentials: "include",
    });
    const relatedPosts = await res.json();

    renderRelatedPosts(relatedPosts);
  } catch (err) {
    console.error("Failed to fetch related posts.", err);
  }
};

const savedPostsContainer = document.getElementById("savedPostsContainer");

export async function loadSavedPosts() {
  try {
    const res = await apiFetch(`${API_URL}/saved/me`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const posts = await res.json();

    if (posts.length === 0) {
      savedPostsContainer.innerHTML = "<p>You have no saved posts yet.</p>";
      return;
    }

    savedPostsContainer.innerHTML = posts
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
            <small>${new Date(post.date).toLocaleDateString()}</small>
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
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();

        const slug = btn.dataset.slug;

        try {
          await apiFetch(`${API_URL}/${slug}/unsave`, {
            method: "POST",
            credentials: "include",
          });

          btn.closest(".post-card").remove();
          showToast("Removed from saved posts", "success");
        } catch (err) {
          console.error(err);
          showToast("Failed to remove", "error");
        }
      });
    });
  } catch (err) {
    console.error(err);
    savedPostsContainer.innerHTML = "<p>Error loading saved posts.</p>";
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
    displayPosts("myPostsContainer");
  }
}

document.getElementById("categoryFilter")?.addEventListener("change", () => {
  displayPosts("allPostsContainer");
});

function searchPosts(e) {
  const searchValue = e.target.value.toLowerCase() || "";
  const containerId = document.getElementById("allPostsContainer")
    ? "allPostsContainer"
    : "featuredPostsContainer";
  const container = document.getElementById(containerId);
  if (!container) return;

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchValue) ||
      post.content.toLowerCase().includes(searchValue) ||
      post.category.toLowerCase().includes(searchValue),
  );

  container.innerHTML = "";

  if (filteredPosts.length === 0) {
    renderNoResults(container);
    return;
  }

  filteredPosts.forEach((post) => {
    const div = document.createElement("div");
    div.classList.add("post");
    div.innerHTML = `
      ${
        post.image
          ? `<img src="${getImageUrl(post.image)}" alt="${post.title}" class="post-image" loading="lazy">`
          : ""
      }
      <div class="post-content">
        <p class="tag">${post.category}</p>
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <p><em>By ${post.authorName || "Unknown"}</em></p>
        <small>${new Date(post.date).toLocaleString()}</small>
      </div>
    `;
    container.appendChild(div);

    const img = div.querySelector(".post-image");
    if (img) {
      img.onerror = function () {
        this.onerror = null;
        this.src = "/Images/fallback.jpg";
      };
    }
    div.addEventListener("click", () => {
      window.location.href = `post.html?slug=${post.slug}`;
    });
  });

  if (searchValue === "") {
    refreshPage();
  }
}

search.forEach((input) => input.addEventListener("keyup", searchPosts));

function renderPagination() {
  const container = document.getElementById("pagination");
  if (!container) return;
  container.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "pg-active" : "";
    btn?.addEventListener("click", () => fetchPosts(i));
    container.appendChild(btn);
  }
}
