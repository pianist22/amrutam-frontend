'use client';

import React, { useState } from "react";
import { X, PlusCircle } from "lucide-react";

// PARTS ENUM from your allowed list:
const PART_ENUM = ["Leaf", "Root", "Rootbark", "Fruits", "Juice/Extract", "Pulp"];

export default function Step4Others({ data, update, errors }) {
  // PLANT PARTS
  const [partSelectorOpen, setPartSelectorOpen] = useState(null);

  const handlePlantPartChange = (idx, field, value) => {
    const updated = data.plantParts.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    update("plantParts", updated);
  };

  const addPlantPart = () =>
    update("plantParts", [...data.plantParts, { part: "", description: "" }]);

  const removePlantPart = idx => {
    let arr = data.plantParts.filter((_, i) => i !== idx);
    if (arr.length === 0) arr = [{ part: "", description: "" }];
    update("plantParts", arr);
  };

  // BEST COMBINED WITH & GEO LOCATION
  const handleOtherField = (field, value) => {
    update(field, value);
  };

  return (
    <div className="space-y-10">
      {/* Plant Parts */}
      <div>
        <h3 className="font-semibold text-lg mb-4">Plant Parts and Purpose</h3>
        <div className="space-y-3">
          {data.plantParts.map((item, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 mb-1 relative">
              <div className="flex flex-col sm:flex-row gap-2 flex-1">
                {/* Enum dropdown for Part */}
                <select
                  value={item.part}
                  onChange={e => handlePlantPartChange(idx, "part", e.target.value)}
                  className="w-full sm:w-40 border rounded p-2"
                  required
                >
                  <option value="">Select Part</option>
                  {PART_ENUM.map(part => (
                    <option key={part} value={part}>{part}</option>
                  ))}
                </select>

                {/* Description Textbox */}
                <input
                  type="text"
                  placeholder="Description"
                  className="flex-1 border rounded p-2"
                  value={item.description}
                  onChange={e => handlePlantPartChange(idx, "description", e.target.value)}
                />
              </div>
              <button
                type="button"
                className="ml-0 md:ml-2 p-2 rounded hover:bg-red-100 bg-white border"
                onClick={() => removePlantPart(idx)}
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-2 flex items-center gap-1 text-green-700 font-semibold"
          onClick={addPlantPart}
        >
          <PlusCircle className="w-5 h-5" /> Add Plant Part
        </button>
        {errors.plantParts && <div className="text-red-600 text-sm">{errors.plantParts}</div>}
      </div>

      {/* Best Combined With */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Best Combined With</h3>
        <input
          type="text"
          value={data.bestCombinedWith}
          onChange={e => handleOtherField("bestCombinedWith", e.target.value)}
          placeholder="E.g. Guggulu"
          className="w-full border rounded p-2"
        />
        {errors.bestCombinedWith && <div className="text-red-600 text-sm">{errors.bestCombinedWith}</div>}
      </div>

      {/* Geo Location */}
      <div>
        <h3 className="font-semibold text-lg mb-2">Geographical Location</h3>
        <input
          type="text"
          value={data.geographicalLocation}
          onChange={e => handleOtherField("geographicalLocation", e.target.value)}
          placeholder="E.g. India"
          className="w-full border rounded p-2"
        />
        {errors.geographicalLocation && <div className="text-red-600 text-sm">{errors.geographicalLocation}</div>}
      </div>
    </div>
  );
}
