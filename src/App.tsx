import { useState, useMemo } from "react";
import { Form } from "@rjsf/shadcn"; // or any other theme
import validator from "@rjsf/validator-ajv8";

const schema = {
  title: "A registration form",
  description: "A simple form example.",
  type: "object",
  required: ["firstName", "lastName"],
  properties: {
    firstName: {
      step: 1,
      type: "string",
      title: "First name",
      default: "Chuck",
    },
    lastName: { step: 1, type: "string", title: "Last name" },
    age: { step: 1, type: "integer", title: "Age" },
    bio: { step: 1, type: "string", title: "Bio" },
    password: { step: 2, type: "string", title: "Password", minLength: 3 },
    telephone: { step: 2, type: "string", title: "Telephone", minLength: 10 },
  },
};

const uiSchema = {};

export default function MultiStepRJSFForm() {
  const [formData, setFormData] = useState({});
  const [activeStep, setActiveStep] = useState(1);

  // All steps based on schema properties
  const steps = useMemo(() => {
    const maxStep = Math.max(
      ...Object.values(schema.properties).map((p) => p.step || 1)
    );
    return maxStep;
  }, []);

  // Build uiSchema dynamically
  const updatedUiSchema = useMemo(() => {
    const ui = uiSchema;
    Object.keys(schema.properties).forEach((key) => {
      const property = schema.properties[key];
      const fieldStep = property.step || 1;

      ui[key] = {
        "ui:classNames":
          fieldStep === activeStep ? "active-field" : "inactive-field",
      };
    });
    return ui;
  }, [activeStep]);

  const goNext = () => setActiveStep((s) => Math.min(s + 1, steps));
  const goPrevious = () => setActiveStep((s) => Math.max(s - 1, 1));

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>
        Step {activeStep} of {steps}
      </h2>

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
          {activeStep > 1 && (
            <button type="button" onClick={goPrevious}>
              Previous
            </button>
          )}

          {activeStep < steps && (
            <button type="button" onClick={goNext}>
              Next
            </button>
          )}

          {activeStep === steps && <button type="submit">Submit</button>}
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
