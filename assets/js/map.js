const cityInput = document.getElementById("cityInput");
const cityInputMobile = document.getElementById("cityInputMobile");
const searchCityBtn = document.getElementById("searchCityBtn");
const searchCityBtnMobile = document.getElementById("searchCityBtnMobile");
const suggestionsList = document.getElementById("suggestions");

// Função para buscar sugestões de cidades no Brasil
function fetchCitySuggestions(query, isMobile = false) {
    fetch(`https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=BR&format=json&addressdetails=1&accept-language=pt-BR&limit=5`)
        .then(response => response.json())
        .then(data => {
            suggestionsList.innerHTML = ""; // Limpa as sugestões anteriores
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
            suggestionsList.style.display = data.length > 0 ? "block" : "none"; // Exibe a lista se houver resultados
        })
        .catch(error => console.error("Erro ao buscar sugestões de cidade:", error));
}

// Função para selecionar a cidade da lista de sugestões
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
    map.setView([latitude, longitude], 13); // Centraliza o mapa na cidade selecionada
}

// Evento de input para buscar sugestões conforme o usuário digita
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

// Ícones personalizados
const userIcon = L.icon({
    iconUrl: './assets/images/icons/pin-user.svg',
    iconSize: [50, 50],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const patientIcon = L.icon({
    iconUrl: './assets/images/icons/pin-paciente.svg', // Ícone para os pacientes
    iconSize: [50, 50],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

const hospitalIcon = L.icon({
    iconUrl: './assets/images/icons/pin-hospital.svg', // Ícone para os hospitais
    iconSize: [50, 50],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// Inicialização do mapa com visualização do Brasil
let map = L.map('map').setView([-14.235004, -51.92528], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Marcadores de pacientes com dados específicos
const patients = [
    { name: "Paciente Ana M. C.", lat: -23.5075, lng: -47.4535, bloodType: "O+", phone: "(11) 98765-4321" },
    { name: "Paciente Roberto A. C.", lat: -23.5089, lng: -47.4602, bloodType: "A-", phone: "(11) 98765-1234" },
    { name: "Paciente Milton J. D. S.", lat: -23.5042, lng: -47.4583, bloodType: "B+", phone: "(11) 98765-5678" }
];

patients.forEach(patient => {
    L.marker([patient.lat, patient.lng], { icon: patientIcon }).addTo(map)
        .bindPopup(`<b>${patient.name}</b><br>Tipo Sanguíneo: ${patient.bloodType}<br>Contato: ${patient.phone}`);
});

// Marcadores de hospitais
const hospitais = [
    { name: "Hospital Central", lat: -23.5069, lng: -47.4522 },
    { name: "Hospital Regional", lat: -23.5093, lng: -47.4551 },
    { name: "Hospital São José", lat: -23.5031, lng: -47.4598 }
];

hospitais.forEach(hospital => {
    L.marker([hospital.lat, hospital.lng], { icon: hospitalIcon }).addTo(map)
        .bindPopup(`<b>${hospital.name}</b><br>Hospital próximo à sua localização.`);
});

// Tentativa de obter localização do usuário
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            map.setView([position.coords.latitude, position.coords.longitude], 13);
            L.marker([position.coords.latitude, position.coords.longitude], { icon: userIcon }).addTo(map)
                .bindPopup("Você está aqui").openPopup();
        },
        () => {
            map.setView([-14.235004, -51.92528], 4); // Exibe o Brasil se não for permitido
        }
    );
} else {
    map.setView([-14.235004, -51.92528], 4); // Exibe o Brasil se geolocalização não for suportada
}

// Ajusta o mapa com base na pesquisa do usuário
function searchCity(query) {
    if (query.length > 2) {
        fetch(`https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=BR&format=json&addressdetails=1&accept-language=pt-BR&limit=1`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    map.setView([lat, lon], 13); // Centraliza o mapa na cidade pesquisada
                } else {
                    alert("Cidade ou estado não encontrado.");
                }
            })
            .catch(error => console.error("Erro ao buscar coordenadas:", error));
    } else {
        alert("Por favor, digite o nome de uma cidade ou estado.");
    }
}

// Eventos para os botões de pesquisa
searchCityBtn.addEventListener("click", () => searchCity(cityInput.value));
searchCityBtnMobile.addEventListener("click", () => searchCity(cityInputMobile.value));

// Oculta a lista de sugestões ao clicar fora do campo de entrada
document.addEventListener("click", (e) => {
    if (!cityInput.contains(e.target) && !suggestionsList.contains(e.target)) {
        suggestionsList.style.display = "none";
    }
});