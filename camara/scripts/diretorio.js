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

    // Rodapé Dinâmico (Ano e Última Modificação)
    const currentYearSpan = document.querySelector("#currentyear");
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    const ultimaModificacaoP = document.querySelector("#ultimaModificacao");
    if (ultimaModificacaoP) {
        ultimaModificacaoP.textContent = `Última Modificação: ${document.lastModified}`;
    }

    // Consumo de Dados JSON com Fetch e Async/Await
    const membersContainer = document.querySelector("#members-container");
    const gridBtn = document.querySelector("#grid-btn");
    const listBtn = document.querySelector("#list-btn");

    async function getMembers() {
        try {
            const response = await fetch("dados/membros.json");
            if (!response.ok) {
                throw new Error("Erro ao carregar o arquivo JSON de membros.");
            }
            const data = await response.json();
            displayMembers(data);
        } catch (error) {
            console.error("Erro:", error);
            if (membersContainer) {
                membersContainer.innerHTML = "<p>Não foi possível carregar os dados dos membros.</p>";
            }
        }
    }

    function displayMembers(members) {
        if (!membersContainer) return;
        membersContainer.innerHTML = "";

        members.forEach(member => {
            const card = document.createElement("div");
            card.classList.add("member-card");

            card.innerHTML = `
                <img src="${member.imagem}" alt="Logotipo ou foto de ${member.nome}" width="300" height="160" loading="lazy">
                <h3>${member.nome}</h3>
                <p><strong>Nível:</strong> ${getMembershipLevel(member.nivelAssociacao)}</p>
                <p>${member.endereco}</p>
                <p>${member.telefone}</p>
                <a href="${member.url}" target="_blank" rel="noopener">Visitar Site</a>
            `;
            membersContainer.appendChild(card);
        });
    }

    function getMembershipLevel(level) {
        if (level === 3) return "Ouro 🌟";
        if (level === 2) return "Prata ✨";
        return "Membro Regular 🏛️";
    }

    // Alternar entre Grade e Lista
    if (gridBtn && listBtn && membersContainer) {
        gridBtn.addEventListener("click", () => {
            membersContainer.classList.add("grid-view");
            membersContainer.classList.remove("list-view");
            gridBtn.classList.add("active-view");
            listBtn.classList.remove("active-view");
        });

        listBtn.addEventListener("click", () => {
            membersContainer.classList.add("list-view");
            membersContainer.classList.remove("grid-view");
            listBtn.classList.add("active-view");
            gridBtn.classList.remove("active-view");
        });
    }

    getMembers();
});