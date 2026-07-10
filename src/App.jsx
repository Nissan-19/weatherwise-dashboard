import React, { useEffect, useState } from "react"
import "./App.css"

function App() {
  const [city, setCity] = useState("")
  const [cityResults, setCityResults] = useState([])
  const [error, setError] = useState("")
  const [selectedCity, setSelectedCity] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentWeather, setCurrentWeather] = useState(null)
  const [isWeatherLoading, setIsWeatherLoading] = useState(false)
  const [localTime, setLocalTime] = useState("")
  
  const [savedCities, setSavedCities] = useState(() => { //lazy initial state // beacuse we dont want an empty array everytime
  try {                                                  //   if local storage has cities then start with cities or empty array
    const storedCities = localStorage.getItem("savedCities")

    if (!storedCities) {
      return []
    }

    const parsedCities = JSON.parse(storedCities)

    if (Array.isArray(parsedCities)) { //to check if the parsed result is really an array
      return parsedCities
    }

    return []
  } catch (error) {
    console.log("Could not load saved cities", error)
    localStorage.removeItem("savedCities")
    return []
  }
})

    useEffect(()=>{
      localStorage.setItem("savedCities", JSON.stringify(savedCities))
    },[savedCities])

  useEffect(() => {
    if (!selectedCity) {
      setLocalTime("")
      return
    }

    setLocalTime(getLocalTime(selectedCity.timezone))

    const intervalId = setInterval(() => {
      setLocalTime(getLocalTime(selectedCity.timezone))
    }, 60000)

    return () => {
      clearInterval(intervalId)
    }
  }, [selectedCity?.timezone])

  async function handleSearchCity(event) {
    event.preventDefault()

    if (city.trim() === "") {
      return
    }

    try {
      setIsLoading(true)
      setError("")
      setCityResults([])
      setSelectedCity(null)
      setCurrentWeather(null)
      setLocalTime("")

      const searchCity = encodeURIComponent(city.trim())

      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchCity}&count=5`
      )

      const data = await response.json()

      if (!data.results) {
        setError("City not found. Please try again.")
        return
      }

      setCityResults(data.results)
      console.log(data.results)
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  function getWeatherCondition(code) {
    const weatherConditions = {
      0: "Clear sky",
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
    }

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

  async function fetchWeather(result) {
    try {
      setIsWeatherLoading(true)
      setError("")
      setCurrentWeather(null)

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${result.latitude}&longitude=${result.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
      )

      const data = await response.json()

      if (!data.current) {
        setError("Weather is not available for this city.")
        return
      }

      setCurrentWeather(data.current)
      console.log("Weather Data:", data.current)
    } catch (error) {
      setError("Could not fetch weather. Please try again.")
    } finally {
      setIsWeatherLoading(false)
    }
  }

  function handleSelectCity(result) {
    setSelectedCity(result)
    setCity(`${result.name}, ${result.country}`)
    setCityResults([])
    fetchWeather(result)
  }

  function getLocalTime(timezone) {
    return new Date().toLocaleTimeString("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  function handleResetApp() {
    setCity("")
    setCityResults([])
    setError("")
    setSelectedCity(null)
    setCurrentWeather(null)
    setLocalTime("")
    setIsLoading(false)
    setIsWeatherLoading(false)
  }

  function handleSaveCity() {
    if (!selectedCity) {
      return
    }

    const alreadySaved = savedCities.some(
      (savedCity) => savedCity.id === selectedCity.id
    )

    if (alreadySaved) {
      console.log("City already exists")
      return
    }

    setSavedCities([...savedCities, selectedCity])
  }

  function handleRemoveSavedCity(cityId){
    const updatedSavedCityList = (savedCities.filter(
      (savedCity)=>savedCity.id !=cityId
    ))

    setSavedCities(updatedSavedCityList)
  }

  function handleClearSavedCities() {
    setSavedCities([])
  }

  const isSelectedCitySaved =  //this is derived value
    selectedCity && savedCities.some((savedCity)=>savedCity.id === selectedCity.id)
    //If a city is selected, check whether that selected city already exists in savedCities.


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
          className="mx-auto mt-6 flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            placeholder="Search City..."
            value={city}
            onChange={(event) => setCity(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500 sm:flex-1"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>

          {selectedCity && (
            <button
              type="button"
              onClick={handleResetApp}
              className="w-full rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 sm:w-auto"
            >
              Reset
            </button>
          )}
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
                {result.admin1 && `${result.admin1}`}
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
              Local Time: {localTime}
            </p>

            <button
              type="button"
              onClick={handleSaveCity}
              disabled={isSelectedCitySaved}
             className="mt-3 rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSelectedCitySaved ? "Saved" : "Save City"}
            </button>
            {isSelectedCitySaved &&(
              <p className="mt-2 text-sm text-green-700">
                This City is already saved.
              </p>
            )}
          </div>
        )}

        {isWeatherLoading && (
          <p className="mt-4 text-slate-500">Loading weather...</p>
        )}

        {currentWeather && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              Current Weather
            </h2>

            <p className="mt-3 text-4xl font-bold text-slate-900">
              {currentWeather.temperature_2m}°C
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
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

        {savedCities.length > 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              Saved Cities
            </h2>

            <ul className="mt-3 space-y-2">
              {savedCities.map((savedCity) => (
                <li
                  key={savedCity.id}
                  onClick={() => handleSelectCity(savedCity)}
                  className="cursor-pointer rounded-lg bg-slate-50 px-4 py-3 text-slate-700 hover:bg-blue-50"
                >
                  <span>
                    {savedCity.name}, {savedCity.country}
                  </span>

                  <button
                    type="button"
                    onClick={(event)=>{
                      event.stopPropagation()
                      handleRemoveSavedCity(savedCity.id)
                    }}
                    className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200">
                      Remove
                  </button>
                </li>
              ))}
                {savedCities.length > 1 && (
                    <button
                      type="button"
                      onClick={handleClearSavedCities}
                      className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
                    >
                      Clear All Saved Cities
                    </button>
                    )}
            </ul>
          </div>
        )}
      </section>
    </main>
  )
}

export default App