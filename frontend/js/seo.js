import { apiFetch } from "./api.js";

export function setUpPostSEO() {
  if (window.location.pathname.endsWith("post.html")) {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("slug");
      if (!slug) return;

      const res = await apiFetch(`/api/posts/${slug}`);
      const post = await res.json();

      document.title = `${post.title} - BuzzInk`;

      const desc = post.content.slice(0, 160);

      document.getElementById("postTitle")?.setAttribute("content", post.title);
      document.getElementById("postDescription")?.setAttribute("content", desc);
      document.getElementById("ogTitle")?.setAttribute("content", post.title);
      document.getElementById("ogDescription")?.setAttribute("content", desc);
      document
        .getElementById("ogImage")
        ?.setAttribute("content", post.image || "/Images/fallback.jpg");
      document
        .getElementById("ogUrl")
        ?.setAttribute("content", window.location.href);
      document
        .getElementById("twitterTitle")
        ?.setAttribute("content", post.title);
      document
        .getElementById("twitterDescription")
        ?.setAttribute("content", desc);
      document
        .getElementById("twitterImage")
        ?.setAttribute("content", post.image || "/Images/fallback.jpg");
    })();
  }
}
