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

    // 3. API OpenWeatherMap (Aparecida de Goiânia, GO)
    // Cole sua chave gratuita do OpenWeatherMap abaixo:
    const apiKey = "b7155f404df0c0bacb36551f88de272a";
    const lat = -16.8233;
    const lon = -49.2439;

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;
    const forecastWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;

    async function fetchWeather() {
        const currentContainer = document.querySelector("#current-weather");
        const forecastContainer = document.querySelector("#forecast-weather");

        try {
            const [currentRes, forecastRes] = await Promise.all([
                fetch(currentWeatherUrl),
                fetch(forecastWeatherUrl)
            ]);

            if (!currentRes.ok || !forecastRes.ok) {
                throw new Error("Chave da API inválida ou aguardando ativação.");
            }

            const currentData = await currentRes.json();
            const forecastData = await forecastRes.json();

            displayCurrentWeather(currentData, currentContainer);
            displayForecast(forecastData, forecastContainer);
        } catch (error) {
            console.warn("Aviso OpenWeatherMap:", error.message);
            if (currentContainer) {
                currentContainer.innerHTML = `<p>Configure sua chave da API OpenWeatherMap em <code>scripts/inicio.js</code>.</p>`;
            }
            if (forecastContainer) {
                forecastContainer.innerHTML = `<p>Previsão indisponível sem chave ativa.</p>`;
            }
        }
    }

    function displayCurrentWeather(data, container) {
        if (!container) return;
        const temp = Math.round(data.main.temp);
        const tempMax = Math.round(data.main.temp_max);
        const tempMin = Math.round(data.main.temp_min);
        const humidity = data.main.humidity;
        const desc = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        container.innerHTML = `
            <div class="weather-main">
                <img src="${iconUrl}" alt="${desc}" width="64" height="64">
                <div>
                    <p class="weather-temp">${temp}&deg;C</p>
                    <p class="weather-desc">${desc}</p>
                </div>
            </div>
            <p>Máxima: ${tempMax}&deg;C</p>
            <p>Mínima: ${tempMin}&deg;C</p>
            <p>Umidade: ${humidity}%</p>
        `;
    }

    function displayForecast(data, container) {
        if (!container) return;
        // Filtra as medições das 15:00 UTC (meio-dia em Goiás) e pega os próximos 3 dias
        const dailyList = data.list.filter(item => item.dt_txt.includes("15:00:00")).slice(0, 3);
        const today = new Date().toDateString();

        container.innerHTML = dailyList.map(day => {
            const date = new Date(day.dt * 1000);
            const dayName = date.toDateString() === today
                ? "Hoje"
                : date.toLocaleDateString("pt-BR", { weekday: "long" });
            const formattedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
            const temp = Math.round(day.main.temp);

            return `<p class="forecast-day">${formattedDay}: <strong>${temp}&deg;C</strong></p>`;
        }).join("");
    }

    // 4. Empresas em Destaque (Ouro e Prata aleatórias de membros.json)
    async function loadSpotlights() {
        const container = document.querySelector("#spotlights-container");
        if (!container) return;

        try {
            const response = await fetch("dados/membros.json");
            if (!response.ok) throw new Error("Erro ao carregar membros.json");

            const members = await response.json();

            // Filtra apenas Ouro (3) e Prata (2)
            const eligible = members.filter(m => m.nivelAssociacao === 3 || m.nivelAssociacao === 2);

            // Embaralha aleatoriamente e seleciona 3 membros
            const shuffled = eligible.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, 3);

            container.innerHTML = selected.map(member => {
                const levelLabel = member.nivelAssociacao === 3 ? "Ouro 🌟" : "Prata ✨";
                return `
                    <article class="spotlight-card">
                        <div class="spotlight-header">
                            <h3>${member.nome}</h3>
                            <p class="spotlight-tagline">${member.descricao || "Empresa Associada"}</p>
                        </div>
                        <div class="spotlight-body">
                            <img src="${member.imagem}" alt="Logotipo de ${member.nome}" width="90" height="90" loading="lazy">
                            <div class="spotlight-details">
                                <p><strong>Nível:</strong> ${levelLabel}</p>
                                <p><strong>Tel:</strong> ${member.telefone}</p>
                                <p><strong>End:</strong> ${member.endereco}</p>
                                <p><a href="${member.url}" target="_blank" rel="noopener">Visitar Site</a></p>
                            </div>
                        </div>
                    </article>
                `;
            }).join("");
        } catch (error) {
            console.error("Erro nos destaques:", error);
            container.innerHTML = "<p>Não foi possível carregar os destaques.</p>";
        }
    }

    fetchWeather();
    loadSpotlights();
});