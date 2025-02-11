// script.js

// Fungsi untuk mengambil parameter dari URL
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Jika di halaman index.html
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', function () {
        const surahList = document.getElementById('surah-list');

        // Fetch daftar surah
        fetch('https://api.alquran.cloud/v1/surah')
            .then(response => response.json())
            .then(data => {
                data.data.forEach(surah => {
                    const surahElement = document.createElement('div');
                    surahElement.classList.add('surah');
                    surahElement.textContent = surah.englishName + ' (' + surah.name + ')';
                    surahElement.addEventListener('click', () => {
                        // Redirect ke surah.html dengan parameter nomor surah
                        window.location.href = `surah.html?surah=${surah.number}`;
                    });
                    surahList.appendChild(surahElement);
                });
            });
    });
}

// Jika di halaman surah.html
if (window.location.pathname.endsWith('surah.html')) {
    document.addEventListener('DOMContentLoaded', function () {
        const surahTitle = document.getElementById('surah-title');
        const ayatList = document.getElementById('ayat-list');

        // Ambil nomor surah dari URL
        const surahNumber = getParameterByName('surah');

        if (surahNumber) {
            // Fetch detail surah dan terjemahan
            fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`)
                .then(response => response.json())
                .then(surahData => {
                    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/id.indonesian`)
                        .then(response => response.json())
                        .then(translationData => {
                            // Tampilkan judul surah
                            surahTitle.textContent = surahData.data.englishName + ' (' + surahData.data.name + ')';

                            // Tampilkan ayat-ayat dan terjemahan
                            surahData.data.ayahs.forEach((ayat, index) => {
                                const ayatElement = document.createElement('div');
                                ayatElement.classList.add('ayat');

                                // Teks Arab
                                const arabicText = document.createElement('div');
                                arabicText.classList.add('ayat-arabic');

                                // Jika bukan Surah Al-Fatihah dan ini adalah ayat pertama, hapus Basmalah
                                if (surahNumber != 1 && index === 0) {
                                    arabicText.textContent = ayat.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
                                } else {
                                    arabicText.textContent = ayat.text;
                                }
                                ayatElement.appendChild(arabicText);

                                // Terjemahan
                                const translationText = document.createElement('div');
                                translationText.classList.add('ayat-translation');

                                // Jika bukan Surah Al-Fatihah dan ini adalah ayat pertama, hapus terjemahan Basmalah
                                if (surahNumber != 1 && index === 0) {
                                    translationText.textContent = translationData.data.ayahs[index].text.replace('Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.', '').trim();
                                } else {
                                    translationText.textContent = translationData.data.ayahs[index].text;
                                }
                                ayatElement.appendChild(translationText);

                                ayatList.appendChild(ayatElement);
                            });
                        });
                });
        }
    });
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Cek localStorage untuk dark mode
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}