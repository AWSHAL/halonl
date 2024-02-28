document.addEventListener("DOMContentLoaded", function () {
  const formId = "mauticform_formulariowebeva";
  const inputId = "mauticform_input_formulariowebeva";
  const urlV1 = "https://api.halsystem.es/v1";
  const token = "7f140b80f23dc86f95182614da4b6b53";
  const areaId = 1; // Eva
  const crGroupId = 13;
  const originId = 63; // Web Eva

  const executeAjax = (id, url) => {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let str = JSON.parse(this.responseText);
        document.getElementById(id).innerHTML = str;
      }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
  };

  const addClinicsV1 = (value = 0) => {
    let url =
      urlV1 +
      `/clinics/for-select?area=` +
      areaId +
      `&access-token=` +
      token +
      `&pageSize=10000&select=true`;
    if (value != 0) {
      url += `&region=` + value;
    }

    let params = getParams();
    if (params.utmClinics) {
      url += `&clinics=${params.utmClinics}`;
    }

    executeAjax(inputId + "_id_clinic", url);
    clean(0);
  };

  const setIdAttribute = (idAttribute, $value) => {
    let select = document.getElementById(formId + "_" + idAttribute);
    if (!select) {
      return;
    }
    let inputSelect = document.getElementById(inputId + "_" + idAttribute);
    inputSelect.remove();
    let input = document.createElement("input");
    input.id = inputId + "_" + idAttribute;
    input.name = "mauticform[" + idAttribute + "]";
    input.setAttribute("value", $value);
    select.appendChild(input);
    select.style.display = "none";
  };

  const addConsultationReason = () => {
    executeAjax(
      inputId + "_id_consultation_reason",
      urlV1 +
        `/consultation-reasons/group?id=` +
        crGroupId +
        `&select=true&access-token=` +
        token +
        `&pageSize=10000&select=true`
    );
  };

  // Comprueba si existe un motivo de consulta por defecto
  const getIdConsultationReason = () => {
    let divConsultation = document.getElementById("id-consultation");
    if (divConsultation) {
      let id_consultation = divConsultation.getAttribute(
        "data-id-consultation"
      );
      if (id_consultation > 0)
        setIdAttribute("id_consultation_reason", id_consultation);
    } else {
      addConsultationReason();
    }
  };

  // Comprueba si existe una clínica por defecto
  const getIdClinic = () => {
    let divClinic = document.getElementById("id-clinic");
    if (divClinic) {
      let id_clinic = divClinic.getAttribute("data-id-clinic");
      setIdAttribute("id_clinic", id_clinic);
    } else {
      addClinicsV1();
    }
  };

  const getParams = () => {
    let params = new URLSearchParams(location.search);
    let utmClinics = params.get("utm_clinics");
    let utmCR = params.get("utm_cr");

    return {
      utmClinics: utmClinics,
      utmCR: utmCR,
    };
  };

  const clean = (step) => {
    if (step == 0) {
      let selectTime = document.getElementById(inputId + "_time_select");
      selectTime.innerHTML =
        '<option value="">Selecciona la hora</option><option disabled selected value>No hay horas disponibles</option>';
    }
    if (step == 0 || step == 1) {
      let selectDate = document.getElementById(inputId + "_date");
      selectDate.innerHTML = "--/--/----";
    }
    let selectPvDateTime = document.getElementById(inputId + "_pv_date_time");
    selectPvDateTime.value = "";
  };

  const formSubmit = () => {
    let btnSubmit = document.getElementById(inputId + "_submit");
    btnSubmit.click();
  };

  const sendLead = (submit) => {
    if (submit) {
      formSubmit();
    } else {
      let error = false;
      let inputSelectTime = document.getElementById(inputId + "_time_select");
      let inputSelectDate = document.getElementById(inputId + "_date");
      console.info(inputSelectTime.value);
      console.info(inputSelectDate.value);
      if (inputSelectTime.value == "") {
        alert("Falta elegir una hora");
        error = true;
      }
      if (inputSelectDate.value == "") {
        alert("Falta elegir una fecha");
        error = true;
      }

      if (!error) formSubmit();
    }
  };

  const formatDate = (date) => {
    let day = date.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let formatted_date = day + "-" + month + "-" + date.getFullYear();
    return formatted_date;
  };

  const addFreeSlotsV1 = (event) => {
    let date = formatDate(new Date(event.target.value));
    let id_clinic = document.getElementById(inputId + "_id_clinic").value;
    if (id_clinic) {
      executeAjax(
        inputId + "_time_select",
        urlV1 +
          `/events/free-slots?id_clinic=` +
          id_clinic +
          `&access-token=` +
          token +
          `&pageSize=10000&select=true&date_start=` +
          date +
          `&id_area=` +
          areaId
      );
    } else {
      alert("Primero debes seleccionar una clínica");
      document.getElementById(inputId + "_date").value = "";
    }
  };

  const hiddenDateTime = () => {
    // Ocultar selectores
    let selectDate = document.getElementById(formId + "_date");
    selectDate.style.display = "none";
    let selectTime = document.getElementById(formId + "_time_select");
    selectTime.style.display = "none";
    let btnSubmit = document.getElementById(formId + "_submit");
    btnSubmit.style.display = "none";
    let btnSend = document.getElementById("btnSend");
    btnSend.style.display = "block";
    let box = document.getElementById("boxBtnDateTime");
    box.style.display = "none";
    let btnSelectDateTime = document.getElementById("btnSelectDateTime");
    btnSelectDateTime.innerHTML = "Seleccionar fecha";
  };

  const viewDateTime = () => {
    // Mostrar selectores
    let selectDate = document.getElementById(formId + "_date");
    selectDate.style.display = "block";
    let selectTime = document.getElementById(formId + "_time_select");
    selectTime.style.display = "block";
    //let btnSubmit = document.getElementById(formId + '_submit');
    //btnSubmit.style.display = 'block';
    let box = document.getElementById("boxBtnDateTime");
    box.style.display = "block";
    let btnSend = document.getElementById("btnSend");
    btnSend.style.display = "none";
    let btnSelectDateTime = document.getElementById("btnSelectDateTime");
    btnSelectDateTime.innerHTML = "Ocultar fecha";
  };

  const createButtons = () => {
    let tcita = document.getElementById(formId + "_subscribe");

    let tdBtnSend = document.getElementById("tdBtnSend");
    const button1 = document.createElement("button");
    button1.style.width = "100%";
    button1.id = "btnSend";
    button1.type = "button";
    button1.innerText = "Solicitar cita";
    tdBtnSend.appendChild(button1);
    button1.addEventListener("click", (event) => {
      sendLead(true);
    });

    let tdBtnSelect = document.getElementById("tdBtnSelect");
    const button2 = document.createElement("button");
    button2.style.width = "100%";
    button2.type = "button";
    button2.id = "btnSelectDateTime";
    button2.innerText = "Seleccionar fecha y hora";
    tdBtnSelect.appendChild(button2);
    button2.addEventListener("click", (event) => {
      changeDateTime();
    });

    let box = document.getElementById("boxBtnDateTime");
    box.innerHTML = "";
    const button3 = document.createElement("button");
    button3.type = "button";
    button3.innerText = "Pedir cita";
    box.appendChild(button3);
    button3.addEventListener("click", (event) => {
      sendLead(false);
    });
  };

  const changeDateTime = () => {
    let selectDate = document.getElementById(formId + "_date");
    if (selectDate.style.display == "block") {
      hiddenDateTime();
    } else {
      viewDateTime();
    }
  };

  const changeConsultationReason = () => {
    let selectElement = document.getElementById(
      inputId + "_id_consultation_reason"
    );

    if (!selectElement) return;

    selectElement.addEventListener("change", function () {
      var clinicElement = document.getElementById(inputId + "_id_clinic");
      if (this.value !== "" && this.value == 189) {
        // Añadir opction
        addOption(clinicElement, 90, 'Banco Madrid');
        viewAlert();
      } else {
        // Eliminar option
        removeOption(clinicElement, 90);
        getIdClinic();
        removeAlert();
      }
    });
  };

  const addOption = (select, value, text) => {
    let option = document.createElement("option");
    option.value = value;
    option.text = text;
    select.appendChild(option);
    select.value = value;
    select.style.display = "none";
  }

  const removeOption = (select, value) => {
    let optionToRemove = select.querySelector('option[value="' + value + '"]');
    select.removeChild(optionToRemove);
    select.value = '';
    select.style.display = "block";
  }

  // Alerta de motivo de consulta
  const viewAlert = () => {
    let formElement = document.getElementById(
      formId + "_id_consultation_reason"
    );
    let alertElement = document.createElement("h5");
    alertElement.id = "alert-clinic";
    alertElement.textContent =
      "Servicio exclusivo para la clínica situada en C/ Villa de Marín, 7 (Madrid)";
    formElement.appendChild(alertElement);
  };

  const removeAlert = () => {
    let alertElement = document.getElementById("alert-clinic");
    if (alertElement) alertElement.remove();
  };

  const load = () => {
    getIdConsultationReason();
    getIdClinic();

    createButtons();
    hiddenDateTime();

    let inputSelectTime = document.getElementById(inputId + "_time_select");
    let inputSelectDate = document.getElementById(inputId + "_date");
    let inputSelectPvDateTime = document.getElementById(
      inputId + "_pv_date_time"
    );

    inputSelectTime.addEventListener(
      "change",
      (event) => {
        let value = inputSelectTime.options[inputSelectTime.selectedIndex].text;
        inputSelectPvDateTime.value = inputSelectDate.value + " " + value;
      },
      false
    );

    inputSelectDate.addEventListener(
      "change",
      (event) => {
        addFreeSlotsV1(event);
      },
      false
    );

    changeConsultationReason();
  };

  load();
  clean(0);
});
