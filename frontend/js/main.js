
document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // MENU MOBILE - LANDING PAGE
  // ==========================================

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

  // ==========================================
  // FORMULÁRIO DE CADASTRO
  // ==========================================

  const signupForm = document.getElementById("signup-form");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("toggle-password");
  const formMessage = document.getElementById("form-message");
  const loginLink = document.getElementById("login-link");

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

  if (signupForm && formMessage) {
    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();

      formMessage.classList.remove("hidden");
      formMessage.textContent =
        "Formulário validado! O cadastro estará disponível em breve.";
    });
  }

  if (loginLink) {
    loginLink.setAttribute("href", "./login.html");
  }

  // ==========================================
  // LOGIN DEMONSTRATIVO
  // ==========================================

  const formulario = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const senhaInput = document.getElementById("login-password");
  const mensagem = document.getElementById("login-message");

  if (formulario && emailInput && senhaInput) {
    console.log("Login EduData inicializado.");

    if (mensagem) {
      mensagem.textContent = "";
      mensagem.classList.add("hidden");
    }

    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();

      const email = emailInput.value.trim().toLowerCase();
      const senha = senhaInput.value;

      if (
        email === "demo@edudata.com" &&
        senha === "EduData@123"
      ) {
        sessionStorage.setItem("edudata_demo_login", "true");
        sessionStorage.setItem("edudata_demo_email", email);

        console.log(
          "Login demonstrativo realizado com sucesso."
        );

        window.location.assign("./dashboard.html");

      } else {
        if (mensagem) {
          mensagem.textContent = "E-mail ou senha incorretos.";
          mensagem.classList.remove("hidden");
          mensagem.classList.add("text-red-600");
        }
      }
    });
  }

  // ==========================================
  // MOSTRAR / OCULTAR SENHA DO LOGIN
  // ==========================================

  const toggleSenha = document.getElementById(
    "toggle-login-password"
  );

  if (toggleSenha && senhaInput) {
    toggleSenha.addEventListener("click", () => {
      const mostrar = senhaInput.type === "password";

      senhaInput.type = mostrar ? "text" : "password";

      toggleSenha.setAttribute(
        "aria-label",
        mostrar ? "Ocultar senha" : "Mostrar senha"
      );

      toggleSenha.setAttribute(
        "aria-pressed",
        String(mostrar)
      );

      const icone = toggleSenha.querySelector(
        ".material-symbols-outlined"
      );

      if (icone) {
        icone.textContent = mostrar
          ? "visibility_off"
          : "visibility";
      }
    });
  }

  // ==========================================
  // BOTÃO SAIR
  // ==========================================

  const botaoSair = document.getElementById("logout-demo");

  if (botaoSair) {
    botaoSair.addEventListener("click", (evento) => {
      evento.preventDefault();

      sessionStorage.removeItem("edudata_demo_login");
      sessionStorage.removeItem("edudata_demo_email");

      window.location.assign("./login.html");
    });
  }

  // ==========================================
  // CARREGAR ESTADOS PELA API DO IBGE
  // ==========================================

  const filtroUF = document.getElementById("filtro-uf");

  async function carregarEstados() {
    if (!filtroUF) return;

    // Preserva uma UF já selecionada, se existir.
    const ufSelecionada = filtroUF.value;

    filtroUF.disabled = true;

    filtroUF.innerHTML =
      '<option value="">Carregando estados...</option>';

    try {
      const resposta = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
      );

      if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status}`);
      }

      const estados = await resposta.json();

      if (!Array.isArray(estados)) {
        throw new Error("Resposta inválida da API do IBGE.");
      }

      // Garante a ordem alfabética.
      estados.sort((a, b) =>
        a.nome.localeCompare(b.nome, "pt-BR")
      );

      // Limpa o campo e adiciona a opção inicial.
      filtroUF.innerHTML = "";

      const opcaoInicial = document.createElement("option");

      opcaoInicial.value = "";
      opcaoInicial.textContent = "Selecione um estado";

      filtroUF.appendChild(opcaoInicial);

      // Adiciona os estados retornados pelo IBGE.
      estados.forEach((estado) => {
        const opcao = document.createElement("option");

        opcao.value = estado.sigla;
        opcao.textContent = estado.nome;

        filtroUF.appendChild(opcao);
      });

      // Restaura a seleção anterior, caso exista
      // entre as opções carregadas.
      if (
        ufSelecionada &&
        Array.from(filtroUF.options).some(
          (opcao) => opcao.value === ufSelecionada
        )
      ) {
        filtroUF.value = ufSelecionada;
      }

      filtroUF.disabled = false;

      console.log(
        `${estados.length} estados carregados pela API do IBGE.`
      );

    } catch (erro) {
      console.error(
        "Erro ao carregar estados pela API do IBGE:",
        erro
      );

      filtroUF.innerHTML = "";

      const opcaoErro = document.createElement("option");

      opcaoErro.value = "";
      opcaoErro.textContent = "Erro ao carregar estados";

      filtroUF.appendChild(opcaoErro);

      // Mantém o campo desabilitado para impedir
      // uma seleção inválida.
      filtroUF.disabled = true;
    }
  }

  // Carrega os estados automaticamente
  // quando a página possui o filtro de UF.
  if (filtroUF) {
    carregarEstados();
  }

  // ==========================================
  // DASHBOARD - BUSCA DE ESCOLAS
  // ==========================================

  const formBusca = document.getElementById(
    "form-busca-escolas"
  );

  if (formBusca) {
    const filtroMunicipio = document.getElementById(
      "filtro-municipio"
    );

    const mensagemBusca = document.getElementById(
      "mensagem-busca"
    );

    if (!filtroUF || !filtroMunicipio) {
      console.error(
        "Campos UF ou município não encontrados."
      );

    } else {
      console.log("Busca de escolas inicializada.");

      const idsIndicadores = [
        "total-escolas",
        "total-internet",
        "total-internet-alunos",
        "total-biblioteca"
      ];

      // ==========================================
      // FUNÇÕES AUXILIARES
      // ==========================================

      function mostrarValor(id, valor) {
        const elemento = document.getElementById(id);

        if (!elemento) return;

        elemento.textContent =
          typeof valor === "number" &&
          Number.isFinite(valor)
            ? valor.toLocaleString("pt-BR")
            : "—";
      }

      function limparIndicadores() {
        idsIndicadores.forEach((id) => {
          mostrarValor(id, null);
        });
      }

      function informar(texto) {
        if (mensagemBusca) {
          mensagemBusca.textContent = texto;
        }
      }

      // Remove os valores ilustrativos dos cartões.
      limparIndicadores();

      // ==========================================
      // EVENTO DE BUSCA
      // ==========================================

      formBusca.addEventListener(
        "submit",
        async (evento) => {
          evento.preventDefault();

          console.log("Formulário de busca enviado.");

          const uf = filtroUF.value.trim().toUpperCase();

          const municipio = filtroMunicipio.value.trim();

          if (!uf || !municipio) {
            informar(
              "Selecione uma UF e informe o município."
            );

            return;
          }

          limparIndicadores();

          informar(
            "Consultando dados da API EduData..."
          );

          try {
            if (
              typeof EduDataAPI === "undefined" ||
              typeof EduDataAPI.estatisticasPorMunicipio !== "function"
            ) {
              throw new Error(
                "API EduData não inicializada."
              );
            }

            // Consulta a API real do EduData.
            const dados =
              await EduDataAPI.estatisticasPorMunicipio(
                municipio
              );

            console.log("UF selecionada:", uf);
            console.log("Município informado:", municipio);
            console.log("Resposta da API:", dados);

            if (!dados || typeof dados !== "object") {
              throw new Error(
                "Resposta inválida da API EduData."
              );
            }

            // ==========================================
            // ATUALIZAR INDICADORES COM DADOS REAIS
            // ==========================================

            mostrarValor(
              "total-escolas",
              dados.totalEscolas
            );

            mostrarValor(
              "total-internet",
              dados.comInternet
            );

            mostrarValor(
              "total-internet-alunos",
              dados.comInternetAlunos
            );

            mostrarValor(
              "total-biblioteca",
              dados.comBiblioteca
            );

            informar(
              `Consulta realizada para ${municipio} - ${uf}.`
            );

          } catch (erro) {
            console.error("Erro na busca:", erro);

            informar(
              "Não foi possível consultar os dados da API."
            );
          }
        }
      );
    }
  }

});
