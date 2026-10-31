
document.addEventListener("DOMContentLoaded", () => {
  const lista = document.getElementById("lista-escolas");
  const busca = document.getElementById("busca-escolas");
  const paginacao = document.getElementById("paginacao-escolas");

  if (!lista || !busca || !paginacao) return;

  // Dados demonstrativos até a integração com a API.
  const escolas = [
    {
      nome: "Escola Municipal Monteiro de Assis",
      cidade: "Brasília",
      estado: "DF",
      tipo: "Municipal",
      alunos: 1250,
      professores: 78,
      turmas: 32
    },
    {
      nome: "Colégio Estadual Joaquim Nabuco",
      cidade: "Goiânia",
      estado: "GO",
      tipo: "Estadual",
      alunos: 980,
      professores: 62,
      turmas: 28
    },
    {
      nome: "Escola Municipal Maria Lobato",
      cidade: "Taguatinga",
      estado: "DF",
      tipo: "Municipal",
      alunos: 760,
      professores: 45,
      turmas: 24
    },
    {
      nome: "Centro Educacional Darcy Ribeiro",
      cidade: "Ceilândia",
      estado: "DF",
      tipo: "Estadual",
      alunos: 1100,
      professores: 68,
      turmas: 30
    },
    {
      nome: "Escola Classe 01 do Gama",
      cidade: "Gama",
      estado: "DF",
      tipo: "Municipal",
      alunos: 540,
      professores: 32,
      turmas: 18
    }
  ];

  let paginaAtual = 1;
  const porPagina = 5;

  const formatar = (numero) =>
    new Intl.NumberFormat("pt-BR").format(numero);

  function filtrarEscolas() {
    const termo = busca.value.trim().toLocaleLowerCase("pt-BR");

    return escolas.filter((escola) => {
      const texto = `${escola.nome} ${escola.cidade} ${escola.estado}`
        .toLocaleLowerCase("pt-BR");

      return texto.includes(termo);
    });
  }

  function criarCard(escola) {
    const municipal = escola.tipo === "Municipal";

    return `
      <article class="flex flex-col gap-4 rounded-xl border
                      border-slate-200 bg-white p-5 shadow-sm
                      transition hover:shadow-md sm:flex-row sm:items-center">

        <div class="flex h-16 w-16 shrink-0 items-center
                    justify-center rounded-xl
                    ${municipal
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-100 text-blue-700"}">
          <svg xmlns="http://www.w3.org/2000/svg"
               width="34" height="34" viewBox="0 0 24 24"
               fill="none" stroke="currentColor"
               stroke-width="1.7" stroke-linecap="round"
               stroke-linejoin="round">
            <path d="M4 22V7l8-4 8 4v15"/>
            <path d="M9 22v-6h6v6M8 9h.01M12 9h.01M16 9h.01"/>
            <path d="M8 13h.01M12 13h.01M16 13h.01M2 22h20"/>
          </svg>
        </div>

        <div class="min-w-0 flex-1">
          <h2 class="text-base font-bold text-[#12395c]">
            ${escola.nome}
          </h2>

          <p class="mt-1 text-xs text-slate-500">
            📍 ${escola.cidade} - ${escola.estado}
          </p>

          <span class="mt-2 inline-block rounded-md px-2 py-1
                       text-xs font-medium
                       ${municipal
                         ? "bg-emerald-100 text-emerald-700"
                         : "bg-blue-100 text-blue-700"}">
            ${escola.tipo}
          </span>

          <div class="mt-4 grid grid-cols-3 gap-3
                      border-t border-slate-100 pt-3">
            <div>
              <p class="text-xs text-slate-400">Alunos</p>
              <p class="text-sm font-semibold text-[#12395c]">
                ${formatar(escola.alunos)}
              </p>
            </div>
            <div>
              <p class="text-xs text-slate-400">Professores</p>
              <p class="text-sm font-semibold text-[#12395c]">
                ${formatar(escola.professores)}
              </p>
            </div>
            <div>
              <p class="text-xs text-slate-400">Turmas</p>
              <p class="text-sm font-semibold text-[#12395c]">
                ${formatar(escola.turmas)}
              </p>
            </div>
          </div>
        </div>

        <button type="button"
                class="self-end rounded-lg border border-slate-200
                       px-3 py-2 text-lg font-bold text-blue-600
                       hover:bg-blue-50 sm:self-center"
                aria-label="Detalhes de ${escola.nome}"
                title="Detalhes disponíveis após integração">
          ›
        </button>
      </article>
    `;
  }

  function renderizar() {
    const resultados = filtrarEscolas();
    const totalPaginas = Math.ceil(resultados.length / porPagina);

    paginaAtual = Math.max(
      1,
      Math.min(paginaAtual, totalPaginas || 1)
    );

    const inicio = (paginaAtual - 1) * porPagina;
    const visiveis = resultados.slice(inicio, inicio + porPagina);

    lista.innerHTML = visiveis.length
      ? visiveis.map(criarCard).join("")
      : `<p class="rounded-xl border border-slate-200 bg-white
                   p-8 text-center text-slate-500">
           Nenhuma escola encontrada.
         </p>`;

    paginacao.innerHTML = "";

    if (totalPaginas <= 1) return;

    function criarBotao(texto, pagina, desabilitado = false) {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.textContent = texto;
      botao.disabled = desabilitado;
      botao.className =
        `rounded-lg border px-4 py-2 text-sm
         ${pagina === paginaAtual && texto === String(pagina)
           ? "border-[#12395c] bg-[#12395c] text-white"
           : "border-slate-200 bg-white text-[#12395c]"}
         disabled:cursor-not-allowed disabled:opacity-40`;

      botao.addEventListener("click", () => {
        paginaAtual = pagina;
        renderizar();
      });

      paginacao.appendChild(botao);
    }

    criarBotao("Anterior", paginaAtual - 1, paginaAtual === 1);

    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
      criarBotao(String(pagina), pagina);
    }

    criarBotao(
      "Próximo",
      paginaAtual + 1,
      paginaAtual === totalPaginas
    );
  }

  busca.addEventListener("input", () => {
    paginaAtual = 1;
    renderizar();
  });

  renderizar();
});
