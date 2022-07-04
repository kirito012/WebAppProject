        let menu = document.querySelector(".menuToggle");
        let navigation = document.querySelector(".navigation");
        menu.onclick = () =>{
            menu.classList.toggle("active");
            if(menu.className == "menuToggle active"){
                navigation.classList.toggle("active");
            }
            else if(menu.className == "menuToggle"){
                navigation.classList.toggle("active");
                adding.classList.remove("active");
                box.style.animationName = "boxRemove";
                box.classList.remove("active");
                devices.style.animationName = "boxRemove1";
                devices.classList.remove("active");
            }
        }

        function removeAll(){
            header.classList.add("active");
            toggle.classList.add("active");
            menu.classList.remove("active");
            navigation.classList.toggle("active");
            adding.classList.remove("active");
            box.style.animationName = "boxRemove";
            box.classList.remove("active");
            devices.style.animationName = "boxRemove1";
            devices.classList.remove("active");
        }
        

        let toggle = document.querySelector(".menuToggle1");
        let header = document.querySelector("header");
        let subt = document.querySelector(".subtitle.change")
        toggle.onclick = () => {
            header.classList.toggle("active");
            toggle.classList.toggle("active");
            if(header.className == ""){
                subt.innerHTML = "Chiudi menù";
            }else{
                subt.innerHTML = "Apri menù";
                menu.classList.remove("active");
                navigation.classList.add("active");
                box.style.animationName = "boxRemove";
                box.classList.remove("active");
                adding.classList.remove("active");
                devices.style.animationName = "boxRemove1";
                devices.classList.remove("active");
            }
        }

        let opened= false;
        let openedTwice = false;

        let adding = document.querySelector(".content");
        let add = document.querySelector(".add");
        let box = document.querySelector(".machines");
        adding.onclick = () => {
            box.classList.toggle("active");
            openedTwice = true;
            if(box.className == "machines active"){
                box.style.animationName = "boxReveal";
                if(opened){
                    devices.style.animationName = "boxRemove1";
                    devices.classList.remove("active");
                }
                adding.classList.toggle("active");
            }else if(box.className == "machines"){
                box.style.animationName = "boxRemove";
                adding.classList.toggle("active");
            }
        }


        let devicesToggle = document.querySelector(".content.c1");
        let devices = document.querySelector(".devices")
        devicesToggle.onclick = () => {
            devices.classList.toggle("active");
            opened = true;
            if(devices.className == "devices active"){
                devices.style.animationName = "boxReveal1";
                if(openedTwice){
                    box.style.animationName = "boxRemove";
                    box.classList.remove("active");
                    adding.classList.remove("active");
                }
            }else if(devices.className == "devices"){
                devices.style.animationName = "boxRemove1";
            }
        }