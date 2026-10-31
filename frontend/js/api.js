
/* ==========================================
   EDUDATA - API.JS
========================================== */

const API_BASE_URL = "https://edudata-teste.onrender.com";

const EduDataAPI = {

  async get(endpoint) {
    const resposta = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json"
        }
      }
    );

    if (!resposta.ok) {
      throw new Error(`Erro HTTP ${resposta.status}`);
    }

    return resposta.json();
  },

  listarEscolas() {
    return this.get("/api/escolas");
  },

  estatisticasPorUF(uf) {
    return this.get(
      `/api/estatisticas/uf/${encodeURIComponent(uf)}`
    );
  },

  estatisticasPorMunicipio(municipio) {
    return this.get(
      `/api/estatisticas/municipio/${encodeURIComponent(municipio)}`
    );
  }

};
