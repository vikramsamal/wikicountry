document.addEventListener('DOMContentLoaded', () => {
    const apiEndpoint = 'https://restcountries.com/v3.1/all';
    const themeToggle = document.getElementById('themeToggle');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const regionFilter = document.getElementById('regionFilter');
    const subregionFilter = document.getElementById('subregionFilter');
    const sortBy = document.getElementById('sortBy');
    const resetFilters = document.getElementById('resetFilters');
    const countriesGrid = document.getElementById('countriesGrid');
    const paginationElement = document.getElementById('pagination');
    
    // Navigation elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // Flag gallery elements
    const flagRegionFilter = document.getElementById('flagRegionFilter');
    const flagsContainer = document.getElementById('flagsContainer');
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    
    // Comparison elements
    const compareCountry1 = document.getElementById('compareCountry1');
    const compareCountry2 = document.getElementById('compareCountry2');
    const comparisonResult = document.getElementById('comparisonResult');
    
    // Statistics elements
    const totalCountries = document.getElementById('totalCountries');
    const totalPopulation = document.getElementById('totalPopulation');
    const totalArea = document.getElementById('totalArea');
    const totalLanguages = document.getElementById('totalLanguages');
    
    let allCountries = [];
    let filteredCountries = [];
    let currentPage = 1;
    const itemsPerPage = 20;
    let regionChart, populationChart;

    // Fetch countries data from the API
    async function fetchCountries() {
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                throw new Error('Failed to fetch countries');
            }
            allCountries = await response.json();
            initializeApp();
        } catch (error) {
            console.error(error);
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) {
                errorMessage.style.display = 'flex';
                errorMessage.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Failed to load country data. Please try again later.<br><small>${error.message}</small>`;
            }
        }
    }

    // Initialize application
    function initializeApp() {
        updateRegionList();
        applyFilters();
        themeToggle.addEventListener('click', toggleTheme);
        searchInput.addEventListener('input', applyFilters);
        clearSearch.addEventListener('click', clearSearchInput);
        regionFilter.addEventListener('change', applyFilters);
        subregionFilter.addEventListener('change', applyFilters);
        sortBy.addEventListener('change', applyFilters);
        resetFilters.addEventListener('click', resetAllFilters);
        
        // Navigation listeners
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.forEach(nav => nav.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));
               
                link.classList.add('active');
                document.getElementById(link.dataset.section).classList.add('active');
            });
        });

        // Flag gallery listeners
        flagRegionFilter.addEventListener('change', renderFlagGallery);

        gridViewBtn.addEventListener('click', () => toggleFlagView('grid'));
        listViewBtn.addEventListener('click', () => toggleFlagView('list'));
    }

    // Render flag gallery
    function renderFlagGallery() {
        flagsContainer.innerHTML = '';
        const selectedRegion = flagRegionFilter.value;
        const countriesToShow = selectedRegion === '' 
            ? allCountries 
            : allCountries.filter(country => country.region === selectedRegion);
        
        countriesToShow.forEach(country => {
            const flagItem = document.createElement('div');
            flagItem.classList.add('flag-item');
            flagItem.innerHTML = `
                <img src="${country.flags.png}" alt="${country.name.common}"> 
                <div class="flag-name">${country.name.common}</div>
            `;
            flagsContainer.appendChild(flagItem);
        });
    }

    // Toggle flag view
    function toggleFlagView(view) {
        if (view === 'grid') {
            flagsContainer.classList.add('grid-view');
            flagsContainer.classList.remove('list-view');
        } else {
            flagsContainer.classList.add('list-view');
            flagsContainer.classList.remove('grid-view');
        }
    }

    // Toggle theme between light and dark
    function toggleTheme() {
        document.documentElement.toggleAttribute('data-theme', 'dark');
    }

    // Clear the search input
    function clearSearchInput() {
        searchInput.value = '';
        applyFilters();
    }

    // Reset all filters
    function resetAllFilters() {
        searchInput.value = '';
        regionFilter.selectedIndex = 0;
        subregionFilter.selectedIndex = 0;
        sortBy.selectedIndex = 0;
        applyFilters();
    }

    // Apply filters to countries list
    function applyFilters() {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedRegion = regionFilter.value;
        const selectedSubregion = subregionFilter.value;
        filteredCountries = allCountries.filter(country => {
            const nameMatch = country.name.common.toLowerCase().includes(searchQuery);
            const regionalMatch = selectedRegion === '' || country.region === selectedRegion;
            const subregionalMatch = selectedSubregion === '' || country.subregion === selectedSubregion;
            return nameMatch && regionalMatch && subregionalMatch;
        });
        sortCountries();
        renderCountries();
    }

    // Sort countries based on selected criteria
    function sortCountries() {
        const sortByValue = sortBy.value;
        filteredCountries.sort((a, b) => {
            let compareValueA = a.name.common;
            let compareValueB = b.name.common;
            if (sortByValue === 'population') {
                compareValueA = a.population;
                compareValueB = b.population;
            } else if (sortByValue === 'area') {
                compareValueA = a.area;
                compareValueB = b.area;
            } else if (sortByValue === 'capital') {
                compareValueA = a.capital && a.capital[0] ? a.capital[0] : '';
                compareValueB = b.capital && b.capital[0] ? b.capital[0] : '';
            }
            if (compareValueA < compareValueB) return -1;
            if (compareValueA > compareValueB) return 1;
            return 0;
        });
    }

    // Render countries to the DOM
    function renderCountries() {
        countriesGrid.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const countriesToShow = filteredCountries.slice(start, end);

        countriesToShow.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.classList.add('country-card');
            countryCard.innerHTML = `
                <img src="${country.flags.png}" alt="${country.name.common} flag" class="country-flag">
                <div class="country-info">
                    <h3 class="country-name">${country.name.common}</h3>
                    <div class="country-details">
                        <div class="country-detail"><strong>Capital:</strong> <span>${country.capital ? country.capital[0] : 'N/A'}</span></div>
                        <div class="country-detail"><strong>Population:</strong> <span>${country.population.toLocaleString()}</span></div>
                        <div class="country-detail"><strong>Region:</strong> <span>${country.region}</span></div>
                    </div>
                </div>
            `;
            countryCard.addEventListener('click', () => showCountryDetails(country));
            countriesGrid.appendChild(countryCard);
        });

        setupPagination();
    }

    // Show detailed information for a specific country
    function showCountryDetails(country) {
        const modal = document.getElementById('countryModal');
        const modalCountryName = document.getElementById('modalCountryName');
        const modalBody = document.getElementById('modalBody');
        modalCountryName.textContent = country.name.common;
        modalBody.innerHTML = `
            <div class="country-detail-grid">
                <img src="${country.flags.svg}" alt="${country.name.common} flag" class="detail-flag">
                <div class="detail-info">
                    <div class="detail-section">
                        <h3>General Information</h3>
                        <div class="detail-list">
                            <div class="detail-item"><strong>Native Name:</strong> <span>${country.name.nativeName ? Object.values(country.name.nativeName)[0].common : 'N/A'}</span></div>
                            <div class="detail-item"><strong>Official Name:</strong> <span>${country.name.official}</span></div>
                            <div class="detail-item"><strong>Region:</strong> <span>${country.region}</span></div>
                            <div class="detail-item"><strong>Subregion:</strong> <span>${country.subregion}</span></div>
                            <div class="detail-item"><strong>Capital:</strong> <span>${country.capital ? country.capital[0] : 'N/A'}</span></div>
                            <div class="detail-item"><strong>Population:</strong> <span>${country.population.toLocaleString()}</span></div>
                            <div class="detail-item"><strong>Area:</strong> <span>${country.area.toLocaleString()} sq km</span></div>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3>Other Information</h3>
                        <div class="detail-list">
                            <div class="detail-item"><strong>Languages:</strong> <span>${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</span></div>
                            <div class="detail-item"><strong>Currencies:</strong> <span>${country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A'}</span></div>
                            <div class="detail-item"><strong>Timezones:</strong> <span>${country.timezones.join(', ')}</span></div>
                            <div class="detail-item"><strong>Borders:</strong> <span>${country.borders ? country.borders.join(', ') : 'N/A'}</span></div>
                            <div class="detail-item"><strong>Calling Codes:</strong> <span>${country.idd.root}${country.idd.suffixes ? country.idd.suffixes[0] : ''}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        modal.classList.add('active');
        const closeModalBtns = modal.querySelectorAll('.close-modal');
        closeModalBtns.forEach(btn => btn.addEventListener('click', () => modal.classList.remove('active')));
    }

    // Setup pagination elements
    function setupPagination() {
        paginationElement.innerHTML = '';
        const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
        for (let i = 0; i < totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.classList.add('page-btn');
            pageBtn.textContent = i + 1;
            if (i + 1 === currentPage) {
                pageBtn.classList.add('active');
            }
            pageBtn.addEventListener('click', () => {
                currentPage = i + 1;
                renderCountries();
            });
            paginationElement.appendChild(pageBtn);
        }
    }

    // Update region list for filter options
    function updateRegionList() {
        const regions = new Set(allCountries.map(country => country.region));
        regions.forEach(region => {
            const optionElement = document.createElement('option');
            optionElement.value = region;
            optionElement.textContent = region;
            regionFilter.appendChild(optionElement);
        });
    }

    fetchCountries();
});

