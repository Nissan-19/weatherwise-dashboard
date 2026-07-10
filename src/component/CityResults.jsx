import React from 'react'

function CityResults  ({handleSelectCity,cityResults }) {
  return (
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
  )
}

export default CityResults
