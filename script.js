/**
 * BEULAH MERCY A — DATA ANALYST PORTFOLIO
 * Vanilla JavaScript: Theme management, mobile navigation, scrollspy,
 * reveal animations, client-side form validation and submission.
 */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const scrollTopButton = document.getElementById("scrollTop");
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const sections = document.querySelectorAll("main section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  // -------------------------------------------------------------------------
  // 1. Theme Management (Dark Mode Default or Saved Preference)
  // -------------------------------------------------------------------------
  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "light") {
    body.classList.remove("dark-theme");
    if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  } else {
    // Default to dark theme for modern data analytics aesthetic
    body.classList.add("dark-theme");
    if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-theme");
      const isDark = body.classList.contains("dark-theme");

      themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

      localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    });
  }

  // -------------------------------------------------------------------------
  // 2. Mobile Menu Toggle
  // -------------------------------------------------------------------------
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Close mobile menu on clicking any navigation link
    navItems.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      }
    });
  }

  // -------------------------------------------------------------------------
  // 3. Scrollspy & Scroll-to-Top Button
  // -------------------------------------------------------------------------
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Toggle scroll to top button
    if (scrollTopButton) {
      scrollTopButton.classList.toggle("show", scrollY > 400);
    }

    // Determine current active section for navbar indicator
    let currentSectionId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navItems.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentSectionId}`) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // Initial run on page load

  if (scrollTopButton) {
    scrollTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // -------------------------------------------------------------------------
  // 4. Reveal Animations via IntersectionObserver
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // -------------------------------------------------------------------------
  // 5. Contact Form Validation & Submission
  // -------------------------------------------------------------------------
  if (form) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");
    const submitBtn = document.getElementById("submitBtn");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Live validation clearing
    const clearError = (input, errorEl) => {
      input.classList.remove("invalid");
      if (errorEl) errorEl.textContent = "";
    };

    if (nameInput) nameInput.addEventListener("input", () => clearError(nameInput, nameError));
    if (emailInput) emailInput.addEventListener("input", () => clearError(emailInput, emailError));
    if (messageInput) messageInput.addEventListener("input", () => clearError(messageInput, messageError));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      const nameVal = nameInput ? nameInput.value.trim() : "";
      if (!nameVal || nameVal.length < 2) {
        isValid = false;
        if (nameInput) nameInput.classList.add("invalid");
        if (nameError) nameError.textContent = "Please enter your name (at least 2 characters).";
      } else {
        clearError(nameInput, nameError);
      }

      // Validate Email
      const emailVal = emailInput ? emailInput.value.trim() : "";
      if (!emailVal || !emailRegex.test(emailVal)) {
        isValid = false;
        if (emailInput) emailInput.classList.add("invalid");
        if (emailError) emailError.textContent = "Please enter a valid email address.";
      } else {
        clearError(emailInput, emailError);
      }

      // Validate Message
      const messageVal = messageInput ? messageInput.value.trim() : "";
      if (!messageVal || messageVal.length < 10) {
        isValid = false;
        if (messageInput) messageInput.classList.add("invalid");
        if (messageError) messageError.textContent = "Please enter a message with at least 10 characters.";
      } else {
        clearError(messageInput, messageError);
      }

      if (!isValid) {
        if (formStatus) {
          formStatus.style.color = "#ef4444";
          formStatus.textContent = "Please resolve the highlighted errors before submitting.";
        }
        return;
      }

      // Form is valid: initiate submission
      if (formStatus) {
        formStatus.style.color = "var(--primary)";
        formStatus.textContent = "Sending your message...";
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      }

      try {
        const formData = new FormData(form);
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          if (formStatus) {
            formStatus.style.color = "#10b981";
            formStatus.textContent = "Thank you! Your message has been sent successfully.";
          }
          form.reset();
        } else {
          if (formStatus) {
            formStatus.style.color = "#ef4444";
            formStatus.textContent = data.message || "Message delivery limited. Please reach out directly to abeulahmercy@gmail.com";
          }
        }
      } catch (err) {
        if (formStatus) {
          formStatus.style.color = "#ef4444";
          formStatus.textContent = "Network error. Please email directly to abeulahmercy@gmail.com or call +91 63827 78177.";
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        }
        setTimeout(() => {
          if (formStatus && formStatus.textContent.includes("successfully")) {
            formStatus.textContent = "";
          }
        }, 8000);
      }
    });
  }
});
