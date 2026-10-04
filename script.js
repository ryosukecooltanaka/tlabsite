/* Declare an array to store texts in english / japanese */
let translations = {};

/* Get document elements we work on */
const languageButton = document.querySelector('[data-language-toggle]');
const menuButton = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

/* If you are already viewing the page, the language the user
selected is saved in the sessionStorage. Otherwise you get null.
In which case, you look at the system setting, and if Japanese
is in there, you assume this person reads Japanese and set 
the site to Japanese. Otherwise default to English. */
let savedLanguage = sessionStorage.getItem('tsl-language');
if (!savedLanguage) {
    const systemLangs = navigator.languages;
    systemLangs.forEach((lang) =>{
        if (lang==='ja'){
            console.log("Japanese found among system languages. Setting the site to Japanese");
            savedLanguage = 'ja';
        }
    });
    savedLanguage = savedLanguage || 'en';
}

/* Main function that swaps text according to the selected language */
function applyLanguage(language) {
    console.log(language);
    const dictionary = translations[language];
    document.documentElement.lang = language === 'ja' ? 'ja' : 'en';
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        if (dictionary[key]) element.innerHTML = dictionary[key];
    });
    document.querySelectorAll('[data-lang-label]').forEach((element) => {
        element.textContent = language === 'en' ? 'JA' : 'EN';
    });
    sessionStorage.setItem('tsl-language', language);
}

/* Set the applyLanguage() as the callback of the lang button with 
an appropriate input variable */
if (languageButton) languageButton.addEventListener('click', () => applyLanguage(document.documentElement.lang === 'ja' ? 'en' : 'ja'));

/* When the navigation bar is expanded in the phone mode, add the expanded
menu links to what are going to be read out loud by a sreen reader */
if (menuButton) menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
});

/* load text from json on load */
fetch('translations.json')
    .then((response) => response.json())
    .then((dictionary) => {
        translations = dictionary;
        applyLanguage(savedLanguage);
    });
