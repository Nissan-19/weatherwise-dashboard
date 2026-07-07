import React, { useState } from "react"
import "./App.css"

function App() {
  const [city, setCity] = useState("")
  const [cityResults, setCityResults] = useState([])
  const [error, setError] = useState("")
  const [selectedCity, setSelectedCity] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [isWeatherLoading, setIsWeatherLoading] = useState(false)

  async function handleSearchCity(event) {
    event.preventDefault()

    if (city.trim() === "") {
      return
    }

    try {
      
      setIsLoading(true)
      setError("")
      setCityResults([])

      // URL does not like spaces, so we are making the city name safe for the URL
      const searchCity = encodeURIComponent(city.trim())

      // This API needs a query parameter to search for the city
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}&count=5`
        // count=5 means show max 5 cities
      )

      const data = await response.json()
      

      // The Open-Meteo API returns an object with "results" inside
      if (!data.results) {
        setError("City not found. Please try again.")
        return
      }

      setCityResults(data.results)
      console.log(data.results)
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      // Whether API succeeds or fails, stop loading
      setIsLoading(false)
    }
  }

  function getWeatherCondition(code) {
    const weatherConditions = { //instead of writng too many if conditons we are saving the codes in one object
      0: "Clear sky",           //this is called object look up
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    }

        return weatherConditions[code] || "Unknown weather"
    }

    function getWeatherAdvice(weather) {
        const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82]
        const snowCodes = [71, 73, 75]
        const thunderstormCodes = [95, 96, 99]

        if (weather.temperature_2m >= 30) {
          return "It is hot outside. Stay hydrated and try to stay indoors."
        }

        if (weather.temperature_2m <= 8) {
          return "It is cold outside. Wear warm clothes."
        }

        if (weather.wind_speed_10m >= 30) {
          return "It is windy outside. Be careful if you are going out."
        }

        if (weather.relative_humidity_2m >= 80) {
          return "It may feel humid and uncomfortable today."
        }

        if (rainCodes.includes(weather.weather_code)) {
          return "Carry an umbrella. There may be rain."
        } //For multiple possible matching values, use array.includes().

        if (snowCodes.includes(weather.weather_code)) {
          return "Snow is expected. Dress warmly and be careful outside."
        }

        if (thunderstormCodes.includes(weather.weather_code)) {
          return "Thunderstorm conditions are possible. Avoid unnecessary outdoor activity."
        }

        if (
          weather.temperature_2m >= 18 &&
          weather.temperature_2m <= 26 &&
          !rainCodes.includes(weather.weather_code)
        ) {
          return "Great weather for a walk or outdoor activity."
        }

      return "Weather looks normal. Plan your day comfortably."
    }
  async function fetchWeather(result){
    try{
      
      setIsWeatherLoading(true)
      setError("")
      setCurrentWeather(null)

      const response= await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${result.latitude}&longitude=${result.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
      )

      const data =  await response.json()

      if(!data.current){ // the weather API sends the weather data inside a property called current.
        setError("Weather is not avaliable for this city")
        return
      }

      setCurrentWeather(data.current)
      console.log("Weather Data:",data.current)
    } catch(error) {
      setError("Could not fetch eather. plese try again.")
    }finally{
      setIsWeatherLoading(false)
    }
  }

  function handleSelectCity(result) {
    setSelectedCity(result)
    setCity(`${result.name}, ${result.country}`) //template literal. It builds a string using values from the clicked city object.
    setCityResults([])
    fetchWeather(result)
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <section className="mx-auto max-w-3xl rounded-xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold text-slate-800">
          WeatherWise Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Search a city and get smart weather advice.
        </p>

        <form
          onSubmit={handleSearchCity}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            placeholder="Search City..."
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        <ul className="mt-4 space-y-2">
          {cityResults.map((result) => (
            <li
              key={result.id}
              onClick={() => handleSelectCity(result)}
              className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 hover:bg-blue-50"
            >
              <p className="font-medium">
                {result.name}, {result.country}
              </p>

              <p className="text-sm text-slate-500">
                {result.admin1 && `${result.admin1} `}
                
              </p>
            </li>
          ))}
        </ul>

        {selectedCity && (
          <div className="mt-4 rounded-lg bg-blue-50 p-4 text-slate-700">
            <p className="font-medium">
              Selected City: {selectedCity.name}, {selectedCity.country}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Timezone: {selectedCity.timezone}
            </p>
          </div>
        )}

        {isWeatherLoading && (
            <p className="mt-4 text-slate-500">Loading weather...</p>
        )}

        {currentWeather && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800">Current Weather</h2>

              <p className="mt-3 text-4xl font-bold text-slate-900">
                {currentWeather.temperature_2m}°C
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm text-slate-500">Humidity</p>
                  <p className="font-semibold text-slate-800">
                    {currentWeather.relative_humidity_2m}%
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm text-slate-500">Wind</p>
                  <p className="font-semibold text-slate-800">
                    {currentWeather.wind_speed_10m} km/h
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm text-slate-500">Weather</p>
                  <p className="font-semibold text-slate-800">
                    {getWeatherCondition(currentWeather.weather_code)}
                    
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-sm text-slate-500">💡 Smart Advice</p>
                  <p className="font-semibold text-slate-800">
                    {getWeatherAdvice(currentWeather)}
                  </p>
                </div>

              </div>
            </div>
            )}
      </section>
    </main>
  )
}

export default App