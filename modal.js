function editNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

// DOM Elements
const modalbg = document.querySelector(".bground");                 //La modale
const modalBtn = document.querySelectorAll(".modal-btn");           //Bouton qui ouvre la modale
const closeBtn = document.querySelectorAll(".close")                //Bouton qui ferme la modale
const inputs = document.querySelectorAll(".text-control")           //Les champs inputs de tout type
const radios = document.querySelectorAll('[type="radio"]')          //Les boutons radio
const checkBoxes = document.querySelectorAll('[type="checkbox"]')   //les checkboxes
const reservationForm = document.querySelector("#reserve")          //Le formulaire entier
const successScreen = document.querySelector("#success-screen")     //La page de succès si le formulaire est accepté
const btnClose = document.querySelector("#btn-close")               //Le bouton pour fermer la modale sur la page succès

// Submit form event
reservationForm.addEventListener("submit", formSubmit);


//////////////////////
//Toggle modal
//////////////////////

// launch modal event
modalBtn.forEach((btn) => btn.addEventListener("click", launchModal));
// Close modal event
closeBtn.forEach((btn) => btn.addEventListener("click", closeModal));
btnClose.addEventListener("click", closeModal);

// launch modal form
function launchModal() {
  reservationForm.reset()
  successScreen.classList.remove('show');
  modalbg.style.display = "flex";
}

// Close modal
function closeModal() {
  userForm = emptyUserForm;
  modalbg.classList.add("fade-out");
  setTimeout(() => {
    modalbg.classList.remove("fade-out");
    modalbg.style.display = "none";
  }, 200);
}

//////////////////////
// Form validation
//////////////////////
// Inputs changes listeners
inputs.forEach(element => element.addEventListener("input", inputChange));        //Ecoute les changements sur les éléments inputs (text, number, etc...)
radios.forEach(element => element.addEventListener('change', radioChange));       //Ecoute les changements sur les bouton radio
checkBoxes.forEach(element => element.addEventListener('change', boxChanges));    //Ecoute les changements sur les checkboxes

//On stocke les valeurs des différents champs du formulaire dans l'objet userForm
let userForm = {
  first: null,
  last: null,
  email: null,
  birthdate: null,
  quantity: null,
  location: null,
  cgu: false,
  newsletter: true
}

const emptyUserForm = { ...userForm }

// Handle inputs changes listeners
function inputChange(e) {

  const fieldName = this.getAttribute("name");
  userForm[fieldName] = e.target.value

}

function radioChange(e) {
  userForm.location = e.target.value
}

function boxChanges(e) {

  //Déterminer quelle checkbox est activée
  const fieldName = this.getAttribute("id")
  if (fieldName === "checkbox1") {
    userForm.cgu = this.checked
  } else if (fieldName === "checkbox2") {
    userForm.newsletter = this.checked
  }

}

// Si le formulaire est valide, on affiche la page de succès
function formSubmit(e) {
  e.preventDefault()

  if (validateForm()) {
    successScreen.classList.add('show')
  }

}

//Les validateur ci-dessous renvoie true si toutes les règles de validation est respéectée
function validateForm() {

  let validate = []

  for (const key in userForm) {

    switch (key) {
      case "first": validate.push(validateIdentity("first", userForm.first))
        break;
      case "last": validate.push(validateIdentity("last", userForm.last))
        break;
      case "email": validate.push(validateMail(userForm.email))
        break;
      case "birthdate": validate.push(validateBirthdate(userForm.birthdate))
        break;
      case "quantity": validate.push(validateQuantity(userForm.quantity))
        break;
      case "location": validate.push(validateLocation(userForm.location))
        break;
      case "cgu": validate.push(validateCgu(userForm.cgu))
        break;

      default: validate.push("unknown")
        break;
    }

  }

  if (validate.includes(false)) {
    return false
  } else {
    return true
  }

}


function validateIdentity(fieldName, value) {

  const elementId = fieldName + "-error"

  if (value && value.length >= 2) {
    document.getElementById(elementId).classList.remove("show")
    return true
  } else {
    document.getElementById(elementId).classList.add("show")
    return false
  }

}

function validateMail(value) {

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(value)) {
    document.getElementById("email-error").classList.remove("show")
    return true
  } else {
    document.getElementById("email-error").classList.add("show")
    return false
  }

}

function validateBirthdate(value) {

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!value) {

    document.getElementById("birthdate-error").classList.add("show")
    return false

  } else if (!dateRegex.test(value)) {

    document.getElementById("birthdate-error").classList.add("show")
    return false

  } else {

    const dateArray = value.split('-')
    const dateObject = new Date(dateArray[0], dateArray[1], dateArray[2])
    const birthTimestamp = dateObject.getTime()

    const todayTimestamp = Date.now()

    const timestampDistance = todayTimestamp - birthTimestamp
    const yearDistance = timestampDistance / (1000 * 60 * 60 * 24 * 365.25);

    if (yearDistance < 18) {

      document.getElementById("birthdate-error").classList.remove("show")
      document.getElementById("age-error").classList.add("show")
      return false

    } else {

      document.getElementById("birthdate-error").classList.remove("show")
      document.getElementById("age-error").classList.remove("show")
      return true

    }

  }

}

function validateQuantity(value) {

  if (value === null || Number(value) === NaN) {
    document.getElementById("quantity-error").classList.add("show")
    return false
  } else {
    document.getElementById("quantity-error").classList.remove("show")
    return true
  }

}

function validateLocation(value) {

  if (!value) {
    document.getElementById("location-error").classList.add("show")
    return false
  } else {
    document.getElementById("location-error").classList.remove("show")
    return true
  }

}

function validateCgu(value) {

  if (value === false) {
    document.getElementById("cgu-error").classList.add("show")
    return false
  } else {
    document.getElementById("cgu-error").classList.remove("show")
    return true
  }

}
