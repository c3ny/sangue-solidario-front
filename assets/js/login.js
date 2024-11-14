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