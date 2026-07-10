import React from 'react'

function SavedCities  ({savedCities, handleClearSavedCities, handleRemoveSavedCity, handleSelectCity})  {
    if(savedCities.length === 0){
        return null
    }
  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800">
              Saved Cities
            </h2>

            <ul className="mt-3 space-y-2">
              {savedCities.map((savedCity) => (
                <li
                  key={savedCity.id}
                  onClick={() => handleSelectCity(savedCity)}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-3 text-slate-700 hover:bg-blue-50"
                >
                  <span className="min-w-0 truncate font-medium">
                    {savedCity.name}, {savedCity.country}
                  </span>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      handleRemoveSavedCity(savedCity.id)
                    }}
                    className="shrink-0 rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
                  >
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
  )
}

export default SavedCities
