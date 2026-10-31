
/* ==========================================
   EDUDATA - ESTATISTICAS.JS
   Integração com a API EduData
========================================== */

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // CONFIGURAÇÕES
  // ==========================================

  const azulEscuro = "#12395c";

  const formulario = document.getElementById("form-estatisticas");
  const filtroUF = document.getElementById("estatisticas-uf");
  const filtroMunicipio = document.getElementById("estatisticas-municipio");
  const mensagem = document.getElementById("mensagem-estatisticas");

  const canvasBarras = document.getElementById("grafico-matriculas");
  const canvasRosca = document.getElementById("grafico-redes");

  const tabela = document.getElementById("tabela-municipios");

  let graficoBarras = null;
  let graficoRosca = null;
  let numeroConsulta = 0;

  // ==========================================
  // CONFIGURAR CHART.JS
  // ==========================================

  if (typeof Chart !== "undefined") {
    Chart.defaults.font.family = "Arial, sans-serif";
    Chart.defaults.color = "#64748b";
  } else {
    console.error("Chart.js não foi carregado.");
  }

  // ==========================================
  // FUNÇÕES AUXILIARES
  // ==========================================

  function formatar(valor) {
    const numero = Number(valor);

    return Number.isFinite(numero)
      ? numero.toLocaleString("pt-BR")
      : "—";
  }

  function numeroValido(valor) {
    return (
      typeof valor === "number" &&
      Number.isFinite(valor) &&
      valor >= 0
    );
  }

  function informar(texto) {
    if (mensagem) {
      mensagem.textContent = texto;
    }
  }

  function mostrarValor(id, valor) {
    const elemento = document.getElementById(id);

    if (!elemento) return;

    elemento.textContent = numeroValido(valor)
      ? formatar(valor)
      : "—";
  }

  function limparIndicadores() {
    const ids = [
      "estat-total-escolas",
      "estat-com-internet",
      "estat-com-biblioteca",
      "estat-com-rampa"
    ];

    ids.forEach((id) => mostrarValor(id, null));
  }

  function limparGraficos() {
    if (graficoBarras) {
      graficoBarras.destroy();
      graficoBarras = null;
    }

    if (graficoRosca) {
      graficoRosca.destroy();
      graficoRosca = null;
    }
  }

  function limparTabela() {
    if (tabela) {
      tabela.innerHTML = "";
    }
  }

  function limparResultados() {
    limparIndicadores();
    limparGraficos();
    limparTabela();
  }

  // ==========================================
  // ATUALIZAR CARDS
  // ==========================================

  function atualizarIndicadores(dados) {
    mostrarValor(
      "estat-total-escolas",
      dados.totalEscolas
    );

    mostrarValor(
      "estat-com-internet",
      dados.comInternet
    );

    mostrarValor(
      "estat-com-biblioteca",
      dados.comBiblioteca
    );

    mostrarValor(
      "estat-com-rampa",
      dados.comRampaAcessibilidade
    );
  }

  // ==========================================
  // GRÁFICO DE BARRAS
  // INFRAESTRUTURA ESCOLAR
  // ==========================================

  function criarGraficoBarras(dados) {
    if (!canvasBarras || typeof Chart === "undefined") {
      return;
    }

    const indicadores = [
      {
        nome: ["Internet"],
        valor: dados.comInternet,
        cor: "#10b981"
      },
      {
        nome: ["Biblioteca"],
        valor: dados.comBiblioteca,
        cor: "#3b82f6"
      },
      {
        nome: ["Laboratório", "Informática"],
        valor: dados.comLaboratorioInformatica,
        cor: "#93c5fd"
      },
      {
        nome: ["Laboratório", "Ciências"],
        valor: dados.comLaboratorioCiencias,
        cor: "#8b5cf6"
      },
      {
        nome: ["Quadra", "Esportiva"],
        valor: dados.comQuadraEsportes,
        cor: "#a78bfa"
      },
      {
        nome: ["Água", "Potável"],
        valor: dados.comAguaPotavel,
        cor: "#06b6d4"
      },
      {
        nome: ["Rampa", "Acessível"],
        valor: dados.comRampaAcessibilidade,
        cor: "#f59e0b"
      }
    ];

    graficoBarras = new Chart(canvasBarras, {
      type: "bar",

      data: {
        labels: indicadores.map((item) => item.nome),

        datasets: [{
          label: "Escolas",

          data: indicadores.map((item) =>
            numeroValido(item.valor) ? item.valor : null
          ),

          backgroundColor: indicadores.map(
            (item) => item.cor
          ),

          borderRadius: 5,
          maxBarThickness: 56
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false
          },

          tooltip: {
            callbacks: {
              label: (context) => {
                const valor = context.parsed.y;

                return numeroValido(valor)
                  ? `${formatar(valor)} escolas`
                  : "Dado indisponível";
              }
            }
          }
        },

        scales: {
          x: {
            grid: {
              display: false
            },

            ticks: {
              font: {
                size: 10
              }
            }
          },

          y: {
            beginAtZero: true,

            border: {
              display: false
            },

            grid: {
              color: "#eef2f7"
            },

            ticks: {
              precision: 0,

              callback: (valor) =>
                formatar(valor)
            }
          }
        }
      }
    });
  }

  // ==========================================
  // GRÁFICO DE ROSCA
  // CONECTIVIDADE ESCOLAR
  // ==========================================

  function criarGraficoRosca(dados) {
    if (!canvasRosca || typeof Chart === "undefined") {
      return;
    }

    const total = dados.totalEscolas;
    const comInternet = dados.comInternet;

    if (
      !numeroValido(total) ||
      !numeroValido(comInternet) ||
      comInternet > total
    ) {
      console.warn(
        "Dados insuficientes para o gráfico de conectividade."
      );

      return;
    }

    const semInternet = total - comInternet;

    graficoRosca = new Chart(canvasRosca, {
      type: "doughnut",

      data: {
        labels: [
          "Com internet",
          "Sem internet"
        ],

        datasets: [{
          data: [
            comInternet,
            semInternet
          ],

          backgroundColor: [
            "#10b981",
            "#8b5cf6"
          ],

          borderWidth: 0,
          hoverOffset: 6
        }]
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",

        plugins: {
          legend: {
            position: "right",

            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              boxWidth: 9,
              padding: 16,

              font: {
                size: 11
              }
            }
          },

          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.label}: ${formatar(context.parsed)} escolas`
            }
          }
        }
      },

      plugins: [{
        id: "textoCentralEduData",

        afterDraw(chart) {
          const meta = chart.getDatasetMeta(0);

          if (!meta.data.length) return;

          const centroX = meta.data[0].x;
          const centroY = meta.data[0].y;
          const ctx = chart.ctx;

          ctx.save();

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.fillStyle = azulEscuro;
          ctx.font = "bold 22px Arial";

          ctx.fillText(
            formatar(total),
            centroX,
            centroY - 7
          );

          ctx.font = "11px Arial";
          ctx.fillStyle = "#64748b";

          ctx.fillText(
            "Escolas",
            centroX,
            centroY + 15
          );

          ctx.restore();
        }
      }]
    });
  }

  // ==========================================
  // TABELA DE INFRAESTRUTURA
  // ==========================================

  function atualizarTabela(dados) {
    if (!tabela) return;

    const indicadores = [
      {
        nome: "Escolas com internet",
        valor: dados.comInternet
      },
      {
        nome: "Internet para alunos",
        valor: dados.comInternetAlunos
      },
      {
        nome: "Escolas com biblioteca",
        valor: dados.comBiblioteca
      },
      {
        nome: "Laboratório de informática",
        valor: dados.comLaboratorioInformatica
      },
      {
        nome: "Laboratório de ciências",
        valor: dados.comLaboratorioCiencias
      },
      {
        nome: "Quadra de esportes",
        valor: dados.comQuadraEsportes
      },
      {
        nome: "Água potável",
        valor: dados.comAguaPotavel
      },
      {
        nome: "Rampa de acessibilidade",
        valor: dados.comRampaAcessibilidade
      }
    ];

    tabela.innerHTML = indicadores
      .map((indicador, indice) => {
        const valor = numeroValido(indicador.valor)
          ? formatar(indicador.valor)
          : "—";

        return `
          <tr class="hover:bg-slate-50">

            <td class="px-5 py-3">
              ${indice + 1}
            </td>

            <td class="px-5 py-3 font-medium">
              ${indicador.nome}
            </td>

            <td class="px-5 py-3 text-right">
              ${valor}
            </td>

          </tr>
        `;
      })
      .join("");
  }

  // ==========================================
  // ATUALIZAR TODOS OS RESULTADOS
  // ==========================================

  function atualizarResultados(dados) {
    atualizarIndicadores(dados);

    limparGraficos();

    criarGraficoBarras(dados);
    criarGraficoRosca(dados);

    atualizarTabela(dados);
  }

  // ==========================================
  // CONSULTAR API EDUDATA
  // ==========================================

  async function consultarEstatisticas() {
    const uf = filtroUF
      ? filtroUF.value.trim().toUpperCase()
      : "";

    const municipio = filtroMunicipio
      ? filtroMunicipio.value.trim()
      : "";

    if (!uf && !municipio) {
      informar(
        "Selecione uma UF ou informe um município."
      );

      return;
    }

    const consulta = ++numeroConsulta;

    limparResultados();

    informar(
      "Consultando estatísticas da API EduData..."
    );

    try {
      if (
        typeof EduDataAPI === "undefined" ||
        typeof EduDataAPI.estatisticasPorUF !== "function" ||
        typeof EduDataAPI.estatisticasPorMunicipio !== "function"
      ) {
        throw new Error(
          "API EduData não inicializada."
        );
      }

      let dados;

      // Se houver município, consulta por município.
      // Caso contrário, consulta por UF.
      if (municipio) {
        dados = await EduDataAPI.estatisticasPorMunicipio(
          municipio
        );
      } else {
        dados = await EduDataAPI.estatisticasPorUF(
          uf
        );
      }

      // Ignora respostas antigas quando uma nova
      // consulta já foi iniciada.
      if (consulta !== numeroConsulta) {
        return;
      }

      console.log(
        "Estatísticas recebidas da API:",
        dados
      );

      if (!dados || typeof dados !== "object") {
        throw new Error(
          "Resposta inválida da API EduData."
        );
      }

      atualizarResultados(dados);

      const localConsultado =
        dados.local || municipio || uf;

      informar(
        `Estatísticas carregadas para ${localConsultado}.`
      );

    } catch (erro) {
      if (consulta !== numeroConsulta) {
        return;
      }

      console.error(
        "Erro ao consultar estatísticas:",
        erro
      );

      informar(
        "Não foi possível carregar as estatísticas da API EduData."
      );
    }
  }

  // ==========================================
  // EVENTO DO FORMULÁRIO
  // ==========================================

  if (formulario) {
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();

      consultarEstatisticas();
    });
  }

  // ==========================================
  // INICIALIZAÇÃO
  // ==========================================

  limparResultados();

  // Faz a consulta inicial somente quando
  // já existe algum filtro preenchido.
  if (
    filtroUF?.value.trim() ||
    filtroMunicipio?.value.trim()
  ) {
    consultarEstatisticas();
  }

  console.log(
    "Página Estatísticas EduData inicializada."
  );

});
