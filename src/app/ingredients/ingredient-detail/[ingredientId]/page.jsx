'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MoreVertical, Loader2, PlusCircle, X, Smile, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import Sanscript from "sanscript";

// --- STYLE CONSTANT
const DEVANAGARI_FONT = {
  fontFamily: "'Noto Sans Devanagari', 'Noto Serif Devanagari', serif"
};

const AYURVEDIC_OPTIONS = [
  'Katu (Pungent)', 'Ushna (Hot)', 'Laghu (Light)', 'Ruksha (Dry)', 'Tikshna (Sharp)'
];
const PART_ENUM = ["Leaf", "Root", "Rootbark", "Fruits", "Juice/Extract", "Pulp"];
const PRAKRITI_ENUM = ['Balanced', 'MidlyIncrease', 'Unbalanced', 'Aggravate'];
const ICON_CHOICES = ["🍃", "💊", "🧴", "🥼", "🌿", "🌸", "🍁"];
const EMOJI_LIST = ["🧘‍♂️", "⚖️", "💊", "🩸", "❤️", "💪", "🧬", "🌿", "😌", "🤕", "🧠"];

function Section({ icon, label, actions, children }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
      <div className="flex items-center border-b border-slate-100 px-5 py-4 bg-slate-50">
        <span className="text-green-700 font-bold text-lg sm:text-xl flex-1 flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          {label}
        </span>
        <div>{actions}</div>
      </div>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      <span className="sm:w-48 w-full text-slate-800 font-semibold">{label}</span>
      <span className="flex-1 text-slate-700">{children}</span>
    </div>
  );
}

const Pill = ({ children, className = "" }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium border bg-green-100 border-green-200 text-green-900 ${className}`}>
    {children}
  </span>
);

const ListChip = ({ children }) => (
  <li className="inline-block mr-2 mb-2">{children}</li>
);

const renderSanskrit = (word) => {
  const devanagari = Sanscript.t(word.trim().toLowerCase(), "iast", "devanagari");
  return <span style={DEVANAGARI_FONT} className="text-2xl font-bold text-green-800 tracking-wide">{devanagari}</span>;
};

function ActionsMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)} onBlur={() => setTimeout(() => setOpen(false), 150)} className="rounded-full hover:bg-green-100 p-1">
        <MoreVertical className="w-6 h-6 text-green-700" />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 min-w-[180px] bg-white border rounded-lg shadow">
          <button className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100" onClick={onEdit}>
            Edit Section
          </button>
          <button className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50" onClick={onDelete}>
            Delete Ingredient
          </button>
        </div>
      )}
    </div>
  );
}

// ---- MAIN COMPONENT ----
export default function IngredientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  const ingredientId = params?.['ingredient-detail'] ?? params?.ingredientId ?? params?.id ?? "";

  const [ingredient, setIngredient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [editSection, setEditSection] = useState(null); // "general", "benefits", "properties", "others"
  const [editForm, setEditForm] = useState({});
  const [uploadingImg, setUploadingImg] = useState(false);
  const [activeIconIdx, setActiveIconIdx] = useState(-1);
  const [activeBenefitEmojiPicker, setActiveBenefitEmojiPicker] = useState(-1);

  useEffect(() => { if (ingredientId) fetchIngredient(); }, [ingredientId]);

  const fetchIngredient = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${serverUrl}/api/v1/ingredients/${ingredientId}`);
      if (!res.ok) throw new Error();
      const { ingredient: data } = await res.json();
      setIngredient(data);
    } catch {
      toast.error("Failed to fetch ingredient");
      setIngredient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!ingredient) return;
    if (!window.confirm("Are you sure you want to delete this ingredient?")) return;
    try {
      setDeleting(true);
      const res = await fetch(`${serverUrl}/api/v1/ingredients/delete-ingredient/${ingredient._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Ingredient deleted");
      fetchIngredient();
    } catch {
      toast.error("Failed to delete ingredient");
    } finally {
      setDeleting(false);
    }
  };

  // IMAGE UPLOAD HANDLER (Cloudinary or your API)
  const handleImageUpload = async (file) => {
    setUploadingImg(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await fetch(`${serverUrl}/api/v1/upload-image`, { method: "POST", body: data });
      const result = await res.json();
      if (!result.url) throw new Error();
      setEditForm(prev => ({ ...prev, ingredientURL: result.url }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed.");
    }
    setUploadingImg(false);
  };

  // Section editing logic
  const beginEdit = (section) => {
    setEditSection(section);
    if (section === "general") setEditForm({ ...ingredient.generalInformation });
    if (section === "benefits") setEditForm({
      whyToUse: [...(ingredient.whyToUse ?? [""])],
      prakritiImpact: { ...(ingredient.prakritiImpact ?? {}) },
      benefits: [...(ingredient.benefits ?? [{ emoji: "", text: "" }])],
    });
    if (section === "properties") setEditForm({
      ayurvedicProperties: { ...(ingredient.ayurvedicProperties ?? {}) },
      importantFormulations: [...(ingredient.importantFormulations ?? [{ icon: "", name: "" }])],
      therapeuticUses: [...(ingredient.therapeuticUses ?? [""])],
    });
    if (section === "others") setEditForm({
      plantParts: [...(ingredient.plantParts ?? [{ part: "", description: "" }])],
      bestCombinedWith: ingredient.bestCombinedWith ?? "",
      geographicalLocation: ingredient.geographicalLocation ?? "",
    });
  };

  // Submit update for that section
  const handleUpdate = async (section) => {
    let updateBody = {};
    if (section === "general")
      updateBody = { generalInformation: { ...editForm } };
    else if (section === "benefits")
      updateBody = {
        whyToUse: editForm.whyToUse,
        prakritiImpact: editForm.prakritiImpact,
        benefits: editForm.benefits
      };
    else if (section === "properties")
      updateBody = {
        ayurvedicProperties: editForm.ayurvedicProperties,
        importantFormulations: editForm.importantFormulations,
        therapeuticUses: editForm.therapeuticUses
      };
    else if (section === "others")
      updateBody = {
        plantParts: editForm.plantParts,
        bestCombinedWith: editForm.bestCombinedWith,
        geographicalLocation: editForm.geographicalLocation
      };

    try {
      const res = await fetch(`${serverUrl}/api/v1/ingredients/update-ingredient/${ingredient._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateBody)
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Ingredient updated");
      setEditSection(null);
      fetchIngredient();
    } catch {
      toast.error("Failed to update ingredient");
    }
  };

  // HANDLERS for edit forms:
  // --- General Info ---
  const changeGen = (field, value) => setEditForm(f => ({ ...f, [field]: value }));
  // --- Benefits ---
  const handleWhyToUseChange = (idx, value) => {
    let arr = [...editForm.whyToUse];
    arr[idx] = value;
    setEditForm(f => ({ ...f, whyToUse: arr }));
  };
  const addWhyToUse = () => setEditForm(f => ({ ...f, whyToUse: [...f.whyToUse, ""] }));
  const removeWhyToUse = idx => setEditForm(f => {
    let arr = [...f.whyToUse].filter((_, i) => i !== idx);
    if (!arr.length) arr = [""];
    return { ...f, whyToUse: arr };
  });
  const handlePrakritiChange = (field, value) => setEditForm(f => ({
    ...f,
    prakritiImpact: { ...f.prakritiImpact, [field]: value }
  }));
  const handleBenefitChange = (idx, field, value) => setEditForm(f => ({
    ...f,
    benefits: f.benefits.map((b, i) => i === idx ? { ...b, [field]: value } : b)
  }));
  const addBenefit = () => setEditForm(f => ({
    ...f,
    benefits: [...f.benefits, { emoji: "", text: "" }]
  }));
  const removeBenefit = idx => setEditForm(f => {
    let arr = [...f.benefits].filter((_, i) => i !== idx);
    if (!arr.length) arr = [{ emoji: "", text: "" }];
    return { ...f, benefits: arr };
  });

  // --- Properties ---
  const handleAyurvedicChange = (field, value) => setEditForm(f => ({
    ...f,
    ayurvedicProperties: { ...f.ayurvedicProperties, [field]: value }
  }));
  const handleFormulationChange = (idx, key, value) => setEditForm(f => ({
    ...f,
    importantFormulations: f.importantFormulations.map((item, i) =>
      i === idx ? { ...item, [key]: value } : item
    )
  }));
  const addFormulation = () => setEditForm(f => ({
    ...f,
    importantFormulations: [...f.importantFormulations, { icon: "", name: "" }]
  }));
  const removeFormulation = idx => setEditForm(f => {
    let arr = f.importantFormulations.filter((_, i) => i !== idx);
    if (!arr.length) arr = [{ icon: "", name: "" }];
    return { ...f, importantFormulations: arr };
  });
  const handleTherapeuticChange = (idx, value) => setEditForm(f => {
    let arr = [...f.therapeuticUses];
    arr[idx] = value;
    return { ...f, therapeuticUses: arr };
  });
  const addTherapeutic = () => setEditForm(f => ({ ...f, therapeuticUses: [...f.therapeuticUses, ""] }));
  const removeTherapeutic = idx => setEditForm(f => {
    let arr = f.therapeuticUses.filter((_, i) => i !== idx);
    if (!arr.length) arr = [""];
    return { ...f, therapeuticUses: arr };
  });

  // --- Others ---
  const handlePlantPartChange = (idx, field, value) => setEditForm(f => ({
    ...f,
    plantParts: f.plantParts.map((p, i) => i === idx ? { ...p, [field]: value } : p)
  }));
  const addPlantPart = () => setEditForm(f => ({ ...f, plantParts: [...f.plantParts, { part: "", description: "" }] }));
  const removePlantPart = idx => setEditForm(f => {
    let arr = f.plantParts.filter((_, i) => i !== idx);
    if (!arr.length) arr = [{ part: "", description: "" }];
    return { ...f, plantParts: arr };
  });
  const handleOtherField = (field, value) => setEditForm(f => ({ ...f, [field]: value }));

  if (loading || deleting) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <Loader2 className="w-12 h-12 animate-spin text-green-600 mb-4" />
      <div className="text-base text-green-700 font-semibold">{deleting ? "Deleting..." : "Loading Ingredient Details..."}</div>
    </div>
  );

  if (!ingredient) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh]">
      <span className="text-xl font-bold text-red-700 mb-2">This ingredient does not exist.</span>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => router.push("/ingredients/ingredients_list")}
          className="bg-green-600 text-white rounded px-5 py-2 font-semibold"
        >Ingredient List</button>
        <button
          onClick={() => router.push("/ingredients/add_ingredients")}
          className="bg-blue-600 text-white rounded px-5 py-2 font-semibold"
        >Create Ingredient</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mt-18 sm:mt-15 mx-auto py-8 px-2 sm:px-4">
      <div className="flex items-center gap-2 text-green-700  text-lg sm:text-xl mb-4">
        <div>Ingredient  </div>
        <ChevronRight className="w-4 h-4 text-green-700" />
        <div className="font-bold">Ingredient Details</div>
      </div>
      {/* General Info */}
      <Section
        icon="📝"
        label="General Information"
        actions={<ActionsMenu onEdit={() => beginEdit("general")} onDelete={handleDelete} />}
      >
        {!editSection || editSection !== "general" ? (
          <div className="flex flex-col items-center text-center gap-5">
            <img
              src={ingredient.generalInformation.ingredientURL}
              alt={ingredient.generalInformation.ingredientName}
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg bg-white border object-cover shadow mb-1"
            />
            <div className="w-full">
              <Field label="Ingredient Name">{ingredient.generalInformation.ingredientName}</Field>
              <Field label="Scientific Name">{ingredient.generalInformation.scientificName}</Field>
              <Field label="Sanskrit Name">{renderSanskrit(ingredient.generalInformation.sanskritName)}</Field>
              <Field label="Description">
                <span className="block break-words whitespace-pre-line text-slate-700 leading-relaxed max-h-48 overflow-auto">
                  {ingredient.generalInformation.ingredientDescription}
                </span>
              </Field>
            </div>
          </div>
        ) : (
          <form
            className="flex flex-col items-center text-center gap-5"
            onSubmit={e => { e.preventDefault(); handleUpdate("general"); }}
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={editForm.ingredientURL || ingredient.generalInformation.ingredientURL}
                alt={editForm.ingredientName || ""}
                className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg bg-white border object-cover shadow"
              />
              <input
                type="file"
                accept="image/*"
                disabled={uploadingImg}
                className="absolute bottom-2 left-2 opacity-70 cursor-pointer"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await handleImageUpload(file);
                }}
              />
              {uploadingImg && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg">
                  <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                </div>
              )}
            </div>
            <div className="w-full">
              <Field label="Ingredient Name">
                <input required className="input w-full border p-2 rounded"
                  value={editForm.ingredientName} onChange={e => changeGen("ingredientName", e.target.value)} />
              </Field>
              <Field label="Scientific Name">
                <input className="input w-full border p-2 rounded"
                  value={editForm.scientificName} onChange={e => changeGen("scientificName", e.target.value)} />
              </Field>
              <Field label="Sanskrit Name">
                <input className="input w-full border p-2 rounded"
                  value={editForm.sanskritName}
                  onChange={e => changeGen("sanskritName", e.target.value)} />
                <div className="mt-2 text-green-900">{renderSanskrit(editForm.sanskritName)}</div>
              </Field>
              <Field label="Description">
                <textarea required className="textarea border p-2 rounded w-full h-32"
                  value={editForm.ingredientDescription}
                  onChange={e => changeGen("ingredientDescription", e.target.value)} />
              </Field>
            </div>
            <div className="flex gap-2 justify-center">
              <button type="button" onClick={() => setEditSection(null)} className="bg-gray-100 border px-4 py-2 rounded font-medium hover:bg-gray-200">Cancel</button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700">Update</button>
            </div>
          </form>
        )}
        <div className="flex flex-row-reverse gap-3 mt-4">
          <span className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-bold rounded-full ${ingredient.status === "Active" ? "bg-green-200 text-green-700" : "bg-red-100 text-red-600"}`}>
            {ingredient.status || "Edit"}
          </span>
        </div>
      </Section>

      {/* Benefits */}
      <Section icon="✨" label="Benefits" actions={<ActionsMenu onEdit={() => beginEdit("benefits")} onDelete={handleDelete} />}>
        {!editSection || editSection !== "benefits" ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Field label="Why To Use">
                <ul className="flex flex-wrap gap-2">
                  {(ingredient.whyToUse ?? []).filter(Boolean).map((txt, i) => (
                    <ListChip key={i}>
                      <Pill>{txt}</Pill>
                    </ListChip>
                  ))}
                </ul>
              </Field>
              <Field label="Benefits">
                <ul className="flex flex-wrap gap-2">
                  {(ingredient.benefits ?? []).filter(b => b.emoji && b.text).map((b, i) => (
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
                      <span className="text-slate-700">{ingredient.prakritiImpact?.[key]}</span>
                      {ingredient.prakritiImpact?.[`${key}Reason`] && (
                        <span className="text-slate-500"> – {ingredient.prakritiImpact?.[`${key}Reason`]}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Field>
            </div>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); handleUpdate("benefits"); }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {/* Why To Use */}
                <Field label="Why To Use">
                  <div className="space-y-2">
                    {editForm.whyToUse.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={item}
                          className="flex-1 border rounded p-2"
                          placeholder="Enter here"
                          onChange={e => handleWhyToUseChange(idx, e.target.value)}
                        />
                        <button type="button" className="rounded-full border p-0.5 bg-gray-100 hover:bg-red-50 ml-1" onClick={() => removeWhyToUse(idx)}>
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                    <button type="button" className="flex items-center gap-2 text-green-700 font-semibold mt-1"
                      onClick={addWhyToUse}>
                      <PlusCircle className="w-4 h-4" /> Add Another Item
                    </button>
                  </div>
                </Field>
                {/* Benefits */}
                <Field label="Benefits">
                  <div className="space-y-2">
                    {editForm.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 relative">
                        {/* Emoji Picker Button */}
                        <button
                          type="button"
                          className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center bg-white hover:bg-green-50"
                          onClick={() => setActiveBenefitEmojiPicker(activeBenefitEmojiPicker === idx ? -1 : idx)}
                        >
                          <span className="text-xl">{benefit.emoji || <Smile className="w-6 h-6 text-gray-300" />}</span>
                        </button>
                        {/* Emoji Picker Dropdown */}
                        {activeBenefitEmojiPicker === idx && (
                          <div className="absolute z-30 bg-white border rounded shadow p-2 grid grid-cols-6 gap-2 top-12 left-0">
                            {EMOJI_LIST.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  handleBenefitChange(idx, "emoji", emoji);
                                  setActiveBenefitEmojiPicker(-1);
                                }}
                                className="text-2xl"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                        <input type="text" className="flex-grow border rounded p-2"
                          placeholder="Enter benefit description"
                          value={benefit.text}
                          onChange={e => handleBenefitChange(idx, "text", e.target.value)}
                        />
                        <button type="button" className="rounded-full border p-0.5 bg-gray-100 hover:bg-red-50 ml-1" onClick={() => removeBenefit(idx)}>
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-2 text-green-600 flex items-center gap-2"
                      onClick={addBenefit}
                    >
                      <PlusCircle className="w-6 h-6" /> Add Another Item
                    </button>
                  </div>
                </Field>
              </div>
              <div>
                {/* Prakriti Impact */}
                <Field label="Prakriti Impact">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {["vata", "kapha", "pitta"].map((field) => (
                      <div key={field} className="space-y-1">
                        <label className="block font-semibold capitalize">{field}</label>
                        <select
                          value={editForm.prakritiImpact[field]}
                          onChange={e => handlePrakritiChange(field, e.target.value)}
                          className="w-full p-2 border rounded"
                          required>
                          <option value="">Select</option>
                          {PRAKRITI_ENUM.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} Reason`}
                          value={editForm.prakritiImpact[`${field}Reason`] || ""}
                          onChange={e => handlePrakritiChange(`${field}Reason`, e.target.value)}
                          className="w-full border rounded p-2 mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </Field>
              </div>
            </div>
            <div className="flex gap-2 justify-center mt-6">
              <button type="button" onClick={() => setEditSection(null)} className="bg-gray-100 border px-4 py-2 rounded font-medium hover:bg-gray-200">Cancel</button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700">Update</button>
            </div>
          </form>
        )}
      </Section>

      {/* Properties */}
      <Section icon="⚗️" label="Properties" actions={<ActionsMenu onEdit={() => beginEdit("properties")} onDelete={handleDelete} />}>
        {!editSection || editSection !== "properties" ? (
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex-1 min-w-0">
              <Field label="Ayurvedic Properties">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {Object.entries(ingredient.ayurvedicProperties ?? {}).map(([k, v]) => (
                    <div key={k}>
                      <span className="font-semibold text-slate-800">{capitalize(k)}:</span>
                      <span className="text-slate-700 ml-1">{v}</span>
                    </div>
                  ))}
                </div>
              </Field>
              <Field label="Therapeutic Uses">
                <ul className="flex flex-wrap gap-2">
                  {(ingredient.therapeuticUses ?? []).filter(Boolean).map((u, i) => (
                    <ListChip key={i}><Pill className="bg-blue-50 border-blue-200 text-blue-800">{u}</Pill></ListChip>
                  ))}
                </ul>
              </Field>
            </div>
            <div className="flex-1 min-w-0">
              <Field label="Important Formulations">
                <ul className="flex flex-wrap gap-2">
                  {(ingredient.importantFormulations ?? []).filter(f => f.name).map((f, i) => (
                    <ListChip key={i}><Pill className="bg-violet-50 border-violet-200 text-violet-900"><span className="text-lg">{f.icon}</span> {f.name}</Pill></ListChip>
                  ))}
                </ul>
              </Field>
            </div>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); handleUpdate("properties"); }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {/* Ayurvedic Properties */}
                <Field label="Ayurvedic Properties">
                  <div className="grid grid-cols-2 gap-2">
                    {["rasa", "veerya", "guna", "vipaka"].map((field) => (
                      <select
                        key={field}
                        className="w-full border rounded p-2 my-1"
                        value={editForm.ayurvedicProperties[field]}
                        onChange={e => handleAyurvedicChange(field, e.target.value)}
                        required>
                        <option value="">{field.charAt(0).toUpperCase() + field.slice(1)}...</option>
                        {AYURVEDIC_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ))}
                  </div>
                </Field>
                <Field label="Therapeutic Uses">
                  {editForm.therapeuticUses.map((item, idx) => (
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
                    <PlusCircle className="w-5 h-5" /> Add Another
                  </button>
                </Field>
              </div>
              <div>
                <Field label="Important Formulations">
                  {editForm.importantFormulations.map((form, idx) => (
                    <div key={idx} className="flex gap-3 items-center mb-2 relative">
                      <button
                        type="button"
                        // ... continue previous line ...
                        className="w-10 h-10 border rounded-full bg-white flex items-center justify-center"
                        onClick={() => setActiveIconIdx(activeIconIdx === idx ? -1 : idx)}
                      >
                        <span className="text-xl">{form.icon || ICON_CHOICES[0]}</span>
                      </button>
                      {/* Icon Picker */}
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
                    <PlusCircle className="w-5 h-5" /> Add Another
                  </button>
                </Field>
              </div>
            </div>
            <div className="flex gap-2 justify-center mt-6">
              <button type="button" onClick={() => setEditSection(null)}
                className="bg-gray-100 border px-4 py-2 rounded font-medium hover:bg-gray-200">Cancel</button>
              <button type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700">Update</button>
            </div>
          </form>
        )}
      </Section>

      {/* Others */}
      <Section icon="🌎" label="Other" actions={<ActionsMenu onEdit={() => beginEdit("others")} onDelete={handleDelete} />}>
        {!editSection || editSection !== "others" ? (
          <>
            <Field label="Plant Parts & Purpose">
              <ul className="flex flex-wrap gap-2">
                {(ingredient.plantParts ?? []).filter(p => p.part && p.description).map((p, i) => (
                  <ListChip key={i}>
                    <Pill className="bg-violet-50 border-violet-200 text-violet-900">
                      <span className="font-semibold">{p.part}:</span> {p.description}
                    </Pill>
                  </ListChip>
                ))}
              </ul>
            </Field>
            <Field label="Best Combined With">{ingredient.bestCombinedWith}</Field>
            <Field label="Geographical Location">{ingredient.geographicalLocation}</Field>
          </>
        ) : (
          <form onSubmit={e => { e.preventDefault(); handleUpdate("others"); }}>
            <Field label="Plant Parts & Purpose">
              <div className="space-y-2">
                {editForm.plantParts.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 mb-1 relative">
                    <select
                      value={item.part}
                      onChange={e => handlePlantPartChange(idx, "part", e.target.value)}
                      className="w-full sm:w-40 border rounded p-2"
                      required>
                      <option value="">Select Part</option>
                      {PART_ENUM.map(part => (
                        <option key={part} value={part}>{part}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Description"
                      className="flex-1 border rounded p-2"
                      value={item.description}
                      onChange={e => handlePlantPartChange(idx, "description", e.target.value)}
                    />
                    <button
                      type="button"
                      className="ml-0 md:ml-2 p-2 rounded hover:bg-red-100 bg-white border"
                      onClick={() => removePlantPart(idx)}
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 flex items-center gap-1 text-green-700 font-semibold"
                  onClick={addPlantPart}
                >
                  <PlusCircle className="w-5 h-5" /> Add Plant Part
                </button>
              </div>
            </Field>
            <Field label="Best Combined With">
              <input
                type="text"
                value={editForm.bestCombinedWith}
                onChange={e => handleOtherField("bestCombinedWith", e.target.value)}
                placeholder="E.g. Guggulu"
                className="w-full border rounded p-2"
              />
            </Field>
            <Field label="Geographical Location">
              <input
                type="text"
                value={editForm.geographicalLocation}
                onChange={e => handleOtherField("geographicalLocation", e.target.value)}
                placeholder="E.g. India"
                className="w-full border rounded p-2"
              />
            </Field>
            <div className="flex gap-2 justify-center mt-4">
              <button type="button" onClick={() => setEditSection(null)}
                className="bg-gray-100 border px-4 py-2 rounded font-medium hover:bg-gray-200">Cancel</button>
              <button type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700">Update</button>
            </div>
          </form>
        )}
      </Section>
    </div>
  );
}

// Helper function
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

