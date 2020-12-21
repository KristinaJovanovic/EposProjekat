const obavestenje = document.querySelector(".notification");
const ikonica = document.querySelector(".weatherIcon");
const temperatura = document.querySelector(".temperatureValue p");
const vreme = document.querySelector(".temperatureDescription p");
const lokacija = document.querySelector(".location p");

const weather = {};

let defaultVal = [0, 0]

var mymap = L.map('mapid').setView(defaultVal, 3);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic3RlZmFuOTgiLCJhIjoiY2tpeXpyOXBnMXYwZDJxbXUzdnExc2lodCJ9.XBUurZ6SOqu8-jcxXEphog'
}).addTo(mymap);
var markers = new L.FeatureGroup();
// let marker = L.marker(defaultVal).addTo(mymap);
mymap.on('click', onMapClick);


weather.temperature = {
    unit: "celsius"
}
const KELVIN = 273;

const kljuc = "24a8bff03e5710efbc1683db9868309a";

function prikaziVreme() {
     ikonica.innerHTML= `<img src="icons/${weather.iconId}.png"/>`;
    temperatura.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    vreme.innerHTML = weather.description;
    lokacija.innerHTML = `${weather.city}, ${weather.country}`;
    mymap.setView(defaultVal, 3)
}

function postaviPolozaj(position) {
    let geografskaSirina = position.coords.latitude;
    let geografskDuzina = position.coords.longitude;
    defaultVal = [geografskaSirina, geografskDuzina]
    setMarker()
    dajVreme(geografskaSirina, geografskDuzina);
}

function dajVreme(geografskaSirina, geografskDuzina) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${geografskaSirina}&lon=${geografskDuzina}&appid=${kljuc}`;

    fetch(api)
        .then(function(response) {
            let pod = response.json();
            console.log(pod);
            pod.then(function(data) {
                weather.temperature.value = Math.floor(data.main.temp - KELVIN);
                weather.description = data.weather[0].description;
                weather.iconId = data.weather[0].icon;
                weather.city = data.name;
                weather.country = data.sys.country;
                prikaziVreme();
            });
        })
}


function prikaziGresku(error) {
    obavestenje.style.display = "block";
    obavestenje.innerHTML = `<p>${error.message} </p>`;
}

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(postaviPolozaj, prikaziGresku);

} else {
    obavestenje.style.display = "block";
    obavestenje.innerHTML = "<p>Nije podrzana lokacija!</p>";

}




function celzijusUFarenhajt(temperature) {
    return (temperature * 9 / 5) + 32;

}
temperatura.addEventListener("click", function() {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit == "celsius") {
        let farenhajt = celzijusUFarenhajt(weather.temperature.value);
        farenhajt = Math.floor(farenhajt);

        temperatura.innerHTML = `${farenhajt}°<span>F</span>`;
        weather.temperature.unit = "farenhajt";
    } else {
        temperatura.innerHTML = `${weather.temperature.value}°<sapn>C</span>`;
        weather.temperature.unit = "celsius";
    }
});
let marker = null;

function onMapClick(e) {
    // L.marker(defaultVal).remove(mymap);
    defaultVal = [e.latlng.lat, e.latlng.lng];
    setMarker()
}

function setMarker() {
    mymap.removeLayer(markers);
    markers = new L.FeatureGroup();
    marker = L.marker(defaultVal)
    markers.addLayer(marker)
    mymap.addLayer(markers)
    dajVreme(defaultVal[0], defaultVal[1]);
}