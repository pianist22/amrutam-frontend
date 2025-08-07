'use client';

import { ArrowLeft } from "lucide-react";
import Sanscript from "sanscript";

const DEVANAGARI_FONT = {
  fontFamily: "'Noto Sans Devanagari', 'Noto Serif Devanagari', serif"
};

// Section Wrapper
const Section = ({ icon, label, onEdit, children }) => (
  <section className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
    {/* Header */}
    <div className="flex items-center border-b border-slate-100 px-5 py-4 bg-slate-50">
      <span className="text-green-700 font-bold text-lg sm:text-xl flex-1 flex items-center gap-2">
        {icon && <span className="text-2xl">{icon}</span>}
        {label}
      </span>
      <button
        aria-label="Edit"
        onClick={onEdit}
        className="rounded-full p-2 text-green-700 hover:bg-green-100 transition"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
    <div className="px-5 py-5">{children}</div>
  </section>
);

// Field Component
const Field = ({ label, children, className = "" }) => (
  <div className={`flex flex-col sm:flex-row sm:items-start gap-2 mb-4 ${className}`}>
    <span className="sm:w-48 w-full text-slate-800 font-semibold">{label}</span>
    <span className="flex-1 text-slate-700">{children}</span>
  </div>
);

// Pill Chip
const Pill = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium border ${className}`}
  >
    {children}
  </span>
);

// ListChip Wrapper
const ListChip = ({ children }) => (
  <li className="inline-block mr-2 mb-2">{children}</li>
);

// Sanskrit Rendering
const renderSanskrit = (word) => {
  const devanagariWord = Sanscript.t(word.trim().toLowerCase(), "iast", "devanagari");
  return (
    <span
      style={DEVANAGARI_FONT}
      className="text-2xl font-bold text-green-800 tracking-wide"
    >
      {devanagariWord}
    </span>
  );
};

export default function Step5Overview({ formData, goToStep }) {
  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6 px-2">
      
      {/* General Information */}
      <Section icon="📝" label="General Information" onEdit={() => goToStep(0)}>
        <div className="flex flex-col items-center text-center gap-5">
          {/* Bigger Centered Image */}
          <img
            src={formData.generalInfo.ingredientURL}
            alt={formData.generalInfo.ingredientName}
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg bg-white border object-cover shadow"
          />
          <div className="w-full">
            <Field label="Ingredient Name">{formData.generalInfo.ingredientName}</Field>
            <Field label="Scientific Name">{formData.generalInfo.scientificName}</Field>
            <Field label="Sanskrit Name">{renderSanskrit(formData.generalInfo.sanskritName)}</Field>
            <Field label="Description">
              <span className="block break-words whitespace-pre-line text-slate-700 leading-relaxed max-h-48 overflow-auto">
                {formData.generalInfo.ingredientDescription}
              </span>
            </Field>
          </div>
        </div>
      </Section>

      {/* Benefits */}
      <Section icon="✨" label="Benefits" onEdit={() => goToStep(1)}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Field label="Why To Use">
              <ul className="flex flex-wrap gap-2">
                {formData.benefitsStep.whyToUse.filter(Boolean).map((txt, i) => (
                  <ListChip key={i}>
                    <Pill className="bg-green-100 border-green-200 text-green-900">{txt}</Pill>
                  </ListChip>
                ))}
              </ul>
            </Field>
            <Field label="Benefits">
              <ul className="flex flex-wrap gap-2">
                {formData.benefitsStep.benefits
                  .filter(b => b.emoji && b.text)
                  .map((b, i) => (
                    <ListChip key={i}>
                      <Pill className="bg-yellow-50 border-yellow-200 text-yellow-900">
                        <span className="text-base">{b.emoji}</span> {b.text}
                      </Pill>
                    </ListChip>
                  ))}
              </ul>
            </Field>
          </div>
          <div>
            <Field label="Prakriti Impact">
              <ul className="space-y-1">
                {["vata", "kapha", "pitta"].map((key) => (
                  <li key={key}>
                    <span className="capitalize font-semibold text-slate-800">{key}:</span>{" "}
                    <span className="text-slate-700">{formData.benefitsStep.prakritiImpact[key]}</span>
                    {formData.benefitsStep.prakritiImpact[`${key}Reason`] && (
                      <span className="text-slate-500"> – {formData.benefitsStep.prakritiImpact[`${key}Reason`]}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Field>
          </div>
        </div>
      </Section>

      {/* Properties */}
      <Section icon="⚗️" label="Properties" onEdit={() => goToStep(2)}>
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="flex-1 min-w-0">
            <Field label="Ayurvedic Properties">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {Object.entries(formData.propertiesStep.ayurvedicProperties).map(([k, v]) => (
                  <div key={k}>
                    <span className="font-semibold text-slate-800">{capitalize(k)}:</span>{" "}
                    <span className="text-slate-700">{v}</span>
                  </div>
                ))}
              </div>
            </Field>
            <Field label="Therapeutic Uses">
              <ul className="flex flex-wrap gap-2">
                {formData.propertiesStep.therapeuticUses.filter(Boolean).map((u, i) => (
                  <ListChip key={i}>
                    <Pill className="bg-blue-50 border-blue-200 text-blue-800">{u}</Pill>
                  </ListChip>
                ))}
              </ul>
            </Field>
          </div>
          <div className="flex-1 min-w-0">
            <Field label="Important Formulations">
              <ul className="flex flex-wrap gap-2">
                {formData.propertiesStep.importantFormulations.filter(f => f.name).map((f, i) => (
                  <ListChip key={i}>
                    <Pill className="bg-violet-50 border-violet-200 text-violet-900">
                      <span className="text-lg">{f.icon}</span> {f.name}
                    </Pill>
                  </ListChip>
                ))}
              </ul>
            </Field>
          </div>
        </div>
      </Section>

      {/* Other */}
      <Section icon="🌎" label="Other" onEdit={() => goToStep(3)}>
        <Field label="Plant Parts & Purpose">
          <ul className="flex flex-wrap gap-2">
            {formData.othersStep.plantParts.filter(p => p.part && p.description).map((p, i) => (
              <ListChip key={i}>
                <Pill className="bg-violet-50 border-violet-200 text-violet-900">
                  <span className="font-semibold">{p.part}:</span> {p.description}
                </Pill>
              </ListChip>
            ))}
          </ul>
        </Field>
        <Field label="Best Combined With">{formData.othersStep.bestCombinedWith}</Field>
        <Field label="Geographical Location">{formData.othersStep.geographicalLocation}</Field>
      </Section>
    </div>
  );
}

// Helper
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
