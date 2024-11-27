const cardsPatients = [
  {
    name: "Paciente Mario Luiz",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    lat: -23.5075,
    lng: -47.4535,
    bloodType: "O+",
    phone: "(11) 98765-4321",
  },
  {
    name: "Paciente Roberto A. C.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    lat: -23.5089,
    lng: -47.4602,
    bloodType: "A-",
    phone: "(11) 98765-1234",
  },
  {
    name: "Paciente Milton J. D. S.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    lat: -23.5042,
    lng: -47.4583,
    bloodType: "B+",
    phone: "(11) 98765-5678",
  },
  {
    name: "Paciente André L. D.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    lat: -23.5042,
    lng: -47.4583,
    bloodType: "B+",
    phone: "(11) 98765-5678",
  },
  {
    name: "Paciente Fernando D. S.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    lat: -23.5042,
    lng: -47.4583,
    bloodType: "B+",
    phone: "(11) 98765-5678",
  },
  {
    name: "Paciente Lucas R. F. C.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    lat: -23.5042,
    lng: -47.4583,
    bloodType: "B+",
    phone: "(11) 98765-5678",
  },
];

function createSingleSolicitationCard({ name, bloodType, image }) {
  const cardsContainers = document.querySelector("#solicitationsCards");
  const card = document.createElement("div");

  card.setAttribute(
    "class",
    "card border-0 shadow-sm rounded-3 p-3 d-flex flex-row align-items-center mb-3 bg-light"
  );

  const imageElement = document.createElement("img");

  imageElement.setAttribute("class", "rounded-circle me-3");
  imageElement.setAttribute("src", image);
  imageElement.setAttribute("alt", "Foto do Paciente");
  imageElement.setAttribute(
    "style",
    "max-width: 80px; max-height: 80px; width: 100%; height: 100%; object-fit: cover;"
  );

  card.appendChild(imageElement);

  const textContainer = document.createElement("div");

  textContainer.setAttribute("class", "flex-grow-1");

  const nameElement = document.createElement("h5");
  nameElement.setAttribute("class", "mb-1 fw-bold");

  nameElement.textContent = name;

  const bloodTypeElement = document.createElement("p");

  bloodTypeElement.setAttribute("class", "mb-0 text-danger");

  const icon = document.createElement("i");

  icon.setAttribute("class", "bi bi-droplet");

  bloodTypeElement.appendChild(icon);

  bloodTypeElement.innerHTML += bloodType;

  textContainer.appendChild(nameElement);
  textContainer.appendChild(bloodTypeElement);

  card.appendChild(textContainer);

  const button = document.createElement("button");

  button.setAttribute("class", "btn btn-danger px-4");
  button.setAttribute("onclick", "window.location.href='visualizar-solicitacao.html';");
  button.textContent = "Quero doar";

  card.appendChild(button);
  cardsContainers.appendChild(card);
}

function createCards() {
  const cardsContainers = document.querySelector("#solicitationsCards");

  if (cardsPatients.length > 5) {
    cardsContainers.style.overflowY = `scroll`;
  }

  for (const patient of cardsPatients) {
    createSingleSolicitationCard({
      name: patient.name,
      image: patient.image,
      bloodType: patient.bloodType,
    });
  }
}

createCards();
