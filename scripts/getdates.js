document.addEventListener("DOMContentLoaded", () => {
    // Menu Hambúrguer Responsivo
    const menuBtn = document.querySelector("#menu-btn");
    const navMenu = document.querySelector("#nav-menu");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            menuBtn.textContent = navMenu.classList.contains("open") ? "✕" : "☰";
        });
    }

    // Ano Atual no Rodapé
    const currentYearSpan = document.querySelector("#currentyear");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Última Modificação do Documento
    const ultimaModificacaoP = document.querySelector("#ultimaModificacao");
    if (ultimaModificacaoP) {
        ultimaModificacaoP.textContent = `Última Modificação: ${document.lastModified}`;
    }
});