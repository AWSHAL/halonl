document.addEventListener("DOMContentLoaded", function () {
  const wrapperId = "mauticform_wrapper_formulariosolicitudes";
  const formId = "mauticform_formulariosolicitudes";
  const inputId = "mauticform_input_formulariosolicitudes";
  const apiURL = "https://api.halsystem.es/v1";
  const token = "7f140b80f23dc86f95182614da4b6b53";
  const areaId = 2; // Dorsia
  const crGroupId = 15;
  const originId = 62; // Web Dorsia

  // Función para realizar una solicitud Fetch
  async function executeFetch(id, url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error de red: ${response.status}`);
      }
      const data = await response.json();
      const div = document.getElementById(id);
      if (div !== null) {
        div.innerHTML = data;
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }

  function getParams() {
    let params = new URLSearchParams(location.search);
    var utmClinics = params.get("utm_clinics");
    var utmCR = params.get("utm_cr");

    return {
      utmClinics: utmClinics,
      utmCR: utmCR,
    };
  }

  function addConsultationReason() {
    let params = getParams();
    let groupId = crGroupId;

    if (params.utmCR) {
      groupId = params.utmCR;
    }

    const url =
      `${apiURL}/consultation-reasons/group?id=${groupId}&access-token=${token}&pageSize=10000&select=true`;

      executeFetch(`${inputId}_id_consultation_reason`, url);
  }

  function addClinicsV1() {
    let params = getParams();

    let url =
      `${apiURL}/clinics/for-select?area=${areaId}&access-token=${token}&pageSize=10000&select=true`;

    if (params.utmClinics) {
      url += `&clinics=${params.utmClinics}`;
    }

    executeFetch(`${inputId}_id_clinic`, url);
  }

  function load() {
    addConsultationReason();
    addClinicsV1();
  }

  load();
});
