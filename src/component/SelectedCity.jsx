import React from 'react'

function SelectedCity  ({selectedCity, localTime, handleSaveCity, isSelectedCitySaved}) {
    if(!selectedCity){
        return null
    }
  return (
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
                This city is already saved.
              </p>
            )}
          </div>
  )
}

export default SelectedCity
