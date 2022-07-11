        let menuToggle = document.querySelector(".menu");
        let header = document.querySelector("header");
        menuToggle.addEventListener("click", () => {
            header.classList.toggle("active");
        });
        let list = document.querySelectorAll(".link");
        
        function activeLink(){
            list.forEach((element) => {
                element.classList.remove("active");
                this.classList.add("active");
            });
        }

        list.forEach((item) => {
            item.addEventListener("click", activeLink);
        });




        let radioButton = document.querySelectorAll(".radio");
        let items = document.querySelectorAll(".item");

        let name = ["radio addDevice", "radio showDevice", "radio showTopics"];


        function changeDisplay(){
            items.forEach((element) => {
                element.classList.remove("active");
            });
            radioButton.forEach((element, i) => {
                for(let key in name){
                    if(this.className == name[key]){
                        items[key].classList.add("active");
                    }
                }
            });
        }
        
        radioButton.forEach((item) => {
            item.addEventListener("change", changeDisplay);
        });





        let inputBox = document.querySelectorAll(".inputBox");
        let delay = 1;
        inputBox.forEach((element, i) => {
            inputBox[i].style.transitionDelay = delay/16 + "s";
            delay++;
        });




        let focusWrites = document.querySelectorAll(".focus");
        let inputs = document.querySelectorAll(".input");

        let classes = ["focus f1", "focus f2", "focus f3"];

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




        let input = document.querySelector(".searchInput");
        let focusWrite = document.querySelector(".focus.f4");

        focusWrite.addEventListener("click", () => {
            input.focus();
        });




        let labels = document.querySelectorAll(".topicLabel");
        let topicCheck = document.querySelectorAll(".checkbox");

        let dalayLabels = 1;

        topicCheck.forEach((element, i) => {
            element.setAttribute("id", "i" + i);
            labels[i].htmlFor = "i" + i;
        });

        if(labels.length > 15){
            for(let i = 0; i < 15; i++){
                labels[i].style.transitionDelay = dalayLabels/32 + "s";
                delayLabels++;
            }
        }else{
            labels.forEach((element, i) => {
                labels[i].style.transitionDelay = dalayLabels/32 + "s";
                dalayLabels++;
            });
        }






        let profileToggle = document.querySelector(".settingContainer");
        let profileSettings = document.querySelector(".personal");

        profileToggle.addEventListener("click", () => {
            profileSettings.classList.toggle("active");
        });