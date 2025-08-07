'use client';

import React, { useRef, useState } from "react";

import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

export default function Step1({ data, update, errors }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // Trigger hidden file input click
  const onUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and upload
  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

      const res = await fetch(`${serverUrl}/api/v1/upload/upload-image`, { // Adjust your upload URL
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const { url } = await res.json();

      update("generalInfo", "ingredientURL", url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Image Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">General Information</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <FormField
          label="Ingredient Name"
          required
          value={data.ingredientName}
          onChange={v => update("generalInfo", "ingredientName", v)}
          placeholder="Enter ingredient name"
          error={errors.ingredientName}
        />
        <FormField
          label="Scientific Name"
          required
          value={data.scientificName}
          onChange={v => update("generalInfo", "scientificName", v)}
          placeholder="Enter scientific name"
          error={errors.scientificName}
        />
        <FormField
          label="Sanskrit Name"
          required
          value={data.sanskritName}
          onChange={v => update("generalInfo", "sanskritName", v)}
          placeholder="Enter Sanskrit name"
          error={errors.sanskritName}
          // You can apply a class for Sanskrit font here, e.g., 'font-devanagari'
        />
      </div>

      <FormField
        type="textarea"
        label="Description"
        required
        value={data.ingredientDescription}
        onChange={v => update("generalInfo", "ingredientDescription", v)}
        error={errors.ingredientDescription}
      />

      <div>
        <label className="block mb-1 font-semibold">
          Upload Image <span className="text-red-600">*</span>
        </label>

        <div className="border border-dashed border-gray-300 rounded p-4 cursor-pointer flex items-center gap-3 w-48"
             onClick={onUploadClick}
             role="button"
             tabIndex={0}
             onKeyDown={e => e.key === "Enter" && onUploadClick()}
        >
          {data.ingredientURL ? (
            <img src={data.ingredientURL} alt="Ingredient" className="w-48 h-48 rounded object-cover shadow" />
          ) : (
            <>
              <UploadCloud className={`w-28 h-28 ${uploading ? "animate-spin" : "text-gray-500"}`} />
              <span className="text-gray-500">{uploading ? "Uploading..." : "Upload Image"}</span>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
          disabled={uploading}
        />

        {errors.ingredientURL && (
          <p className="text-red-600 mt-2 text-sm">{errors.ingredientURL}</p>
        )}
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, error, required, type = "text", placeholder }) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          placeholder={placeholder}
          className={`border p-2 rounded ${error ? "border-red-600" : "border-gray-300"}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={4}
          required={required}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={`border p-2 rounded ${error ? "border-red-600" : "border-gray-300"}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          required={required}
        />
      )}
      {error && (
        <p className="text-red-600 mt-1 text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
