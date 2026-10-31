
document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("sidebar-toggle");
  const menu = document.getElementById("dashboard-sidebar");
  const conteudo = document.getElementById("dashboard-content");
  const overlay = document.getElementById("sidebar-overlay");

  if (!botao || !menu || !conteudo) {
    console.error("Elementos do menu não encontrados.");
    return;
  }

  const mobile = window.matchMedia("(max-width: 767px)");

  let recolhido = false;
  let mobileAberto = false;

  function atualizarMenu() {
    if (mobile.matches) {
      menu.style.width = "256px";
      menu.style.transform = mobileAberto
        ? "translateX(0)"
        : "translateX(-100%)";

      conteudo.style.marginLeft = "0px";

      menu.querySelectorAll(".sidebar-label").forEach((item) => {
        item.style.display = "";
      });

      overlay?.classList.toggle("hidden", !mobileAberto);
    } else {
      menu.style.transform = "translateX(0)";
      menu.style.width = recolhido ? "80px" : "256px";

      conteudo.style.marginLeft = recolhido ? "80px" : "256px";

      menu.querySelectorAll(".sidebar-label").forEach((item) => {
        item.style.display = recolhido ? "none" : "";
      });

      overlay?.classList.add("hidden");
    }

    menu.querySelectorAll(".sidebar-link").forEach((link) => {
      link.style.justifyContent =
        !mobile.matches && recolhido ? "center" : "";

      link.style.gap =
        !mobile.matches && recolhido ? "0px" : "";
    });

    const aberto = mobile.matches ? mobileAberto : !recolhido;

    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute(
      "aria-label",
      aberto ? "Recolher menu lateral" : "Expandir menu lateral"
    );
  }

  botao.addEventListener("click", () => {
    if (mobile.matches) {
      mobileAberto = !mobileAberto;
    } else {
      recolhido = !recolhido;
    }

    atualizarMenu();
  });

  overlay?.addEventListener("click", () => {
    mobileAberto = false;
    atualizarMenu();
  });

  mobile.addEventListener("change", () => {
    mobileAberto = false;
    atualizarMenu();
  });

  atualizarMenu();
});
