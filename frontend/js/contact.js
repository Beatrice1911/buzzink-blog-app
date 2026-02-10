import { showToast } from "./ui.js";

export function handleContactFormSubmit() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    const payload = {
      name: data.get("name")?.trim(),
      email: data.get("email")?.trim(),
      message: data.get("message")?.trim(),
    };

    const topic = data.get("topic");
    if (topic) payload.topic = topic;

    if (!payload.name || !payload.email || !payload.message) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const dataRes = await res.json();

      if (!res.ok) throw new Error(dataRes.message || "Request failed");

      showToast("Thanks for reaching out! 💙", "success");
      form.reset();
    } catch (err) {
      console.error("Contact form submission failed:", err);
      showToast("Failed to send message. Try again.", "error");
    }
  });
}
