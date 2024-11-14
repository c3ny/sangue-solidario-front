const cityInput = document.getElementById("cityInput");
const cityInputMobile = document.getElementById("cityInputMobile");
const searchCityBtn = document.getElementById("searchCityBtn");
const searchCityBtnMobile = document.getElementById("searchCityBtnMobile");
const suggestionsList = document.getElementById("suggestions");

let map;
let userPositionSet = false;

// Função para inicializar o mapa na div correta
function initializeMap() {
    if (map) {
        map.remove();
    }

    const mapElement = window.innerWidth < 1006 ? document.getElementById("map-mobile") : document.getElementById("map");
    map = L.map(mapElement).setView([-14.235004, -51.92528], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;
                
                // Define os limites para incluir o usuário e os marcadores próximos
                const bounds = L.latLngBounds([[userLat, userLon]]);
                
                // Adiciona o marcador do usuário e expande os limites para incluir o marcador
                L.marker([userLat, userLon], {
                    icon: L.icon({
                        iconUrl: './assets/images/icons/pin-user.svg',
                        iconSize: [50, 50],
                        iconAnchor: [20, 40],
                        popupAnchor: [0, -40]
                    })
                }).addTo(map).bindPopup("Você está aqui").openPopup();
                
                userPositionSet = true;
                
                // Adiciona os marcadores de pacientes e hospitais e expande os limites para incluí-los
                addMarkers(bounds);

                // Ajusta o zoom para exibir todos os pontos dentro dos limites
                map.fitBounds(bounds);
            },
            () => {
                // Exibe o Brasil se o usuário não permitir a localização
                addMarkers(); // Adiciona os marcadores padrão se a localização do usuário não estiver disponível
                map.setView([-14.235004, -51.92528], 4);
            }
        );
    } else {
        addMarkers(); // Adiciona os marcadores padrão
        map.setView([-14.235004, -51.92528], 4);
    }
}

// Função para adicionar marcadores e definir os limites
function addMarkers(bounds = L.latLngBounds()) {
    const patientIcon = L.icon({
        iconUrl: './assets/images/icons/pin-paciente.svg',
        iconSize: [50, 50],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });

    const hospitalIcon = L.icon({
        iconUrl: './assets/images/icons/pin-hospital.svg',
        iconSize: [50, 50],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });

    const patients = [
        { name: "Paciente Ana M. C.", lat: -23.5075, lng: -47.4535, bloodType: "O+", phone: "(11) 98765-4321" },
        { name: "Paciente Roberto A. C.", lat: -23.5089, lng: -47.4602, bloodType: "A-", phone: "(11) 98765-1234" },
        { name: "Paciente Milton J. D. S.", lat: -23.5042, lng: -47.4583, bloodType: "B+", phone: "(11) 98765-5678" }
    ];

    patients.forEach(patient => {
        const marker = L.marker([patient.lat, patient.lng], { icon: patientIcon }).addTo(map)
            .bindPopup(`<b>${patient.name}</b><br>Tipo Sanguíneo: ${patient.bloodType}<br>Contato: ${patient.phone}`);
        bounds.extend(marker.getLatLng()); // Expande os limites para incluir o marcador
    });

    const hospitais = [
        { name: "Hospital Central", lat: -23.5069, lng: -47.4522 },
        { name: "Hospital Regional", lat: -23.5093, lng: -47.4551 },
        { name: "Hospital São José", lat: -23.5031, lng: -47.4598 }
    ];

    hospitais.forEach(hospital => {
        const marker = L.marker([hospital.lat, hospital.lng], { icon: hospitalIcon }).addTo(map)
            .bindPopup(`<b>${hospital.name}</b><br>Hospital próximo à sua localização.`);
        bounds.extend(marker.getLatLng()); // Expande os limites para incluir o marcador
    });
}

// Inicializa o mapa ao carregar a página
initializeMap();
window.addEventListener("resize", initializeMap);

// Funções para busca e interação com o mapa
function fetchCitySuggestions(query, isMobile = false) {
    fetch(`https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=BR&format=json&addressdetails=1&accept-language=pt-BR&limit=5`)
        .then(response => response.json())
        .then(data => {
            suggestionsList.innerHTML = "";
            data.forEach((place) => {
                const { city, state } = place.address;
                if (city && state) {
                    const listItem = document.createElement("li");
                    listItem.classList.add("list-group-item", "list-group-item-action");
                    listItem.textContent = `${city}, ${state}`;
                    listItem.addEventListener("click", () => selectCity(place, isMobile));
                    suggestionsList.appendChild(listItem);
                }
            });
            suggestionsList.style.display = data.length > 0 ? "block" : "none";
        })
        .catch(error => console.error("Erro ao buscar sugestões de cidade:", error));
}

function selectCity(place, isMobile = false) {
    const { city, state } = place.address;
    if (isMobile) {
        cityInputMobile.value = `${city}, ${state}`;
    } else {
        cityInput.value = `${city}, ${state}`;
    }
    suggestionsList.style.display = "none";
    const latitude = place.lat;
    const longitude = place.lon;
    map.setView([latitude, longitude], 13);
}

cityInput.addEventListener("input", () => {
    const query = cityInput.value;
    if (query.length > 2) {
        fetchCitySuggestions(query);
    } else {
        suggestionsList.style.display = "none";
    }
});

cityInputMobile.addEventListener("input", () => {
    const query = cityInputMobile.value;
    if (query.length > 2) {
        fetchCitySuggestions(query, true);
    } else {
        suggestionsList.style.display = "none";
    }
});

function searchCity(query) {
    if (query.length > 2) {
        fetch(`https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=BR&format=json&addressdetails=1&accept-language=pt-BR&limit=1`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    map.setView([lat, lon], 13);
                } else {
                    alert("Cidade ou estado não encontrado.");
                }
            })
            .catch(error => console.error("Erro ao buscar coordenadas:", error));
    } else {
        alert("Por favor, digite o nome de uma cidade ou estado.");
    }
}

searchCityBtn.addEventListener("click", () => searchCity(cityInput.value));
searchCityBtnMobile.addEventListener("click", () => searchCity(cityInputMobile.value));

document.addEventListener("click", (e) => {
    if (!cityInput.contains(e.target) && !suggestionsList.contains(e.target)) {
        suggestionsList.style.display = "none";
    }
});