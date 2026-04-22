import { useEffect, useMemo, useState } from 'react';

type Step = {
  id: string;
  title: string;
  validate: () => string | null;
  content: JSX.Element;
};

export const StepForm = ({ steps }: { steps: Step[] }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const canGoBack = activeStep > 0;
  const canGoNext = activeStep < steps.length - 1;

  useEffect(() => {
    setErrors([]);
  }, [activeStep]);

  const activeErrors = useMemo(() => {
    const error = steps[activeStep]?.validate();
    return error ? [error] : [];
  }, [activeStep, steps]);

  return (
    <form>
      <h2>{steps[activeStep]?.title}</h2>
      {steps[activeStep]?.content}
      {(errors.length > 0 || activeErrors.length > 0) && (
        <ul>
          {[...errors, ...activeErrors].map((error, i) => (
            <li key={`${error}-${i}`}>{error}</li>
          ))}
        </ul>
      )}
      <button type="button" onClick={() => canGoBack && setActiveStep((step) => step - 1)}>
        Previous
      </button>
      <button
        type="button"
        onClick={() => {
          const validationError = steps[activeStep]?.validate();
          if (validationError) {
            setErrors([validationError]);
            return;
          }
          setErrors([]);
          if (canGoNext) setActiveStep((step) => step + 1);
        }}
      >
        {canGoNext ? 'Next' : 'Submit'}
      </button>
    </form>
  );
};
