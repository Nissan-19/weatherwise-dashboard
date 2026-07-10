export function getWeatherCondition(code) {
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

  export function getWeatherAdvice(weather) {
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

  export function getLocalTime(timezone) {
    return new Date().toLocaleTimeString("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
    })
  }