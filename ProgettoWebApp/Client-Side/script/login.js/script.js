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


let focusWrites = document.querySelectorAll(".focus");
let inputs = document.querySelectorAll(".input");

let classes = ["focus f1", "focus f2", "focus f3", "focus f4", "focus f5", "focus f6", "focus f7", "focus f8"];

function textTransition(){
    for(let key in classes){
        if(this.className == classes[key]){
            inputs[key].focus();
        }
    }
}
focusWrites.forEach((item) => {
    item.addEventListener("click", textTransition);
});