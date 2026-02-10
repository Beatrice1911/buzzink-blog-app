import { showToast } from "./ui.js";

export function handleContactFormSubmit() {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      name: name.value,
      email: email.value,
      topic: topic.value,
      message: message.value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      showToast("Thanks for reaching out! 💙", "success");
      form.reset();
    } catch {
      showToast("Failed to send message. Try again.", "error");
    }
  });
}