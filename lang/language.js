// Výchozí jazyk
let currentLanguage = 'cs';

// Načtení jazyka z localStorage, pokud existuje
if (localStorage.getItem('language')) {
    currentLanguage = localStorage.getItem('language');
}

// Funkce pro změnu jazyka
function changeLanguage(lang) {
    if (currentLanguage !== lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        // Přidáno: Obnovení stránky po změně jazyka
        window.location.reload();
    }
}

// Funkce pro aktualizaci obsahu stránky podle aktuálního jazyka
function updateContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            element.innerHTML = translations[key];
        }
    });

    // Speciální zpracování pro seznamy (služby)
    const servicesList = document.querySelector('.services');
    if (servicesList) {
        const servicesItems = translations['services'];
        if (servicesItems && Array.isArray(servicesItems)) {
            servicesList.innerHTML = `<h2 data-i18n="services_title">${translations['services_title']}</h2>`;
            servicesItems.forEach(service => {
                const p = document.createElement('p');
                p.textContent = `• ${service}`;
                servicesList.appendChild(p);
            });
        }
    }

    // Aktualizace atributů
    const attributeElements = document.querySelectorAll('[data-i18n-attr]');
    attributeElements.forEach(element => {
        const data = element.getAttribute('data-i18n-attr').split(',');
        data.forEach(item => {
            const [attr, key] = item.trim().split(':');
            if (attr && key && translations[key]) {
                element.setAttribute(attr, translations[key]);
            }
        });
    });
}

// Funkce pro aktualizaci selektoru jazyka
function updateLanguageSelector() {
    const languageLinks = document.querySelectorAll('.language-selector a');
    languageLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-lang') === currentLanguage) {
            link.classList.add('active');
        }
    });
}

// Inicializace po načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    // Nastavení posluchačů událostí pro přepínače jazyka
    const languageLinks = document.querySelectorAll('.language-selector a');
    languageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = link.getAttribute('data-lang');
            if (lang) {
                changeLanguage(lang);
            }
        });
    });

    // Načtení správného jazykového souboru
    loadTranslations(currentLanguage);
});

// Funkce pro načtení jazykového souboru
function loadTranslations(lang) {
    const script = document.createElement('script');
    script.src = `lang/${lang}.js`;
    script.onload = () => {
        updateContent();
        updateLanguageSelector();
    };
    document.head.appendChild(script);
} 