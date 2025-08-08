'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Step1GeneralInfo from "@/components/Step1GeneralInfo";
import Step2Benefits from "@/components/Step2Benefits";
import Step3Properties from "@/components/Step3Properties";
import Step4Others from "@/components/Step4Others";
import Step5Overview from "@/components/Step5Overview";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { formatPathname } from "@/lib/formatPathName";
const AYURVEDIC_OPTIONS = [
  'Katu (Pungent)', 'Ushna (Hot)', 'Laghu (Light)', 'Ruksha (Dry)', 'Tikshna (Sharp)'
];

const PRAKRITI_ENUM = ['Balanced', 'MidlyIncrease', 'Unbalanced', 'Aggravate'];

const STEPS = [
  { label: "General Information", component: Step1GeneralInfo },
  { label: "Benefits", component: Step2Benefits },
  { label: "Properties", component: Step3Properties },
  { label: "Others", component: Step4Others },
  { label: "Overview", component: Step5Overview },
];

export default function IngredientCreationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const router = useRouter();
  const pathname = usePathname();
  const paths = formatPathname(pathname);
  const {user} = useUser();
  const [formData, setFormData] = useState({
    generalInfo: {
      ingredientName: "",
      scientificName: "",
      sanskritName: "",
      ingredientDescription: "",
      ingredientURL: "",
    },
    benefitsStep: {
      whyToUse: [""],
      prakritiImpact: {
        vata: "",
        kapha: "",
        pitta: "",
        vataReason: "",
        kaphaReason: "",
        pittaReason: ""
      },
      benefits: [{ emoji: "", text: "" }]
    },
    propertiesStep: {
      ayurvedicProperties: {
        rasa: "",
        veerya: "",
        guna: "",
        vipaka: ""
      },
      importantFormulations: [
        { icon: "", name: "" }
      ],
      therapeuticUses: [""]
    },
    othersStep: {
      plantParts: [{ part: "", description: "" }],
      bestCombinedWith: "",
      geographicalLocation: ""
    }
  });
  const [errors, setErrors] = useState({});

  const CurrentStepComponent = STEPS[currentStep].component;

  // For updating any section directly (used on Overview for edits)
  const updateWholeForm = partialForm => {
    setFormData(prev => ({ ...prev, ...partialForm }));
  };

  // For Step 1/2, keep same, here is for 3:
  const updateStep3 = (field, value) => {
    setFormData(prev => ({
      ...prev,
      propertiesStep: {
        ...prev.propertiesStep,
        [field]: value
      }
    }));
  };

  // Step 4 updater
  const updateStep4 = (field, value) => {
    setFormData(prev => ({
      ...prev,
      othersStep: {
        ...prev.othersStep,
        [field]: value
      }
    }));
  };

  // Validation for Step 1/2/3 (properties)
  // const validateStep3 = () => {
  //   const errs = {};
  //   const data = formData.propertiesStep;
  //   const ayp = data.ayurvedicProperties;

  //   ['rasa', 'veerya', 'guna', 'vipaka'].forEach(field => {
  //     if (!AYURVEDIC_OPTIONS.includes(ayp[field])) {
  //       errs.ayurvedicProperties = "All fields in Ayurvedic Properties are required.";
  //     }
  //   });

  //   if (
  //     !data.importantFormulations.length ||
  //     data.importantFormulations.some(f => !f.icon || !f.name.trim())
  //   ) {
  //     errs.importantFormulations = "At least one formulation (icon + name) required.";
  //   }

  //   if (
  //     !data.therapeuticUses.length ||
  //     data.therapeuticUses.some(t => !t.trim())
  //   ) {
  //     errs.therapeuticUses = "Please add at least one therapeutic use.";
  //   }

  //   setErrors(errs);
  //   return Object.keys(errs).length === 0;
  // };

const validateStep4 = () => {
  const errs = {};
  const data = formData.othersStep;

  // Plant Parts validation
  if (
    !data.plantParts.length ||
    data.plantParts.some(p => !p.part || !p.description.trim())
  ) {
    errs.plantParts = "Each plant part and its description is required.";
  }
  if (!data.bestCombinedWith.trim()) {
    errs.bestCombinedWith = "Please enter what this ingredient is best combined with.";
  }
  if (!data.geographicalLocation.trim()) {
    errs.geographicalLocation = "Please enter a geographical location.";
  }
  setErrors(errs);
  return Object.keys(errs).length === 0;
};


const validateStep3 = () => {
  const errs = {};
  const data = formData.propertiesStep;
  const ayp = data.ayurvedicProperties;

  ['rasa', 'veerya', 'guna', 'vipaka'].forEach(field => {
    if (!AYURVEDIC_OPTIONS.includes(ayp[field])) {
      if (!errs.ayurvedicProperties) errs.ayurvedicProperties = {};
      errs.ayurvedicProperties[field] = `${field} is required`;
    }
  });

  if (
    !data.importantFormulations.length ||
    data.importantFormulations.some(f => !f.icon || !f.name.trim())
  ) {
    errs.importantFormulations = "At least one formulation (icon + name) required.";
  }

  if (!data.therapeuticUses.length || data.therapeuticUses.some(t => !t.trim())) {
    errs.therapeuticUses = "Please add at least one therapeutic use.";
  }

  setErrors(errs);
  return Object.keys(errs).length === 0;
};


// Validation for Step 1 and then Step 2
  const validateStep1 = () => {
    const errs = {};
    const data = formData.generalInfo;
    if (!data.ingredientName.trim()) errs.ingredientName = "Ingredient Name is required";
    if (!data.scientificName.trim()) errs.scientificName = "Scientific Name is required";
    if (!data.sanskritName.trim()) errs.sanskritName = "Sanskrit Name is required";
    if (!data.ingredientDescription.trim()) errs.ingredientDescription = "Description is required";
    if (!data.ingredientURL.trim()) errs.ingredientURL = "Image upload is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };


  const validateStep2 = () => {
    const errs = {};
    const data = formData.benefitsStep;

    if (!data.whyToUse.length || data.whyToUse.some(w => !w.trim())) {
      errs.whyToUse = "Please add at least one valid reason";
    }

    ["vata", "kapha", "pitta"].forEach(field => {
      if (!PRAKRITI_ENUM.includes(data.prakritiImpact[field])) {
        errs.prakritiImpact = "All Prakriti values required";
      }
    });

    if (!data.benefits.length || data.benefits.some(b => !b.emoji || !b.text.trim())) {
      errs.benefits = "At least one benefit with emoji and description is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };



  const validateCurrentStep = () => {
    if (currentStep === 0) return validateStep1();
    if (currentStep === 1) return validateStep2();
    if (currentStep === 2) return validateStep3();
    if (currentStep === 3) return validateStep4();
    return true;
  };

  const handleNext = async () => {
    const isValid = validateCurrentStep();
    if (!isValid) return;
    
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    // console.log('Form data at step', currentStep + 1, JSON.stringify(formData, null, 2));
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
      return;
    }

    // At last step: prepare payload to backend format
    const payload = {
      userId: user?.id,            // Clerk user ID
      status: "Active",             // Or set the status you want
      generalInformation: formData.generalInfo,
      whyToUse: formData.benefitsStep.whyToUse,
      prakritiImpact: formData.benefitsStep.prakritiImpact,
      benefits: formData.benefitsStep.benefits,
      ayurvedicProperties: formData.propertiesStep.ayurvedicProperties,
      importantFormulations: formData.propertiesStep.importantFormulations,
      therapeuticUses: formData.propertiesStep.therapeuticUses,
      plantParts: formData.othersStep.plantParts,
      bestCombinedWith: formData.othersStep.bestCombinedWith,
      geographicalLocation: formData.othersStep.geographicalLocation,
    };

    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

      const response = await fetch(`${serverUrl}/api/v1/ingredients/create-ingredient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create ingredient");
      }

      const data = await response.json();
      toast.success("Ingredient created successfully");

      // Navigate to ingredient detail page with ID from response
      router.push(`/ingredients/ingredient-detail/${data.ingredient._id}`);
    } catch (error) {
      toast.error("Failed to create Ingredient! Please try again.")
      console.error("Ingredient creation error:", error);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  return (
    <div>
      <div className="text-green-800  text-xl flex items-center gap-1 mb-2">
        {paths.length > 1 ? (
          <>
            <div className="font-semibold">{paths[0]}</div>
            <ChevronRight className="w-4 h-4 text-green-800" />
            <div className='font-bold'>{paths[1]}</div>
          </>
        ) : (
          <div>{paths[0]}</div>
        )}
      </div>
      <ProgressBar steps={STEPS} currentStep={currentStep} completedSteps={completedSteps} />
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow">
        {
        currentStep === 4 ? (
          <Step5Overview
          formData={formData}
          goToStep={setCurrentStep}
          updateWholeForm={updateWholeForm}
          />
          ) : 
        currentStep === 3 ? (
          <Step4Others
            data={formData.othersStep}
            update={updateStep4}
            errors={errors}
          />
        ) : currentStep === 2 ? (
          <Step3Properties
            data={formData.propertiesStep}
            update={updateStep3}
            errors={errors}
          />
        ) : (
          <CurrentStepComponent
            data={formData[currentStep === 0 ? "generalInfo" : "benefitsStep"]}
            update={currentStep === 0 ? (section, field, value) =>
              setFormData(prev => ({
                ...prev,
                [section]: {
                  ...prev[section],
                  [field]: value
                }
              })) : (section, field, value) =>
              setFormData(prev => ({
                ...prev,
                [section]: {
                  ...prev[section],
                  [field]: value
                }
              }))
            }
            errors={errors}
          />
        )}
      </div>
      <div className="flex justify-between items-center max-w-4xl mx-auto mt-8">
        {currentStep > 0 && (
          <Button variant="outline" onClick={handleBack}>Back</Button>
        )}
        <Button onClick={handleNext}>
          {currentStep === STEPS.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
}

function ProgressBar({ steps, currentStep, completedSteps }) {
  return (
    <div className="flex justify-between items-center mb-8 max-w-3xl mx-auto">
      {steps.map((step, index) => {
        const completed = completedSteps.has(index);
        const isActive = index === currentStep;
        return (
          <div key={step.label} className="flex flex-col items-center w-full">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold 
                ${completed ? "bg-green-600 border-green-600 text-white" : isActive ? "border-green-600 text-green-600" : "border-gray-300 text-gray-400"}`}
            >
              {completed ? "✓" : index + 1}
            </div>
            <span className={`mt-1 text-xs ${isActive ? "text-green-600" : "text-gray-400"}`}>{step.label}</span>
            {index < steps.length - 1 && (
              <div className={`h-0.5 w-full mx-auto mt-3 
                ${completed ? "bg-green-600" : "bg-gray-300"}`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
