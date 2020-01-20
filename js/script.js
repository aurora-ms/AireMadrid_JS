/**

 * @fileoverview Información climática y de contaminación de diferentes lugares de Madrid capital.


 * @version                               1.0.0


 * @author                 Aurora Moreno 


 *

        */


page.base('');


var ids = [];

const pollUrl = 'http://airemad.com/api/v1/pollution';

const weathUrl = 'http://airemad.com/api/v1/weather';

var selectecId = "";

pollData(pollUrl);


// function placeId() {
//     console.log("CONSEGUIDO");
// }





/**
 * getHandler() Clousure function, usada para ejecutar la lectura de datos independientemente de cada dirección.
 * @param  {number} i "Variable que itera sobre las diferentes direcciones"
 * @param  {Array} pollInfo "Datos de los diferentes lugares a traves de la api de airemad.com..."
 * @yields {function} Retorna una función anónima para permitir la individualidad de cada dirección al ser pulsadas
 */

function getHandler(i, pollInfo) {
    return function handler() {

        var pollutionInfo = document.createElement('div');
        var name = document.createElement("h2");
        name.innerText = pollInfo[i].name;

        pollutionInfo.appendChild(name);

        var state = pollInfo[i];
        selectecId = pollInfo[i].id;


        for (var dates in state) {
            if (dates !== "id" && dates !== "name") {
                var description = document.createElement("h3");
                description.innerText = state[dates].parameter + "(" + state[dates].abrebiation + ")";
                pollutionInfo.appendChild(description);

                var technique = document.createElement("p");
                technique.innerText = +state[dates].values[0].valor + "µg/m3 " + state[dates].technique;
                pollutionInfo.appendChild(technique);

            }

        }

        var prueba = document.getElementById('mainContent');
        prueba.removeChild(prueba.childNodes[1]);
        document.getElementById('mainContent').appendChild(pollutionInfo);

        weathData(weathUrl)


    };



}


/**
 * Usada para sacar los datos principales y los datos de contaminación 
 * @param  {string} pollUrl "Url utilizada para sacar los datos de las direcciones y los datos de polución"
 */
function pollData(pollUrl) {

    fetch(pollUrl)
        .then(res => res.json())
        .then(pollInfo => {

            for (let i in pollInfo) {
                ids.push(pollInfo[i].id);
                var spaceContent = document.createElement('div');
                spaceContent.setAttribute('class', 'indvContent');
                spaceContent.setAttribute('id', pollInfo[i].id);

                var namePlace = document.createElement('a');
                namePlace.setAttribute("href", "./estacion/" + pollInfo[i].id)
                namePlace.innerText = pollInfo[i].name;

                document.getElementById('content').appendChild(spaceContent);

                spaceContent.appendChild(namePlace);

                spaceContent.addEventListener("click", function () {
                    page('/estacion/:placeId', getHandler(i, pollInfo))
                }
                );

            }

        })

        .catch(error => console.error('error:', error));
}



/**
 * Función utilizada para sacar los datos relacionados con el clima
 * @param  {string} weathUrl "Url utilizada para sacar la información del clima"
 */
function weathData(weathUrl) {

    fetch(weathUrl)
        .then(res => res.json())

        .then(weathInfo => {
            for (let i = 0; i < weathInfo.length; i++) {
                if (selectecId === weathInfo[i].id) {
                    var weatherContent = document.createElement("div");
                    var weatherDescription = document.createElement("h3");

                    weatherDescription.innerText = weathInfo[i].list[0].weather[0].description;

                    weatherContent.appendChild(weatherDescription);
                    document.getElementById('mainContent').appendChild(weatherContent);

                    var dates = weathInfo[i].list[0].main;
                    console.log(weathInfo);

                    var iconPrin = document.createElement("i");
                    iconPrin.className = "owf owf-"+weathInfo[i].list[0].weather[0].id +" owf-5x owf-pull-left owf-border";

                    weatherDescription.appendChild(iconPrin);

                    for (let i in dates) {
                        if (i !== "temp_kf" && i !== "sea_level" && i !== "grnd_level") {
                            if (i === "temp" || i === "feels_like" || i === "temp_min" || i === "temp_max") {
                                var temp = document.createElement("p");
                                temp.innerText = i + " " + dates[i] + "°C";
                                weatherDescription.appendChild(temp);
                                console.log(i, dates[i] + "°C");
                            } else if (i === "humidity") {
                                var humidity = document.createElement("p");
                                humidity.innerText = "Humedad:" + " " + dates[i] + "%";
                                weatherDescription.appendChild(humidity);
                                console.log(i, dates[i] + "%");
                            } else if (i === "pressure") {
                                var pressure = document.createElement("p");
                                pressure.innerText = "Presión:" + " " + dates[i] + "psi";
                                weatherDescription.appendChild(pressure);
                                console.log(i, dates[i] + "psi");
                            }
                        }

                    };


                    var wind = document.createElement("p");
                    wind.innerText = "Viento " + weathInfo[i].list[0].wind.speed + "km/h " + weathInfo[i].list[0].wind.deg + "°";
                    weatherDescription.appendChild(wind);
                    console.log("Viento " + weathInfo[i].list[0].wind.speed + "km/h " + weathInfo[i].list[0].wind.deg + "°")


                    var futureWeather = weathInfo[i].list;




                }


            }


            var futureBox = document.createElement("div");

            document.getElementById('mainContent').appendChild(futureBox);
            var dias = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"];
            var fecha = new Date;

            var day = fecha.getUTCDay();

            console.log(dias[day]);

            for (let i = 0; i < futureWeather.length; i++) {
                var time = futureWeather[i].dt_txt.slice(11, 19);

                if (time === "00:00:00") {
                    var indvDate = futureWeather[i].dt_txt.slice(0, 10);
                    var indvDateBox = document.createElement("h4");
                    day++

                    indvDateBox.innerText = dias[day] + " " + indvDate;

                    var icon = document.createElement("i");
                    icon.className = "owf owf-"+futureWeather[i].weather[0].id +" owf-5x owf-pull-left owf-border";
                    futureBox.appendChild(icon);
                    futureBox.appendChild(indvDateBox);

                    var indTemp = document.createElement("h5");
                    indTemp.innerText = futureWeather[i].main.temp + futureWeather[i].main.temp_max;
                    futureBox.appendChild(indTemp);

                    console.log(futureWeather[i]);

                }
            }
        })
        .catch(error => console.error('error:', error));
};



/**
 * Función anonima utilizada para el buscador por nombre de la página.
 */
function buscador() {
    let input = document.getElementById('searchBox');
    let filter = input.value.toUpperCase();
    let cont = document.querySelectorAll('.indvContent');
    let name = document.querySelectorAll('.indvContent > h3');

    for (let i = 0; i < name.length; i++) {

        let txt = name[i].innerText.toUpperCase();

        if (txt.indexOf(filter) <= -1) {
            document.getElementById('content').removeChild(cont[i]);
        }

    }
    if (filter === '') {
        document.getElementById('content').innerText = '';
        pollData(pollUrl);
    }
}

document.getElementById('searchBox').addEventListener('keyup', buscador);

page();