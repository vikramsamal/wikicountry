// Complete Country Information Portal JavaScript
class CountryPortal {
    constructor() {
 this.apiEndpoint = 'https://restcountries.com/v3.1/all?fields=name,flags,region,subregion,population,capital,area,languages,currencies,timezones';
        this.allCountries = [];
        this.filteredCountries = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.regionChart = null;
        this.populationChart = null;
        
        this.initializeElements();
        this.loadCountries();
    }

    initializeElements() {
        // Navigation elements
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('.section');
        
        // Theme toggle
        this.themeToggle = document.getElementById('themeToggle');
        
        // Search and filter elements
        this.searchInput = document.getElementById('searchInput');
        this.clearSearch = document.getElementById('clearSearch');
        this.regionFilter = document.getElementById('regionFilter');
        this.subregionFilter = document.getElementById('subregionFilter');
        this.sortBy = document.getElementById('sortBy');
        this.resetFilters = document.getElementById('resetFilters');
        
        // Countries grid and pagination
        this.countriesGrid = document.getElementById('countriesGrid');
        this.paginationElement = document.getElementById('pagination');
        
        // Flag gallery elements
        this.flagRegionFilter = document.getElementById('flagRegionFilter');
        this.flagsContainer = document.getElementById('flagsContainer');
        this.gridViewBtn = document.getElementById('gridView');
        this.listViewBtn = document.getElementById('listView');
        
        // Comparison elements
        this.compareCountry1 = document.getElementById('compareCountry1');
        this.compareCountry2 = document.getElementById('compareCountry2');
        this.comparisonResult = document.getElementById('comparisonResult');
        
        // Statistics elements
        this.totalCountries = document.getElementById('totalCountries');
        this.totalPopulation = document.getElementById('totalPopulation');
        this.totalArea = document.getElementById('totalArea');
        this.totalLanguages = document.getElementById('totalLanguages');
        
        // Modals
        this.countryModal = document.getElementById('countryModal');
        this.flagModal = document.getElementById('flagModal');
        
        // Stats elements
        this.statsCountrySelect = document.getElementById('statsCountrySelect');
        this.countryStats = document.getElementById('countryStats');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Theme toggle
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
        
        // Navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Search and filters
        this.searchInput?.addEventListener('input', () => this.applyFilters());
        this.clearSearch?.addEventListener('click', () => this.clearSearchInput());
        this.regionFilter?.addEventListener('change', () => this.handleRegionChange());
        this.subregionFilter?.addEventListener('change', () => this.applyFilters());
        this.sortBy?.addEventListener('change', () => this.applyFilters());
        this.resetFilters?.addEventListener('click', () => this.resetAllFilters());
        
        // Flag gallery
        this.flagRegionFilter?.addEventListener('change', () => this.renderFlagGallery());
        this.gridViewBtn?.addEventListener('click', () => this.toggleFlagView('grid'));
        this.listViewBtn?.addEventListener('click', () => this.toggleFlagView('list'));
        
        // Comparison
        this.compareCountry1?.addEventListener('change', () => this.handleComparison());
        this.compareCountry2?.addEventListener('change', () => this.handleComparison());
        
        // Stats
        this.statsCountrySelect.addEventListener('change', (e) => {
            this.showCountryStats(e.target.value);
        });
        
        // Modal close buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal') || e.target.closest('.close-modal')) {
                this.closeModals();
            }
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });
    }

    async loadCountries() {
        try {
            this.showLoading();
            const response = await fetch(this.apiEndpoint);
            if (!response.ok) throw new Error('Failed to fetch countries');
            
            this.allCountries = await response.json();
            this.initializeApp();
        } catch (error) {
            console.error('Error loading countries:', error);
            this.showError('Failed to load country data. Please try again later.');
        }
    }

    initializeApp() {
        this.updateRegionLists();
        this.populateComparisonSelectors();
        this.applyFilters();
        this.renderFlagGallery();
        this.updateStatistics();
        this.populateStatsCountryDropdown();
        this.showCountryStats(this.statsCountrySelect.value);
        this.hideLoading();
    }

    showLoading() {
        // Show loading states for all sections
        const loadingHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading...</p>
            </div>
        `;
        this.countriesGrid.innerHTML = loadingHTML;
        this.flagsContainer.innerHTML = loadingHTML;
    }

    hideLoading() {
        // Loading will be hidden when content is rendered
    }

    showError(message) {
        const errorHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${message}</p>
            </div>
        `;
        this.countriesGrid.innerHTML = errorHTML;
    }

    // Navigation
    handleNavigation(e) {
        e.preventDefault();
        const targetSection = e.currentTarget.dataset.section;
        
        // Update active states
        this.navLinks.forEach(link => link.classList.remove('active'));
        this.sections.forEach(section => section.classList.remove('active'));
        
        e.currentTarget.classList.add('active');
        document.getElementById(targetSection)?.classList.add('active');
        
        // Initialize section-specific content
        if (targetSection === 'flags') {
            this.renderFlagGallery();
        } else if (targetSection === 'statistics') {
            this.renderCharts();
        }
    }

    // Theme management
    toggleTheme() {
        const isDark = document.documentElement.hasAttribute('data-theme');
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            this.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Search and filtering
    clearSearchInput() {
        this.searchInput.value = '';
        this.applyFilters();
    }

    resetAllFilters() {
        this.searchInput.value = '';
        this.regionFilter.selectedIndex = 0;
        this.subregionFilter.selectedIndex = 0;
        this.sortBy.selectedIndex = 0;
        this.currentPage = 1;
        this.applyFilters();
    }

    handleRegionChange() {
        this.updateSubregionFilter();
        this.applyFilters();
    }

    updateSubregionFilter() {
        const selectedRegion = this.regionFilter.value;
        const subregions = new Set();
        
        this.allCountries
            .filter(country => !selectedRegion || country.region === selectedRegion)
            .forEach(country => {
                if (country.subregion) subregions.add(country.subregion);
            });
        
        this.subregionFilter.innerHTML = '<option value="">All Subregions</option>';
        [...subregions].sort().forEach(subregion => {
            const option = document.createElement('option');
            option.value = subregion;
            option.textContent = subregion;
            this.subregionFilter.appendChild(option);
        });
    }

    applyFilters() {
        const searchQuery = this.searchInput.value.toLowerCase();
        const selectedRegion = this.regionFilter.value;
        const selectedSubregion = this.subregionFilter.value;
        
        this.filteredCountries = this.allCountries.filter(country => {
            const nameMatch = country.name.common.toLowerCase().includes(searchQuery) ||
                            (country.capital && country.capital[0] && country.capital[0].toLowerCase().includes(searchQuery));
            
            const regionMatch = !selectedRegion || country.region === selectedRegion;
            const subregionMatch = !selectedSubregion || country.subregion === selectedSubregion;
            
            return nameMatch && regionMatch && subregionMatch;
        });
        
        this.sortCountries();
        this.renderCountries();
    }

    sortCountries() {
        const sortByValue = this.sortBy.value;
        
        this.filteredCountries.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortByValue) {
                case 'population':
                    valueA = a.population || 0;
                    valueB = b.population || 0;
                    return valueB - valueA; // Descending
                case 'area':
                    valueA = a.area || 0;
                    valueB = b.area || 0;
                    return valueB - valueA; // Descending
                case 'capital':
                    valueA = (a.capital && a.capital[0]) || '';
                    valueB = (b.capital && b.capital[0]) || '';
                    return valueA.localeCompare(valueB);
                default: // name
                    return a.name.common.localeCompare(b.name.common);
            }
        });
    }

    // Country rendering
    renderCountries() {
        if (this.filteredCountries.length === 0) {
            this.countriesGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No countries found matching your criteria.</p>
                </div>
            `;
            this.paginationElement.innerHTML = '';
            return;
        }
        
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const countriesToShow = this.filteredCountries.slice(start, end);
        
        this.countriesGrid.innerHTML = '';
        
        countriesToShow.forEach(country => {
            const countryCard = this.createCountryCard(country);
            this.countriesGrid.appendChild(countryCard);
        });
        
        this.setupPagination();
    }

    createCountryCard(country) {
        const card = document.createElement('div');
        card.classList.add('country-card');
        card.innerHTML = `
            <img src="${country.flags.png}" alt="${country.name.common} flag" class="country-flag" loading="lazy">
            <div class="country-info">
                <h3 class="country-name">${country.name.common}</h3>
                <div class="country-details">
                    <div class="country-detail">
                        <strong>Capital:</strong> 
                        <span>${country.capital ? country.capital[0] : 'N/A'}</span>
                    </div>
                    <div class="country-detail">
                        <strong>Population:</strong> 
                        <span>${this.formatNumber(country.population)}</span>
                    </div>
                    <div class="country-detail">
                        <strong>Region:</strong> 
                        <span>${country.region}</span>
                    </div>
                    <div class="country-detail">
                        <strong>Area:</strong> 
                        <span>${this.formatNumber(country.area)} km²</span>
                    </div>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => this.showCountryDetails(country));
        return card;
    }

    showCountryDetails(country) {
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
                            <div class="detail-item">
                                <strong>Official Name:</strong> 
                                <span>${country.name.official}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Native Name:</strong> 
                                <span>${this.getNativeName(country)}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Region:</strong> 
                                <span>${country.region}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Subregion:</strong> 
                                <span>${country.subregion || 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Capital:</strong> 
                                <span>${country.capital ? country.capital.join(', ') : 'N/A'}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Population:</strong> 
                                <span>${this.formatNumber(country.population)}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Area:</strong> 
                                <span>${this.formatNumber(country.area)} km²</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>Languages & Currency</h3>
                        <div class="detail-list">
                            <div class="detail-item">
                                <strong>Languages:</strong> 
                                <span>${this.getLanguages(country)}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Currencies:</strong> 
                                <span>${this.getCurrencies(country)}</span>
                            </div>
                            <div class="detail-item">
                                <strong>Timezones:</strong> 
                                <span>${country.timezones ? country.timezones.join(', ') : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.countryModal.classList.add('active');
    }

    // Flag Gallery
    renderFlagGallery() {
        // Get selected region from the dropdown
        const selectedRegion = this.flagRegionFilter?.value || '';
        let countries = this.allCountries;

        // Filter by region if selected
        if (selectedRegion && selectedRegion !== 'All' && selectedRegion !== '') {
            countries = countries.filter(c => c.region === selectedRegion);
        }

        // Clear container
        this.flagsContainer.innerHTML = '';

        // Render each flag as a flag-item (for grid/list view)
        countries.forEach(country => {
            const flagItem = this.createFlagItem(country);
            this.flagsContainer.appendChild(flagItem);
        });
    }

    createFlagItem(country) {
        const flagItem = document.createElement('div');
        flagItem.classList.add('flag-item');
        flagItem.innerHTML = `
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="flag-img" loading="lazy">
            <div class="flag-name">${country.name.common}</div>
        `;
        flagItem.addEventListener('click', () => this.showFlagModal(country));
        return flagItem;
    }

    toggleFlagView(view) {
        if (!this.flagsContainer) return;

        this.gridViewBtn?.classList.toggle('active', view === 'grid');
        this.listViewBtn?.classList.toggle('active', view === 'list');

        this.flagsContainer.classList.toggle('grid-view', view === 'grid');
        this.flagsContainer.classList.toggle('list-view', view === 'list');

        // Update flag item classes for list view
        const flagItems = this.flagsContainer.querySelectorAll('.flag-item');
        flagItems.forEach(item => {
            item.classList.toggle('list-view', view === 'list');
        });
    }

    // Country Comparison
    populateComparisonSelectors() {
        if (!this.compareCountry1 || !this.compareCountry2) return;
        
        const sortedCountries = [...this.allCountries].sort((a, b) => 
            a.name.common.localeCompare(b.name.common)
        );
        
        [this.compareCountry1, this.compareCountry2].forEach(select => {
            select.innerHTML = '<option value="">Choose a country...</option>';
            sortedCountries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.name.common;
                option.textContent = country.name.common;
                select.appendChild(option);
            });
        });
    }

    handleComparison() {
        const country1Name = this.compareCountry1?.value;
        const country2Name = this.compareCountry2?.value;
        
        if (!country1Name || !country2Name) {
            this.comparisonResult.innerHTML = '';
            return;
        }
        
        const country1 = this.allCountries.find(c => c.name.common === country1Name);
        const country2 = this.allCountries.find(c => c.name.common === country2Name);
        
        if (country1 && country2) {
            this.renderComparison(country1, country2);
        }
    }

    renderComparison(country1, country2) {
        this.comparisonResult.innerHTML = `
            <div class="compare-card">
                <img src="${country1.flags.png}" alt="${country1.name.common} flag" class="compare-flag">
                <h3 class="compare-name">${country1.name.common}</h3>
                <div class="compare-details">
                    ${this.createComparisonDetails(country1)}
                </div>
            </div>
            <div class="compare-card">
                <img src="${country2.flags.png}" alt="${country2.name.common} flag" class="compare-flag">
                <h3 class="compare-name">${country2.name.common}</h3>
                <div class="compare-details">
                    ${this.createComparisonDetails(country2)}
                </div>
            </div>
        `;
    }

    createComparisonDetails(country) {
        return `
            <div class="compare-detail">
                <strong>Capital:</strong>
                <span>${country.capital ? country.capital[0] : 'N/A'}</span>
            </div>
            <div class="compare-detail">
                <strong>Population:</strong>
                <span>${this.formatNumber(country.population)}</span>
            </div>
            <div class="compare-detail">
                <strong>Area:</strong>
                <span>${this.formatNumber(country.area)} km²</span>
            </div>
            <div class="compare-detail">
                <strong>Region:</strong>
                <span>${country.region}</span>
            </div>
            <div class="compare-detail">
                <strong>Languages:</strong>
                <span>${this.getLanguages(country)}</span>
            </div>
            <div class="compare-detail">
                <strong>Currency:</strong>
                <span>${this.getCurrencies(country)}</span>
            </div>
        `;
    }

    // Statistics
    updateStatistics() {
        if (!this.totalCountries) return;
        
        const totalPop = this.allCountries.reduce((sum, country) => sum + (country.population || 0), 0);
        const totalAreaSum = this.allCountries.reduce((sum, country) => sum + (country.area || 0), 0);
        const languages = new Set();
        
        this.allCountries.forEach(country => {
            if (country.languages) {
                Object.values(country.languages).forEach(lang => languages.add(lang));
            }
        });
        
        this.totalCountries.textContent = this.allCountries.length.toLocaleString();
        this.totalPopulation.textContent = this.formatNumber(totalPop);
        this.totalArea.textContent = this.formatNumber(totalAreaSum) + ' km²';
        this.totalLanguages.textContent = languages.size.toLocaleString();
    }

    renderCharts() {
        this.renderRegionChart();
        this.renderPopulationChart();
    }

    renderRegionChart() {
        const regionCanvas = document.getElementById('regionChart');
        if (!regionCanvas) return;
        
        const regionCounts = {};
        this.allCountries.forEach(country => {
            regionCounts[country.region] = (regionCounts[country.region] || 0) + 1;
        });
        
        if (this.regionChart) {
            this.regionChart.destroy();
        }
        
        this.regionChart = new Chart(regionCanvas, {
            type: 'doughnut',
            data: {
                labels: Object.keys(regionCounts),
                datasets: [{
                    data: Object.values(regionCounts),
                    backgroundColor: [
                        '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderPopulationChart() {
        const populationCanvas = document.getElementById('populationChart');
        if (!populationCanvas) return;
        
        const top10 = [...this.allCountries]
            .sort((a, b) => (b.population || 0) - (a.population || 0))
            .slice(0, 10);
        
        if (this.populationChart) {
            this.populationChart.destroy();
        }
        
        this.populationChart = new Chart(populationCanvas, {
            type: 'bar',
            data: {
                labels: top10.map(c => c.name.common),
                datasets: [{
                    label: 'Population',
                    data: top10.map(c => c.population || 0),
                    backgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat().format(value);
                            }
                        }
                    }
                }
            }
        });
    }

    // Pagination
    setupPagination() {
        if (!this.paginationElement) return;
        
        this.paginationElement.innerHTML = '';
        const totalPages = Math.ceil(this.filteredCountries.length / this.itemsPerPage);
        
        if (totalPages <= 1) return;
        
        // Previous button
        const prevBtn = this.createPageButton('« Previous', this.currentPage - 1, this.currentPage === 1);
        this.paginationElement.appendChild(prevBtn);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                const pageBtn = this.createPageButton(i.toString(), i, false, i === this.currentPage);
                this.paginationElement.appendChild(pageBtn);
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'page-ellipsis';
                this.paginationElement.appendChild(ellipsis);
            }
        }
        
        // Next button
        const nextBtn = this.createPageButton('Next »', this.currentPage + 1, this.currentPage === totalPages);
        this.paginationElement.appendChild(nextBtn);
    }

    createPageButton(text, page, disabled, active = false) {
        const button = document.createElement('button');
        button.classList.add('page-btn');
        if (disabled) button.disabled = true;
        if (active) button.classList.add('active');
        button.textContent = text;
        
        if (!disabled) {
            button.addEventListener('click', () => {
                this.currentPage = page;
                this.renderCountries();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
        
        return button;
    }

    // Utility functions
    updateRegionLists() {
        const regions = [...new Set(this.allCountries.map(country => country.region))].sort();
        
        [this.regionFilter, this.flagRegionFilter].forEach(select => {
            if (!select) return;
            
            regions.forEach(region => {
                const option = document.createElement('option');
                option.value = region;
                option.textContent = region;
                select.appendChild(option);
            });
        });
    }

    closeModals() {
        this.countryModal?.classList.remove('active');
        this.flagModal?.classList.remove('active');
    }

    formatNumber(num) {
        if (!num && num !== 0) return 'N/A';
        return new Intl.NumberFormat().format(num);
    }

    getNativeName(country) {
        if (!country.name.nativeName) return 'N/A';
        const nativeNames = Object.values(country.name.nativeName);
        return nativeNames[0]?.common || 'N/A';
    }

    getLanguages(country) {
        if (!country.languages) return 'N/A';
        return Object.values(country.languages).join(', ');
    }

    getCurrencies(country) {
        if (!country.currencies) return 'N/A';
        return Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ');
    }

    getCallingCode(country) {
        if (!country.idd || !country.idd.root) return 'N/A';
        const suffixes = country.idd.suffixes || [''];
        return `${country.idd.root}${suffixes[0]}`;
    }

    // Stats
    populateStatsCountryDropdown() {
        this.statsCountrySelect.innerHTML = '';
        this.allCountries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name.common;
            option.textContent = country.name.common;
            this.statsCountrySelect.appendChild(option);
        });
    }

    showCountryStats(countryName) {
        const country = this.allCountries.find(c => c.name.common === countryName);
        if (!country) return;
        this.countryStats.innerHTML = `
            <h3>${country.name.common}</h3>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Subregion:</strong> ${country.subregion || 'N/A'}</p>
            <p><strong>Capital:</strong> ${country.capital ? country.capital.join(', ') : 'N/A'}</p>
            <p><strong>Languages:</strong> ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
            <p><strong>Currencies:</strong> ${country.currencies ? Object.values(country.currencies).map(cur => cur.name).join(', ') : 'N/A'}</p>
            <p><strong>Timezones:</strong> ${country.timezones ? country.timezones.join(', ') : 'N/A'}</p>
        `;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CountryPortal();
});
