//http://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=false
var map, geocoder, pesquisaCoord, pesquisaMarker, pesquisaAdress, pesquisaCoord, clickEm;

function pesquisarNaCidade(morada) {
    for (var i = 0; i < morada.length; i++) {
        if (morada[i].types[0] == "locality") {
            city = morada[i].long_name;
            page = 1;
            console.log(city);
            clickEm.innerHTML = city;
            $searchUsers();
        }
    }
}

function fazAlgoComCoordenadas(e) {
    console.log("click: " + e.latLng.lat() + ', ' + e.latLng.lng());
    getAddress(e.latLng, pesquisarNaCidade);
    if (pesquisaMarker) {
        pesquisaMarker.setPosition(e.latLng);
    } else {
        pesquisaMarker = new google.maps.Marker({
            map: map,
            position: e.latLng,

        });
    }
}

function initMap() {
    geocoder = new google.maps.Geocoder();

    map = new google.maps.Map(
        document.getElementById('mapa'), {
            zoom: 6,
            center: {
                lat: 39.399851,
                lng: -8.2944944
            },
            styles: mapStyle
        }
    );
    //getCoord("coimbra");
    //getAddress(40.2286755,-8.5563584);
    google.maps.event.addListener(map, 'click', fazAlgoComCoordenadas);
}

function localizar(loc, callBack) {
    geocoder.geocode(loc, function (resultado, estado) {
        if (estado == google.maps.GeocoderStatus.OK) {
            var r = resultado[0];
            console.log(r);
            var cb;
            if (loc.address) cb = r.geometry.location; //vai buscar coornadas 
            else cb = r.address_components; // devolve obj com informaçoes da morada
            callBack(cb);
        } else {
            console.log("Erro ao encontrar localização da terrinha pedida");
        }
    });
}

function getAddress(latLng, callBack) {
    var loc = {
        'latLng': latLng
    };
    localizar(loc, callBack);
}

function getCoord(morada, callBack) {
    var loc = {
        'address': morada
    };
    localizar(loc, callBack);
}

window.onload = function () {
    clickEm = document.getElementById("clickEm");
}