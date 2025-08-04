# World Countries Portal 🌍

A comprehensive, modern web application that provides detailed information about every country in the world using the REST Countries API. This portal offers an intuitive interface to explore nations, compare countries, view statistical data, and browse flag galleries.

## ✨ Features

### 🏠 Home Section
- **Advanced Search**: Search countries by name, capital, or country codes (ISO 2/3)
- **Smart Filtering**: Filter by region and subregion with dynamic updates
- **Flexible Sorting**: Sort countries by name, population, area, or capital
- **Pagination**: Efficient browsing through large datasets
- **Country Cards**: Clean, informative cards with flags and key statistics

### 🚩 Flag Gallery
- **Interactive Gallery**: Browse all country flags in grid or list view
- **Regional Filtering**: Filter flags by geographic regions
- **Modal Preview**: Click any flag for an enlarged view with country details
- **Responsive Layout**: Optimized for all screen sizes

### ⚖️ Country Comparison
- **Side-by-Side Comparison**: Compare any two countries directly
- **Comprehensive Metrics**: Population, area, languages, currencies, and more
- **Visual Comparison**: Easy-to-read comparison cards

### 📊 Statistics Dashboard
- **Global Statistics**: Total countries, world population, land area, and languages
- **Interactive Charts**: 
  - Countries by region (doughnut chart)
  - Top 10 most populous countries (bar chart)
- **Real-time Updates**: Statistics update based on available data

### 🎨 User Experience
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: Graceful handling of network issues
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠️ Technical Implementation

### Architecture
- **Vanilla JavaScript**: Pure ES6+ JavaScript with class-based architecture
- **REST API Integration**: Uses REST Countries API v3.1
- **Modern CSS**: CSS Grid, Flexbox, and CSS Custom Properties
- **Chart.js**: Interactive data visualizations
- **Font Awesome**: Comprehensive icon library

### API Features Utilized
- Country names (common, official, native)
- Geographic data (region, subregion, coordinates)
- Population and area statistics
- Languages and currencies
- Flags (PNG and SVG formats)
- Calling codes and timezones
- Border countries
- And much more...

### Performance Optimizations
- **Lazy Loading**: Images load only when needed
- **Efficient Pagination**: Process large datasets smoothly
- **Debounced Search**: Optimized search performance
- **Memory Management**: Proper cleanup of chart instances

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for API calls and CDN resources)

### Installation
1. Clone or download the repository
2. Open `index.html` in your web browser
3. That's it! No build process required.

### File Structure
```
wikicountry/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── app.js             # Main application logic
├── script.js          # Alternative/legacy script file
└── README.md          # This documentation
```

## 🌐 API Information

This application uses the [REST Countries API](https://restcountries.com/) which provides:
- **Endpoint**: `https://restcountries.com/v3.1/all`
- **Data Format**: JSON
- **Rate Limiting**: None specified
- **CORS**: Enabled for browser requests

## 🎯 Usage Examples

### Search Functionality
- Search by country name: "japan", "united states"
- Search by capital: "tokyo", "washington"
- Search by codes: "jp", "usa", "jpn"

### Filtering
- Filter by region: Africa, Americas, Asia, Europe, Oceania
- Filter by subregion: Updates dynamically based on region selection
- Sort results by various criteria

### Comparison
- Select any two countries from dropdown menus
- View detailed side-by-side comparison
- Includes population, area, languages, currencies, and more

## 🎨 Customization

### Themes
The application supports both light and dark themes:
- Light theme: Clean, bright interface
- Dark theme: Easy on the eyes for low-light environments

### Responsive Breakpoints
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🔧 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+

## 📱 Mobile Features

- Touch-friendly interface
- Optimized layouts for small screens
- Swipe-friendly modals and galleries
- Responsive typography and spacing

## 🚦 Error Handling

The application includes comprehensive error handling for:
- Network connectivity issues
- API failures
- Missing or malformed data
- Browser compatibility issues

## 🔮 Future Enhancements

Potential features for future versions:
- [ ] Map integration with country highlighting
- [ ] Historical data and trends
- [ ] Export functionality (PDF, CSV)
- [ ] Favorites/bookmarking system
- [ ] Advanced statistical comparisons
- [ ] Language localization
- [ ] Offline mode with cached data

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

If you encounter any issues or have questions:
1. Check the browser console for error messages
2. Ensure you have an active internet connection
3. Try refreshing the page
4. Clear browser cache if problems persist

## 🙏 Credits

- **REST Countries API**: For providing comprehensive country data
- **Chart.js**: For beautiful, interactive charts
- **Font Awesome**: For the icon library
- **Google Fonts**: For the Inter font family

---

**Enjoy exploring the world! 🗺️**
