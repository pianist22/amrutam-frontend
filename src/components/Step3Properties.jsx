'use client';

import React, { useState } from "react";
import { X, PlusCircle } from "lucide-react";

// You can replace these with icons/emoji or SVG/URL options
const ICON_CHOICES = [
  "🍃",
  "💊",
  "🧴",
  "🥼",
  "🌿", 
  "🌸", 
  "🍁"
];

const AYURVEDIC_OPTIONS = [
  'Katu (Pungent)', 'Ushna (Hot)', 'Laghu (Light)', 'Ruksha (Dry)', 'Tikshna (Sharp)'
];

export default function Step3Properties({ data, update, errors }) {
  // AYURVEDIC PROPERTIES
  const handleAyurvedicChange = (field, value) => {
    update("ayurvedicProperties", {
      ...data.ayurvedicProperties,
      [field]: value
    });
  };

  // IMPORTANT FORMULATIONS
  const [activeIconIdx, setActiveIconIdx] = useState(-1);
  const handleFormulationChange = (idx, key, value) => {
    const arr = data.importantFormulations.map((f, i) => i === idx ? { ...f, [key]: value } : f);
    update("importantFormulations", arr);
  };
  const addFormulation = () => update("importantFormulations", [...data.importantFormulations, { icon: "", name: "" }]);
  const removeFormulation = idx => {
    let arr = data.importantFormulations.filter((_, i) => i !== idx);
    if (arr.length === 0) arr = [{ icon: "", name: "" }];
    update("importantFormulations", arr);
  };

  // THERAPEUTIC USES
  const handleTherapeuticChange = (idx, value) => {
    const arr = [...data.therapeuticUses];
    arr[idx] = value;
    update("therapeuticUses", arr);
  };
  const addTherapeutic = () => update("therapeuticUses", [...data.therapeuticUses, ""]);
  const removeTherapeutic = idx => {
    let arr = data.therapeuticUses.filter((_, i) => i !== idx);
    if (arr.length === 0) arr = [""];
    update("therapeuticUses", arr);
  };

  return (
    <div className="space-y-8">
      {/* Ayurvedic Properties */}
      <div>
        <h3 className="font-semibold mb-4">Ayurvedic Properties</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["rasa", "veerya", "guna", "vipaka"].map((field, idx) => (
            <select
              key={field}
              className="w-full border rounded p-2"
              value={data.ayurvedicProperties[field]}
              onChange={e => handleAyurvedicChange(field, e.target.value)}
              required
            >
              <option value="">{field.charAt(0).toUpperCase() + field.slice(1)}...</option>
              {AYURVEDIC_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ))}
        </div>
        {errors.ayurvedicProperties && <div className="text-red-600 text-sm">{errors.ayurvedicProperties}</div>}
      </div>

      {/* Important Formulations */}
      <div>
        <h3 className="font-semibold mb-4">Important Formulations</h3>
        {data.importantFormulations.map((form, idx) => (
          <div key={idx} className="flex gap-3 items-center mb-2 relative">
            <button
              type="button"
              className="w-10 h-10 border rounded-full bg-white flex items-center justify-center"
              onClick={() => setActiveIconIdx(activeIconIdx === idx ? -1 : idx)}
            >
              <span className="text-xl">{form.icon || ICON_CHOICES[0]}</span>
            </button>
            {/* Popup for icon picker */}
            {activeIconIdx === idx && (
              <div className="absolute top-12 left-0 z-40 p-2 grid grid-cols-4 gap-2 bg-white border rounded shadow">
                {ICON_CHOICES.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    className="text-2xl"
                    onClick={() => {
                      handleFormulationChange(idx, "icon", icon);
                      setActiveIconIdx(-1);
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            )}
            <input
              type="text"
              className="flex-1 border rounded p-2"
              placeholder="Formulation name"
              value={form.name}
              onChange={e => handleFormulationChange(idx, "name", e.target.value)}
            />
            <button type="button" className="p-1" onClick={() => removeFormulation(idx)}>
              <X className="w-5 h-5 text-red-600" />
            </button>
          </div>
        ))}
        <button type="button" onClick={addFormulation} className="flex items-center gap-2 text-green-700 font-semibold mt-2">
          <PlusCircle className="w-5 h-5" /> Add Another Items
        </button>
        {errors.importantFormulations && <div className="text-red-600 text-sm">{errors.importantFormulations}</div>}
      </div>

      {/* Therapeutic Uses */}
      <div>
        <h3 className="font-semibold mb-4">Therapeutic Uses</h3>
        {data.therapeuticUses.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              className="flex-1 border rounded p-2"
              value={item}
              placeholder="Enter here"
              onChange={e => handleTherapeuticChange(idx, e.target.value)}
            />
            <button type="button" className="p-1 rounded hover:bg-red-100" onClick={() => removeTherapeutic(idx)}>
              <X className="w-5 h-5 text-red-600" />
            </button>
          </div>
        ))}
        <button type="button" onClick={addTherapeutic} className="flex items-center gap-2 text-green-700 font-semibold">
          <PlusCircle className="w-5 h-5" /> Add Another Items
        </button>
        {errors.therapeuticUses && <div className="text-red-600 text-sm">{errors.therapeuticUses}</div>}
      </div>
    </div>
  );
}
