import { showToast } from "./ui";

export const handleShare = async (btn) => {
  const slug = btn.dataset.slug;
  const url = `${window.location.origin}/post/${slug}`;
  const shareKey = `shared_${slug}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title: "BuzzInk",
        text: "Check out this post on BuzzInk",
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!", "success");
    }

    if (!sessionStorage.getItem(shareKey)) {
      sessionStorage.setItem(shareKey, "true");

      apiFetch(`/api/posts/${slug}/share`, {
        method: "POST",
      }).catch(() => {});
    }
  } catch (err) {
    showToast("Failed to share post. Please try again.", "error");
    console.error("Share cancelled or failed", err);
  }
};
