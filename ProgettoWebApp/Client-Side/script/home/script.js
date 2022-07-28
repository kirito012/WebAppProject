        let menuToggle = document.querySelector(".menu");
        let header = document.querySelector("header");
        menuToggle.addEventListener("click", () => {
            header.classList.toggle("active");
        });
        let list = document.querySelectorAll(".link");
        let indicator = document.querySelector(".indicator");
        
        function activeLink(){
            list.forEach((element) => {
                element.classList.remove("active");
                this.classList.add("active");
                indicator.classList.add("active");
            });
        }

        list.forEach((item) => {
            item.addEventListener("click", activeLink);
        });




        let radioButton = document.querySelectorAll(".radio");
        let items = document.querySelectorAll(".item");
        let navigation = document.querySelector(".navigation");


        let nameInputs = ["radio addDevice", "radio showDevice", "radio showTopics"];


        function changeDisplay(){
            items.forEach((element) => {
                element.classList.remove("active");
            });
            radioButton.forEach((element, i) => {
                for(let key in nameInputs){
                    if(this.className == nameInputs[key]){
                        items[key].classList.add("active");
                    }
                }
            });
        }
        
        radioButton.forEach((item) => {
            item.addEventListener("change", changeDisplay);
        });

        radioButton.forEach((item) => {
            item.addEventListener("click", () => {
                navigation.classList.add("active");
            });
        });


        let closeNavigation = document.querySelectorAll(".close.nav");


        let closeNav = () => {
            navigation.classList.remove("active");
            indicator.classList.remove("active");
        }

        closeNavigation.forEach((element) => {
            element.addEventListener("click", closeNav);
        });





        let focusWrites = document.querySelectorAll(".focus");
        let inputs = document.querySelectorAll(".input");

        let classes = ["focus f1", "focus f2", "focus f3", "focus f5", "focus f6", "focus f7", "focus f8"];

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


        let profileToggle = document.querySelector(".settingContainer");
        let profileSettings = document.querySelector(".personal");
        let profileRemove = document.querySelector(".notification");

        profileToggle.addEventListener("click", () => {
            profileSettings.classList.toggle("active");
        });

        profileRemove.addEventListener("click", () => {
            profileSettings.classList.remove("active");
        });


        
        let settigs1 = document.querySelector(".itemSetting.i1");
        let settigs2 = document.querySelector(".itemSetting.i2");

        let content1 = document.querySelector(".content.I1");
        let content2 = document.querySelector(".content.I2");


        settigs1.addEventListener("click", () =>{
            settigs2.classList.remove("active");
            settigs1.classList.toggle("active");
            content2.classList.remove("active");
            content1.classList.toggle("active");
        });

        settigs2.addEventListener("click", () =>{
            settigs1.classList.remove("active");
            settigs2.classList.toggle("active");
            content1.classList.remove("active");
            content2.classList.toggle("active");
        });





        let changeSettings = document.querySelector(".inputSettings");
        let inputToggle = document.querySelector(".settingsInfo");
        let closeChangeSettings = document.querySelector(".iconSettings");
        let submitValues = document.querySelector(".submitValues");

        inputToggle.addEventListener("click", () => {
            changeSettings.classList.add("active");
        });

        closeChangeSettings.addEventListener("click", () => {
            changeSettings.classList.remove("active");
        });

        submitValues.addEventListener("click", () => {
            setTimeout(() => {
                changeSettings.classList.remove("active");
            }, 100);
        });

  



        let pfpToggle = document.querySelector(".image");
        let pfpUpload = document.querySelector(".uploadPfp");
        let imgSettingsClose = document.querySelector(".imgSettings");
        let imgInput = document.querySelector(".upPfp");

        pfpToggle.addEventListener("click", () => {
            pfpUpload.classList.add("active");
        });

        imgSettingsClose.addEventListener("click", () => {
            pfpUpload.classList.remove("active");
        });

        imgInput.addEventListener("click", () => {
            setTimeout(() => {
                pfpUpload.classList.remove("active");
            }, 100);
        });


        let file = document.querySelector(".fileInput");
        let imgName = document.querySelector(".imgName");
        let iconImg = document.querySelector("ion-icon.iconRemove");
        let img = document.querySelector(".imgPfp");
        let reset = document.querySelector(".reset");

        file.addEventListener("change", () => {
            if(file.value != ""){
            imgName.innerHTML = file.files[0].name;
            const [files] = file.files;
            iconImg.style.display = "none";
            if(file){
                img.style.display = "flex";
                img.src = URL.createObjectURL(files);
            }
        }
        });

        reset.addEventListener("click", () => {
            file.value = "";
            imgName.innerHTML = "Carica la tua immagine";
            iconImg.style.display = "flex";
            img.style.display = "none";
            img.src = "#";
        });


        let pfpImg = document.querySelector(".pfp");


        export let fun = () => {
            pfpImg.src = "";
            setTimeout(() => {
                pfpImg.src = "/home/getProfilePicture";
            },1000);
        }





        let paramsHome = new URLSearchParams(window.location.search);
        let errorList = {   
            machineNameExceed: "Nome troppo lungo"
        }
        let errorMassageMachine = document.querySelector(".error");

        if(paramsHome.has('error')){
            for(let key in errorList){
                if(paramsHome.get("error") == key){
                    errorMassageMachine.innerHTML = errorList[key];
                }
            }
        }




        let select = document.querySelector(".select");
        let link2 = document.querySelector(".link.I2");
        select.addEventListener("click", () => {
            navigation.classList.add("active");
            items.forEach((element) => {
                element.classList.remove("active");
            });
            list.forEach((element) => {
                element.classList.remove("active");
                list[1].classList.add("active");
            });
            items[1].classList.add("active");
            radioButton[1].checked = true;
            indicator.classList.add("active");
        })


        import {index} from "./angular/main.js"

        let removeDevice = document.querySelector(".remove");
        export let alert = document.querySelector(".alert");
        removeDevice.addEventListener("click", () => {
            if(index != undefined){
                alert.classList.add("active");
            }
        });

        let undo = document.querySelector(".undo");
        undo.addEventListener("click", () => {
            alert.classList.remove("active");
        });




        let up = document.querySelector(".up");
        let dashboard = document.querySelector(".dashboard");
        dashboard.addEventListener("scroll", () => {
            let y = dashboard.scrollTop;
            if(y > 0){
                up.style.opacity = "1";
            }else if(y == 0){
                up.style.opacity = "0";
            }
        })




    export let tableNavigator = ($scope, max, refreshTable, nextPage, previusPage) => {

        let less = document.querySelector(".less");
        less.addEventListener("click", () => {
            let page = document.querySelector(".pages.active");
            page.classList.remove("active");
            let num = parseInt(page.className.slice(-1)) - 1;
            if(num == 0){
                if(previusPage){
                    let previusValue = parseInt(document.querySelector(".p1").innerHTML) - 1;
                    if(previusValue > 0){
                        previusPage($scope, previusValue);
                    }
                }
                num = 5;
            }
            let newPage = document.querySelector(".p" + num);
            newPage.classList.add("active");
            let pageIndex = parseInt(newPage.innerHTML);
            if(refreshTable){
                refreshTable($scope, pageIndex);
            }
        })


        let more = document.querySelector(".more");
        more.addEventListener("click", () => {
            let page = document.querySelector(".pages.active");
            page.classList.remove("active");
            let num = parseInt(page.className.substring(31, 32)) + 1;
            if(num == 6){
                if(nextPage){
                    let nextValue = parseInt(document.querySelector(".p5").innerHTML) + 1;
                    if(nextValue <= max){
                        nextPage($scope, nextValue);
                    }
                }
                num = 1;
            }
            let newPage = document.querySelector(".p" + num);
            newPage.classList.add("active");
            let pageIndex = parseInt(newPage.innerHTML);
            if(refreshTable){
                refreshTable($scope, pageIndex);
            } 
        })
    }

       

    export let indexUpdate = () => {
        let indexes = document.querySelectorAll(".itemNumber");
        let page = document.querySelector(".pages.active");
        indexes.forEach((element, i) => {
            if(page){
                setTimeout(() => {
                    element.innerHTML = (i+1) + (10 * parseInt(page.innerHTML-1));
                    console.log(page.innerHTML-1);
                }, 0);
            }else{
                setTimeout(() => {
                        element.innerHTML = (i+1);
                }, 0);
            }
        })
    }