# WeatherWise Dashboard

WeatherWise Dashboard is a React weather application that allows users to search for cities, view current weather details, get smart weather advice, and save favorite cities for quick access.

This project was built as part of my React learning journey, with a focus on API integration, state management, component structure, localStorage, and clean UI behavior.

## Features

- Search for cities using the Open-Meteo Geocoding API
- Display city suggestions
- Select a city and view current weather
- Show temperature, humidity, wind speed, and weather condition
- Convert weather codes into readable weather descriptions
- Show smart weather advice based on temperature, wind, humidity, rain, snow, and thunderstorm conditions
- Display local time for the selected city
- Save favorite cities
- Prevent duplicate saved cities
- Load weather again by clicking a saved city
- Remove individual saved cities
- Clear all saved cities
- Persist saved cities using localStorage
- Reset the current search and weather result
- Responsive layout using Tailwind CSS

## Tech Stack

- React
- Vite
- Tailwind CSS
- JavaScript
- Open-Meteo API
- localStorage

## APIs Used

### Open-Meteo Geocoding API

Used to search cities and get location data such as city name, country, latitude, longitude, and timezone.

### Open-Meteo Forecast API

Used to fetch current weather data such as temperature, humidity, wind speed, and weather code.

## Project Structure

```txt
src/
  components/
    SearchForm.jsx
    CityResults.jsx
    SelectedCityCard.jsx
    CurrentWeatherCard.jsx
    SavedCities.jsx

  utils/
    weatherHelpers.js

  App.jsx
  App.css
```

## What I Learned

While building this project, I practiced and learned:

- Creating controlled inputs in React
- Handling form submission
- Fetching data from APIs
- Managing loading and error states
- Passing props between parent and child components
- Extracting reusable components
- Using derived values instead of unnecessary state
- Using array methods like `map()`, `some()`, and `filter()`
- Preventing duplicate saved items
- Handling event bubbling with `event.stopPropagation()`
- Persisting data with `localStorage`
- Using `JSON.stringify()` and `JSON.parse()`
- Separating helper functions into a utility file
- Building responsive UI with Tailwind CSS

## How to Run Locally

1. Clone the repository

```bash
git clone <your-repository-url>
```

2. Go into the project folder

```bash
cd weatherwise-dashboard
```

3. Install dependencies

```bash
npm install
```

4. Start the development server

```bash
npm run dev
```

5. Open the local development URL in your browser.

## Future Improvements

- Add weather icons
- Add 5-day forecast
- Add Celsius/Fahrenheit toggle
- Add dark mode
- Add recent searches
- Improve mobile UI further
- Add better user feedback messages
- Add loading skeletons

## Status

The main version of the project is complete. Future improvements may be added later as part of continued React practice.