import React from 'react'

function SearchForm  ({handleResetApp, handleSearchCity, city, selectedCity, isLoading, setCity}) {
  return (
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
  )
}

export default SearchForm
