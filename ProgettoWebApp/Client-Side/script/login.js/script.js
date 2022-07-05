let registerForm = document.querySelector(".register");
let registerActivator = document.querySelector("#enableRegister");
registerActivator.addEventListener("change", () => {
    if(registerActivator.checked){
        registerForm.classList.add("active");
    }else if(!registerActivator.checked){
        registerForm.classList.remove("active");
    }
});

let params = new URLSearchParams(window.location.search);
let error = {   
    wrongPassword: "Credenziali errate o account inesistente",
    missingInputs: "Dati inseriti non validi",
    emailExists: "Account già esistente",
    dateIncorrect: "Data di nascita non valida",
    passwordLenght: "Lunghezza password non corretta",
    missingSession: "Devi essere loggato per accedere",
    repeatMissType: "Le password non corrispondono",
    sessionNotValid: "La sessione non è valida",
    emailNotCorrect: "Formato dell'email non corretto"
}
let errorMassage = document.querySelector(".error");

if(params.has('error')){
    for(let key in error){
        if(params.get("error") == key){
            errorMassage.innerHTML = error[key];
        }
    }
}

let hide = document.querySelector(".hide");
let line = document.querySelector(".line");
let password = document.querySelector(".password")
hide.addEventListener("click", () => {
    line.classList.toggle("active");
    if(line.className == "line"){
        password.type = "text";
    }else if(line.className == "line active"){
        password.type = "password";
    }
});