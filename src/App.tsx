import { useState, useMemo } from "react";
import { Form } from "@rjsf/shadcn"; // or any other theme
import validator from "@rjsf/validator-ajv8";

const steps = [
  {
    title: "Personal Information",
    description: "Please provide your basic information",
    properties: ["firstName", "lastName", "age", "bio"],
  },
  {
    title: "Account Security",
    description: "Set up your password and contact details",
    properties: ["password", "telephone"],
  },
];

const schema = {
  title: "A registration form",
  description: "A simple form example.",
  type: "object",
  required: ["firstName", "lastName"],
  properties: {
    firstName: {
      type: "string",
      title: "First name",
      default: "Chuck",
    },
    lastName: { type: "string", title: "Last name" },
    age: { type: "integer", title: "Age" },
    bio: { type: "string", title: "Bio" },
    password: { type: "string", title: "Password", minLength: 3 },
    telephone: { type: "string", title: "Telephone", minLength: 10 },
  },
};

const uiSchema = {};

export default function MultiStepRJSFForm() {
  const [formData, setFormData] = useState({});
  const [activeStep, setActiveStep] = useState(0);

  const totalSteps = steps.length;
  const currentStep = steps[activeStep];

  // Build uiSchema dynamically based on current step
  const updatedUiSchema = useMemo(() => {
    const ui: Record<string, { "ui:classNames": string }> = { ...uiSchema };
    Object.keys(schema.properties).forEach((key) => {
      const isInCurrentStep = currentStep.properties.includes(key);

      ui[key] = {
        "ui:classNames": isInCurrentStep ? "active-field" : "inactive-field",
      };
    });
    return ui;
  }, [currentStep.properties]);

  const goNext = () => setActiveStep((s) => Math.min(s + 1, totalSteps - 1));
  const goPrevious = () => setActiveStep((s) => Math.max(s - 1, 0));

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>
        Step {activeStep + 1} of {totalSteps}
      </h2>
      <h3>{currentStep.title}</h3>
      <p>{currentStep.description}</p>

      <Form
        schema={schema}
        uiSchema={updatedUiSchema}
        formData={formData}
        validator={validator}
        noValidate
        showErrorList={false}
        noHtml5Validate
        onChange={({ formData }) => setFormData(formData)}
        onSubmit={({ formData }) => console.log("Submitted:", formData)}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {activeStep > 0 && (
            <button type="button" onClick={goPrevious}>
              Previous
            </button>
          )}

          {activeStep < totalSteps - 1 && (
            <button type="button" onClick={goNext}>
              Next
            </button>
          )}

          {activeStep === totalSteps - 1 && <button type="submit">Submit</button>}
        </div>
      </Form>

      <style>
        {`
          .inactive-field {
            display: none;
            
          }
          .active-field {
            display: block;
          }
        `}
      </style>
    </div>
  );
}
