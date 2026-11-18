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

    // 3. Exibição dos dados recebidos via GET
    const detailsContainer = document.querySelector("#submission-details");
    if (detailsContainer) {
        const params = new URLSearchParams(window.location.search);

        const nome = params.get("nome") || "Não informado";
        const sobrenome = params.get("sobrenome") || "Não informado";
        const email = params.get("email") || "Não informado";
        const telefone = params.get("telefone") || "Não informado";
        const organizacao = params.get("organizacao") || "Não informado";
        const timestamp = params.get("timestamp") || "Não registrado";

        const campos = [
            ["Nome Completo", `${nome} ${sobrenome}`],
            ["E-mail", email],
            ["Celular", telefone],
            ["Empresa / Organização", organizacao],
            ["Data e Hora da Solicitação", timestamp]
        ];

        detailsContainer.innerHTML = "";
        campos.forEach(([rotulo, valor]) => {
            const p = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = `${rotulo}:`;
            p.append(strong, ` ${valor}`);
            detailsContainer.appendChild(p);
        });
    }
});