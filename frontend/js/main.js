
const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");

    mobileMenu.classList.toggle("hidden", isOpen);

    menuButton.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );

    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Abrir menu" : "Fechar menu"
    );
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");

      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Abrir menu");
    });
  });
}



/* ========================================
   FORMULÁRIO DE CADASTRO
======================================== */

const signupForm = document.getElementById("signup-form");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("toggle-password");
const formMessage = document.getElementById("form-message");
const loginLink = document.getElementById("login-link");

// Mostrar e ocultar senha
if (passwordInput && togglePassword) {
  togglePassword.addEventListener("click", () => {
    const isVisible = passwordInput.type === "text";

    passwordInput.type = isVisible ? "password" : "text";

    togglePassword.setAttribute(
      "aria-label",
      isVisible ? "Mostrar senha" : "Ocultar senha"
    );

    togglePassword.setAttribute(
      "aria-pressed",
      String(!isVisible)
    );
  });
}

// Validar o formulário sem enviar dados
if (signupForm && formMessage) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formMessage.classList.remove("hidden");

    formMessage.textContent =
      "Formulário validado! O cadastro estará disponível em breve.";
  });
}

// Login ainda não implementado
if (loginLink) {
  loginLink.addEventListener("click", (event) => {
    event.preventDefault();

    if (formMessage) {
      formMessage.classList.remove("hidden");
      formMessage.textContent =
        "A página de login ainda não está disponível.";
    }
  });
}



/* ========================================
   LOGIN
======================================== */

const loginForm = document.getElementById("login-form");
const loginPassword = document.getElementById("login-password");
const toggleLoginPassword = document.getElementById("toggle-login-password");
const loginMessage = document.getElementById("login-message");
const forgotPasswordLink = document.getElementById("forgot-password-link");

// Mostrar ou ocultar senha
if (loginPassword && toggleLoginPassword) {
  toggleLoginPassword.addEventListener("click", () => {
    const isVisible = loginPassword.type === "text";

    loginPassword.type = isVisible ? "password" : "text";

    toggleLoginPassword.setAttribute(
      "aria-label",
      isVisible ? "Mostrar senha" : "Ocultar senha"
    );

    toggleLoginPassword.setAttribute(
      "aria-pressed",
      String(!isVisible)
    );
  });
}

// Login demonstrativo
if (loginForm && loginMessage) {
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    loginMessage.textContent =
      "O login estará disponível quando a autenticação for implementada.";

    loginMessage.classList.remove("hidden");
  });
}

// Recuperação de senha ainda não implementada
if (forgotPasswordLink && loginMessage) {
  forgotPasswordLink.addEventListener("click", (event) => {
    event.preventDefault();

    loginMessage.textContent =
      "A recuperação de senha ainda não está disponível.";

    loginMessage.classList.remove("hidden");
  });
}



/* ========================================
   DASHBOARD - MENU EXPANSÍVEL
======================================== */

function inicializarMenuDashboard() {
  const dashboardSidebar = document.getElementById("dashboard-sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");

  if (!sidebarToggle || !dashboardSidebar) {
    return;
  }

  const mobileQuery = window.matchMedia("(max-width: 767px)");

  function atualizarAcessibilidade() {
    const expandido = mobileQuery.matches
      ? dashboardSidebar.classList.contains("is-open")
      : !dashboardSidebar.classList.contains("is-collapsed");

    sidebarToggle.setAttribute("aria-expanded", String(expandido));
    sidebarToggle.setAttribute(
      "aria-label",
      expandido ? "Recolher menu lateral" : "Expandir menu lateral"
    );
  }

  function fecharMenuMobile() {
    dashboardSidebar.classList.remove("is-open");
    sidebarOverlay?.classList.add("hidden");
    atualizarAcessibilidade();
  }

  sidebarToggle.addEventListener("click", () => {
    if (mobileQuery.matches) {
      const aberto = dashboardSidebar.classList.toggle("is-open");
      sidebarOverlay?.classList.toggle("hidden", !aberto);
    } else {
      dashboardSidebar.classList.toggle("is-collapsed");
    }

    atualizarAcessibilidade();
  });

  sidebarOverlay?.addEventListener("click", fecharMenuMobile);

  dashboardSidebar.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileQuery.matches) {
        fecharMenuMobile();
      }
    });
  });

  mobileQuery.addEventListener("change", fecharMenuMobile);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileQuery.matches) {
      fecharMenuMobile();
    }
  });

  atualizarAcessibilidade();
}

inicializarMenuDashboard();
