import React, { useEffect, useState } from "react"
import "./App.css"
import SearchForm from "./component/SearchForm"
import CityResults from "./component/CityResults"
import SelectedCity from "./component/SelectedCity"
import CurrentWeatherCard from "./component/CurrentWeatherCard"
import SavedCities from "./SavedCities"
import { getWeatherAdvice, getLocalTime, getWeatherCondition } from "./utils/weatherHelpers"

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
    console.log("Could not load saved cities.", error)
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
      
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
      return
    }

    setSavedCities([...savedCities, selectedCity])
  }

  function handleRemoveSavedCity(cityId){
    const updatedSavedCityList = (savedCities.filter(
      (savedCity)=>savedCity.id !==cityId
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

        <SearchForm
          city={city}
          setCity={setCity}
          isLoading={isLoading}
          selectedCity={selectedCity}
          handleResetApp={handleResetApp}
          handleSearchCity={handleSearchCity}
        />

        {error && <p className="mt-4 text-red-600">{error}</p>}

        <CityResults
          handleSelectCity={handleSelectCity}
          cityResults={cityResults}
          
        />

        <SelectedCity
          selectedCity={selectedCity}
          localTime={localTime}
          handleSaveCity={handleSaveCity}
          isSelectedCitySaved={isSelectedCitySaved}
          />

        {isWeatherLoading && (
          <p className="mt-4 text-slate-500">Loading weather...</p>
        )}

        <CurrentWeatherCard
          getWeatherAdvice={getWeatherAdvice}
          currentWeather={currentWeather}
          getWeatherCondition={getWeatherCondition}
          />

        <SavedCities
          handleRemoveSavedCity={handleRemoveSavedCity}
          handleSelectCity={handleSelectCity}
          savedCities={savedCities}
          handleClearSavedCities={handleClearSavedCities}
          />
      </section>
    </main>
  )
}

export default App