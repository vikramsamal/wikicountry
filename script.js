document.addEventListener('DOMContentLoaded', () => {
    // Use all required fields from the API (updated, removed borders and idd)
    const apiEndpoint = 'https://restcountries.com/v3.1/all?fields=name,flags,region,subregion,population,capital,area,languages,currencies,timezones';
    const themeToggle = document.getElementById('themeToggle');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const regionFilter = document.getElementById('regionFilter');
    const subregionFilter = document.getElementById('subregionFilter');
    const sortBy = document.getElementById('sortBy');
    const resetFilters = document.getElementById('resetFilters');
    const countriesGrid = document.getElementById('countriesGrid');
    const paginationElement = document.getElementById('pagination');
    // Comparison selectors
    const compareCountry1 = document.getElementById('compareCountry1');
    const compareCountry2 = document.getElementById('compareCountry2');
    const comparisonResult = document.getElementById('comparisonResult');
    // Navigation elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    // Flag gallery elements
    const flagRegionFilter = document.getElementById('flagRegionFilter');
    const flagSearchInput = document.getElementById('flagSearchInput');
    const flagsContainer = document.getElementById('flagsContainer');
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    let flagView = 'grid'; // default view

    // Declare global variables for data and pagination
    let allCountries = [];
    let filteredCountries = [];
    let currentPage = 1;
    const itemsPerPage = 20;

    // Only render flags when a region is selected
    flagRegionFilter.addEventListener('change', () => {
        if (flagRegionFilter.value === '') {
            flagsContainer.innerHTML = `
                <div class="loading">
                    <i class="fas fa-flag"></i>
                    <p>Please select a region to view flags.</p>
                </div>
            `;
        } else {
            renderFlagGallery();
        }
        flagSearchInput.value = '';
    });

    // Disable search input until a region is selected
    flagSearchInput.disabled = true;
    flagRegionFilter.addEventListener('change', () => {
        flagSearchInput.disabled = flagRegionFilter.value === '';
    });

    // Fetch countries data from the API
    async function fetchCountries() {
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                throw new Error('Failed to fetch countries');
            }
            allCountries = await response.json();
            initializeApp();
            updateStatistics(); // <-- Add this
            populateStatsCountryDropdown(); // <-- Add this
            createCharts(); // <-- Add this
        } catch (error) {
            console.error(error);
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) {
                errorMessage.style.display = 'flex';
                errorMessage.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Failed to load country data. Please try again later.<br><small>${error.message}</small>`;
            }
        }
    }

    // Update statistics cards
    function updateStatistics() {
        const totalCountries = document.getElementById('totalCountries');
        const totalPopulation = document.getElementById('totalPopulation');
        const totalArea = document.getElementById('totalArea');
        const totalLanguages = document.getElementById('totalLanguages');

        if (!allCountries.length) return;

        totalCountries.textContent = allCountries.length.toLocaleString();

        let population = 0;
        let area = 0;
        const languagesSet = new Set();

        allCountries.forEach(c => {
            population += c.population || 0;
            area += c.area || 0;
            if (c.languages) {
                Object.values(c.languages).forEach(lang => languagesSet.add(lang));
            }
        });

        totalPopulation.textContent = population.toLocaleString();
        totalArea.textContent = area.toLocaleString();
        totalLanguages.textContent = languagesSet.size.toLocaleString();
    }

    // Populate country dropdown for statistics
    function populateStatsCountryDropdown() {
        const statsCountrySelect = document.getElementById('statsCountrySelect');
        if (!statsCountrySelect) return;
        statsCountrySelect.innerHTML = '<option value="">Select a country...</option>';
        allCountries
            .sort((a, b) => a.name.common.localeCompare(b.name.common))
            .forEach(country => {
                const option = document.createElement('option');
                option.value = country.name.common;
                option.textContent = country.name.common;
                statsCountrySelect.appendChild(option);
            });
    }

    // Show country-specific statistics
    function showCountryStats(countryName) {
        const countryStats = document.getElementById('countryStats');
        if (!countryStats) return;
        if (!countryName) {
            countryStats.innerHTML = '';
            return;
        }
        const country = allCountries.find(c => c.name.common === countryName);
        if (!country) {
            countryStats.innerHTML = '<p>Country not found.</p>';
            return;
        }
        countryStats.innerHTML = `
            <div class="country-stats-header">
                <img src="${country.flags.png}" alt="${country.name.common} flag" class="country-flag-icon">
                <h3 class="country-title">${country.name.common}</h3>
            </div>
            <div class="country-stats-body">
                <div class="country-stats-grid">
                    <div class="country-stat-item">
                        <div class="country-stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="country-stat-info">
                            <div class="country-stat-label">Population</div>
                            <div class="country-stat-value">${country.population.toLocaleString()}</div>
                        </div>
                    </div>

                    <div class="country-stat-item">
                        <div class="country-stat-icon">
                            <i class="fas fa-map"></i>
                        </div>
                        <div class="country-stat-info">
                            <div class="country-stat-label">Area</div>
                            <div class="country-stat-value">${country.area.toLocaleString()} km²</div>
                        </div>
                    </div>

                    <div class="country-stat-item">
                        <div class="country-stat-icon">
                            <i class="fas fa-globe-americas"></i>
                        </div>
                        <div class="country-stat-info">
                            <div class="country-stat-label">Region</div>
                            <div class="country-stat-value">${country.region}</div>
                        </div>
                    </div>

                    <div class="country-stat-item">
                        <div class="country-stat-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="country-stat-info">
                            <div class="country-stat-label">Subregion</div>
                            <div class="country-stat-value">${country.subregion || 'N/A'}</div>
                        </div>
                    </div>

                    <div class="country-stat-item">
                        <div class="country-stat-icon">
                            <i class="fas fa-city"></i>
                        </div>
                        <div class="country-stat-info">
                            <div class="country-stat-label">Capital</div>
                            <div class="country-stat-value">${country.capital ? country.capital.join(', ') : 'N/A'}</div>
                        </div>
                    </div>

                    <div class="country-stat-item">
                        <div class="country-stat-icon">
                            <i class="fas fa-language"></i>
                        </div>
                        <div class="country-stat-info">
                            <div class="country-stat-label">Languages</div>
                            <div class="country-stat-value">${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</div>
                        </div>
                    </div>

                    <div class="country-stat-item">
                        <div class="country-stat-icon">
                            <i class="fas fa-coins"></i>
                        </div>
                        <div class="country-stat-info">
                            <div class="country-stat-label">Currencies</div>
                            <div class="country-stat-value">${country.currencies ? Object.values(country.currencies).map(cur => cur.name).join(', ') : 'N/A'}</div>
                        </div>
                    </div>

                    <div class="country-stat-item">
                        <div class="country-stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="country-stat-info">
                            <div class="country-stat-label">Timezones</div>
                            <div class="country-stat-value">${country.timezones ? country.timezones.join(', ') : 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Initialize application
function initializeApp() {
    updateRegionList();
    flagRegionFilter.value = 'Europe'; // Set default region here
    flagSearchInput.disabled = false; // Enable search since we have a default region
    renderFlagGallery();
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
        flagSearchInput.addEventListener('input', renderFlagGallery);
        gridViewBtn.addEventListener('click', () => {
            flagView = 'grid';
            toggleFlagView(flagView);
            renderFlagGallery();
        });
        listViewBtn.addEventListener('click', () => {
            flagView = 'list';
            toggleFlagView(flagView);
            renderFlagGallery();
        });
        
        // Comparison listeners
        populateComparisonSelectors();
        compareCountry1.addEventListener('change', handleComparison);
        compareCountry2.addEventListener('change', handleComparison);
    }

    // Render flag gallery with search and view toggle
    function renderFlagGallery() {
        flagsContainer.innerHTML = '';
        const selectedRegion = flagRegionFilter.value;
        const searchQuery = flagSearchInput.value.trim().toLowerCase();

        if (!selectedRegion) {
            flagsContainer.innerHTML = `
                <div class="loading">
                    <i class="fas fa-flag"></i>
                    <p>Please select a region to view flags.</p>
                </div>
            `;
            return;
        }

        let countriesToShow = allCountries.filter(country => country.region === selectedRegion);

        if (searchQuery !== '') {
            countriesToShow = countriesToShow.filter(country =>
                country.name.common.toLowerCase().includes(searchQuery)
            );
        }

        if (countriesToShow.length === 0) {
            flagsContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No flags found.</p>
                </div>
            `;
            return;
        }

        countriesToShow.forEach(country => {
            const flagItem = document.createElement('div');
            flagItem.classList.add('flag-item');
            if (flagView === 'list') flagItem.classList.add('list-view');
            flagItem.innerHTML = `
                <img src="${country.flags.png}" alt="${country.name.common}" class="flag-img">
                <div class="flag-name">${country.name.common}</div>
            `;
            flagsContainer.appendChild(flagItem);
        });
    }

    // Listen for search input only when region is selected
    flagSearchInput.addEventListener('input', () => {
        if (flagRegionFilter.value !== '') {
            renderFlagGallery();
        }
    });

    // Toggle flag view (grid/list)
    function toggleFlagView(view) {
        gridViewBtn.classList.toggle('active', view === 'grid');
        listViewBtn.classList.toggle('active', view === 'list');
        flagsContainer.classList.toggle('grid-view', view === 'grid');
        flagsContainer.classList.toggle('list-view', view === 'list');
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
        // Clear previous options except the first one
        while (regionFilter.options.length > 1) {
            regionFilter.remove(1);
        }
        const regions = Array.from(new Set(allCountries.map(country => country.region))).filter(Boolean);
        regions.forEach(region => {
            const optionElement = document.createElement('option');
            optionElement.value = region;
            optionElement.textContent = region;
            regionFilter.appendChild(optionElement);
        });
    }

    // Populate comparison selectors with countries
    function populateComparisonSelectors() {
        if (!compareCountry1 || !compareCountry2) return;
        
        const sortedCountries = [...allCountries].sort((a, b) => 
            a.name.common.localeCompare(b.name.common)
        );
        
        [compareCountry1, compareCountry2].forEach(select => {
            select.innerHTML = '<option value="">Choose a country...</option>';
            sortedCountries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name.common;
                option.textContent = country.name.common;
                select.appendChild(option);
            });
        });
    }

    // Handle comparison functionality
    function handleComparison() {
        const country1Name = compareCountry1?.value;
        const country2Name = compareCountry2?.value;
        
        if (!country1Name || !country2Name) {
            comparisonResult.innerHTML = '';
            return;
        }
        
        const country1 = allCountries.find(c => c.name.common === country1Name);
        const country2 = allCountries.find(c => c.name.common === country2Name);
        
        if (country1 && country2) {
            renderComparison(country1, country2);
        }
    }

    // Render the comparison result
    function renderComparison(country1, country2) {
        comparisonResult.innerHTML = `
            <div class="compare-card">
                <img src="${country1.flags.png}" alt="${country1.name.common} flag" class="compare-flag">
                <h3 class="compare-name">${country1.name.common}</h3>
                <div class="compare-details">
                    ${createComparisonDetails(country1)}
                </div>
            </div>
            <div class="compare-card">
                <img src="${country2.flags.png}" alt="${country2.name.common} flag" class="compare-flag">
                <h3 class="compare-name">${country2.name.common}</h3>
                <div class="compare-details">
                    ${createComparisonDetails(country2)}
                </div>
            </div>
        `;
    }

    // Create comparison details for a country
    function createComparisonDetails(country) {
        return `
            <div class="compare-detail">
                <strong>Capital:</strong>
                <span>${country.capital ? country.capital[0] : 'N/A'}</span>
            </div>
            <div class="compare-detail">
                <strong>Population:</strong>
                <span>${country.population ? country.population.toLocaleString() : 'N/A'}</span>
            </div>
            <div class="compare-detail">
                <strong>Area:</strong>
                <span>${country.area ? country.area.toLocaleString() : 'N/A'} km²</span>
            </div>
            <div class="compare-detail">
                <strong>Region:</strong>
                <span>${country.region}</span>
            </div>
            <div class="compare-detail">
                <strong>Languages:</strong>
                <span>${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</span>
            </div>
            <div class="compare-detail">
                <strong>Currency:</strong>
                <span>${country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A'}</span>
            </div>
        `;
    }

    // Create Charts
    function createCharts() {
        createRegionChart();
        createPopulationChart();
    }

    // Create Countries by Region Chart
    function createRegionChart() {
        const regionCanvas = document.getElementById('regionChart');
        if (!regionCanvas) return;

        // Count countries by region
        const regionCounts = {};
        allCountries.forEach(country => {
            const region = country.region || 'Unknown';
            regionCounts[region] = (regionCounts[region] || 0) + 1;
        });

        const regions = Object.keys(regionCounts);
        const counts = Object.values(regionCounts);
        const colors = [
            '#374151', // Primary
            '#6b7280', // Primary light
            '#9ca3af', // Secondary
            '#d1d5db', // Accent
            '#10b981', // Success
            '#f59e0b', // Warning
            '#ef4444'  // Danger
        ];

        new Chart(regionCanvas, {
            type: 'doughnut',
            data: {
                labels: regions,
                datasets: [{
                    data: counts,
                    backgroundColor: colors.slice(0, regions.length),
                    borderColor: '#ffffff',
                    borderWidth: 2,
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} countries (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    // Create Top 10 Most Populous Countries Chart
    function createPopulationChart() {
        const populationCanvas = document.getElementById('populationChart');
        if (!populationCanvas) return;

        // Get top 10 most populous countries
        const sortedCountries = [...allCountries]
            .filter(country => country.population > 0)
            .sort((a, b) => b.population - a.population)
            .slice(0, 10);

        const countryNames = sortedCountries.map(country => country.name.common);
        const populations = sortedCountries.map(country => country.population);

        // Create gradient colors
        const ctx = populationCanvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#374151');
        gradient.addColorStop(1, '#9ca3af');

        new Chart(populationCanvas, {
            type: 'bar',
            data: {
                labels: countryNames,
                datasets: [{
                    label: 'Population',
                    data: populations,
                    backgroundColor: gradient,
                    borderColor: '#374151',
                    borderWidth: 1,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000000) {
                                    return (value / 1000000000).toFixed(1) + 'B';
                                } else if (value >= 1000000) {
                                    return (value / 1000000).toFixed(0) + 'M';
                                } else if (value >= 1000) {
                                    return (value / 1000).toFixed(0) + 'K';
                                }
                                return value;
                            },
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            color: '#e5e7eb',
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                return `Population: ${value.toLocaleString()}`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    // Listen for country selection in statistics tab
    document.getElementById('statsCountrySelect')?.addEventListener('change', function() {
        showCountryStats(this.value);
    });

    fetchCountries();
});

