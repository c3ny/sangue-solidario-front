// Script para exibir campos dinamicamente com base no tipo de usuário selecionado
document.getElementById('userType').addEventListener('change', function () {
    const fisicaFields = document.getElementById('fisicaFields');
    const juridicaFields = document.getElementById('juridicaFields');
    const commonFields = document.getElementById('commonFields');
    
    if (this.value === 'fisica') {
        fisicaFields.classList.remove('d-none');
        juridicaFields.classList.add('d-none');
    } else if (this.value === 'juridica') {
        juridicaFields.classList.remove('d-none');
        fisicaFields.classList.add('d-none');
    }
    commonFields.classList.remove('d-none');
});


// Função para rolar ao topo
document.getElementById("backToTopBtn").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mostra/esconde o botão conforme a rolagem
window.addEventListener("scroll", () => {
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (window.scrollY > 200) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
});