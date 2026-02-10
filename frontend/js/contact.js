import { showToast } from "./ui.js";

export function handleContactFormSubmit() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: name.value.trim(),
      email: email.value.trim(),
      message: message.value.trim(),
    };

    if (topic.value) {
      payload.topic = topic.value;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Request failed");

      showToast("Thanks for reaching out! 💙", "success");
      form.reset();
    } catch (err) {
      console.error("Contact form submission failed:", err.message);
      showToast("Failed to send message. Try again.", "error");
    }
  });
}
