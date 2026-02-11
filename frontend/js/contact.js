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

export function initSubscribeForm({
  formId,
  inputId,
  endpoint = "/api/subscribe",
}) {
  const form = document.getElementById(formId);
  const emailInput = document.getElementById(inputId);

  if (!form || !emailInput) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) {
      showToast("Please enter your email", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    const button = form.querySelector("button");
    const spinner = form.querySelector(".spinner");
    const text = form.querySelector(".btn-text");

    spinner.classList.remove("hidden");
    button.disabled = true;
    text.textContent = "Subscribing...";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.status === 201) {
        showToast("Subscribed successfully 🎉", "success");
        form.reset();
        return;
      }

      if (res.status === 409) {
        showToast("You’ve already subscribed 😊", "info");
        form.reset();
        return;
      }

      throw new Error(data.message);
    } catch {
      showToast("Subscription failed. Try again later.", "error");
    } finally {
      spinner.classList.remove("hidden");
      button.disabled = false;
      text.textContent = "Subscribe";
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
