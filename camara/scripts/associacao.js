document.addEventListener("DOMContentLoaded", () => {
    // 1. Menu Hambúrguer Responsivo
    const menuBtn = document.querySelector("#menu-btn");
    const navMenu = document.querySelector("#nav-menu");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("open");
            menuBtn.textContent = navMenu.classList.contains("open") ? "✕" : "☰";
        });
    }

    // 2. Rodapé Dinâmico
    const currentYearSpan = document.querySelector("#currentyear");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const ultimaModificacaoP = document.querySelector("#ultimaModificacao");
    if (ultimaModificacaoP) {
        ultimaModificacaoP.textContent = `Última Modificação: ${document.lastModified}`;
    }

    // 3. Registro de Data e Hora (campo oculto) no carregamento do formulário
    const timestampInput = document.querySelector("#timestamp");
    if (timestampInput) {
        timestampInput.value = new Date().toLocaleString("pt-BR");
    }

    // 4. Controle dos Modais de Benefícios
    const openButtons = document.querySelectorAll(".modal-open-btn");
    openButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-modal");
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.showModal();
            }
        });
    });

    const closeButtons = document.querySelectorAll(".modal-close-btn");
    closeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal = button.closest("dialog");
            if (modal) {
                modal.close();
            }
        });
    });

    // Fecha o modal ao clicar fora da caixa (no backdrop)
    const modals = document.querySelectorAll(".membership-modal");
    modals.forEach(modal => {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                modal.close();
            }
        });
    });
});