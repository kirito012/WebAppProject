let modes = ["collegamento", "assettox", "assettoz", "assettoset", "assettoreg"];

export let updateData = (data, oldValue, dataSelected, setted, getLocation, gaugeTextAnimation, $scope, $http, map, marker) => {
    if(data.heartbeat){
        document.querySelector(".s1 span").innerHTML = "Online";
        if(data.display_line_1){
            for(let key in modes){
                if(data.display_line_1.toLowerCase().replaceAll(" ", "") == modes[key]){
                    document.querySelector(".s2 span").innerHTML = data.display_line_1;
                }
            }
        }
    }else{
        document.querySelector(".s1 span").innerHTML = "Offline";
    }

    if(data.board_temperature){
        document.querySelector(".b1").style.height = data.board_temperature * 2 + "px";
        document.querySelector(".b1 span").innerHTML = data.board_temperature + "°";
        if(dataSelected == 1){
            if(oldValue != data.board_temperature){
                let value = 180 - (data.board_temperature * 1.8);
                document.querySelector(".gaugeIndicator").style.transform = "rotate(-" + value + "deg)";
                gaugeTextAnimation(oldValue, data.board_temperature);
                oldValue = data.board_temperature;
                document.querySelector(".gaugeContainer h4").innerHTML = "Temperatura";
            }
        }
    }
    if(data.cpu_usage_average){
        document.querySelector(".b2").style.height = data.cpu_usage_average * 2 + "px";
        document.querySelector(".b2 span").innerHTML = data.cpu_usage_average + "%";
        if(dataSelected == 2){
            if(oldValue != data.cpu_usage_average){
                let value = 180 - (data.cpu_usage_average * 1.8);
                document.querySelector(".gaugeIndicator").style.transform = "rotate(-" + value + "deg)";
                gaugeTextAnimation(oldValue, data.cpu_usage_average);
                oldValue = data.cpu_usage_average;
                document.querySelector(".gaugeContainer h4").innerHTML = "Uso CPU";
            }
        }
    }
    if(data.free_storage){
        document.querySelector(".b3").style.height = data.free_storage * 2 + "px";
        document.querySelector(".b3 span").innerHTML = data.free_storage + "%";
        if(dataSelected == 3){
            if(oldValue != data.free_storage){
                let value = 180 - (data.free_storage * 1.8);
                document.querySelector(".gaugeIndicator").style.transform = "rotate(-" + value + "deg)";
                gaugeTextAnimation(oldValue, data.free_storage);
                oldValue = data.free_storage;
                document.querySelector(".gaugeContainer h4").innerHTML = "Memoria libera";
            }
        }
    }
    if(data.free_memory){
        document.querySelector(".b4").style.height = data.free_memory * 2 + "px";
        document.querySelector(".b4 span").innerHTML = data.free_memory + "%";
        if(dataSelected == 4){
            if(oldValue != data.free_memory){
                let value = 180 - (data.free_memory * 1.8);
                document.querySelector(".gaugeIndicator").style.transform = "rotate(-" + value + "deg)";
                gaugeTextAnimation(oldValue, data.free_memory);
                oldValue = data.free_memory;
                document.querySelector(".gaugeContainer h4").innerHTML = "RAM libera";
            }
        }
    }
    if(map){
        if(data.location && !setted){
            getLocation($scope, $http, data.location, ($scope, coordinates) => {
                map.setView([coordinates.data[0].latitude, coordinates.data[0].longitude], 12);
                marker = L.marker([coordinates.data[0].latitude, coordinates.data[0].longitude]).addTo(map)
            })
            setted = true;
        }
    }
}