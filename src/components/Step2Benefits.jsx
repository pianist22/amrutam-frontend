'use client';

import React, { useState } from "react";
import { X, PlusCircle, Smile } from "lucide-react";

// Enum & Emoji List
const PRAKRITI_ENUM = ['Balanced', 'MidlyIncrease', 'Unbalanced', 'Aggravate'];
const EMOJI_LIST = ["🧘‍♂️", "⚖️", "💊", "🥼", "❤️", "💪", "🧬", "🌿", "😌", "🤕", "🧠"];

// Capitalize helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Step2Benefits({ data, update, errors }) {
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null);

  // WHY TO USE
  const handleWhyToUseChange = (idx, value) => {
    const newArr = [...data.whyToUse];
    newArr[idx] = value;
    update("benefitsStep", "whyToUse", newArr);
  };

  const addWhyToUse = () => {
    update("benefitsStep", "whyToUse", [...data.whyToUse, ""]);
  };

  const removeWhyToUse = (idx) => {
    const filtered = data.whyToUse.filter((_, i) => i !== idx);
    update("benefitsStep", "whyToUse", filtered.length ? filtered : [""]);
  };

  // PRAKRITI IMPACT
  const handlePrakritiChange = (field, value) => {
    update("benefitsStep", "prakritiImpact", {
      ...data.prakritiImpact,
      [field]: value
    });
  };

  // BENEFITS
  const handleBenefitChange = (idx, field, value) => {
    const updated = data.benefits.map((b, i) => i === idx ? { ...b, [field]: value } : b);
    update("benefitsStep", "benefits", updated);
  };

  const addBenefit = () => {
    update("benefitsStep", "benefits", [...data.benefits, { emoji: "", text: "" }]);
  };

  const removeBenefit = (idx) => {
    const filtered = data.benefits.filter((_, i) => i !== idx);
    update("benefitsStep", "benefits", filtered.length ? filtered : [{ emoji: "", text: "" }]);
  };

  return (
    <div className="space-y-8">

      {/* WHY TO USE */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Why To Use</h3>
        {data.whyToUse.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={item}
              className="flex-grow border rounded p-2"
              placeholder="Enter here"
              onChange={(e) => handleWhyToUseChange(idx, e.target.value)}
            />
            <button type="button" onClick={() => removeWhyToUse(idx)} className="p-1 rounded hover:bg-red-100">
              <X className="w-5 h-5 text-red-600" />
            </button>
          </div>
        ))}
        <button type="button" onClick={addWhyToUse} className="text-green-600 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> Add Another
        </button>
      </div>

      {/* PRAKRITI IMPACT */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Prakriti Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["vata", "kapha", "pitta"].map((key) => (
            <div key={key}>
              <label className="capitalize block font-medium mb-1">{capitalize(key)}</label>
              <select
                className="w-full border rounded p-2"
                value={data.prakritiImpact?.[key] || ""}
                onChange={(e) => handlePrakritiChange(key, e.target.value)}
              >
                <option value="">Select</option>
                {PRAKRITI_ENUM.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              <input
                type="text"
                className="w-full border rounded p-2 mt-2"
                placeholder={`Enter ${capitalize(key)} Reason`}
                value={data.prakritiImpact?.[`${key}Reason`] || ""}
                onChange={(e) => handlePrakritiChange(`${key}Reason`, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* BENEFITS */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Benefits</h3>
        {data.benefits.map((b, idx) => (
          <div key={idx} className="flex items-center gap-2 mb-2 relative">
            {/* Emoji Picker Button */}
            <button
              type="button"
              onClick={() => setActiveEmojiPicker(idx === activeEmojiPicker ? null : idx)}
              className="w-10 h-10 border rounded-full flex items-center justify-center"
            >
              {b.emoji ? <span className="text-xl">{b.emoji}</span> : <Smile className="w-6 h-6 text-gray-400" />}
            </button>

            {/* Emoji Picker Dropdown */}
            {activeEmojiPicker === idx && (
              <div className="absolute z-30 bg-white border rounded shadow p-2 grid grid-cols-6 gap-2 top-12 left-0">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      handleBenefitChange(idx, "emoji", emoji);
                      setActiveEmojiPicker(null);
                    }}
                    className="text-2xl"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <input
              type="text"
              placeholder="Enter benefit description"
              value={b.text}
              className="flex-grow border rounded p-2"
              onChange={(e) => handleBenefitChange(idx, "text", e.target.value)}
            />
            <button type="button" onClick={() => removeBenefit(idx)} className="p-1 rounded hover:bg-red-100">
              <X className="w-5 h-5 text-red-600" />
            </button>
          </div>
        ))}
        <button type="button" onClick={addBenefit} className="mt-2 text-green-600 flex items-center gap-2">
          <PlusCircle className="w-6 h-6" /> Add Another
        </button>
      </div>

    </div>
  );
}
