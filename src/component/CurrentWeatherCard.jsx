import React from 'react'

function CurrentWeatherCard  ({currentWeather, getWeatherCondition, getWeatherAdvice}) {
    if(!currentWeather){
        return null
    }
  return (
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
  )
}

export default CurrentWeatherCard
