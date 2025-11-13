import clsx from 'clsx';
import PropTypes from 'prop-types';

export function BonusTemplateStepper({ steps, activeStep, onStepClick }) {
  return (
    <ol className="steps">
      {steps.map((step, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;

        const handleClick = () => {
          if (typeof onStepClick === 'function') {
            onStepClick(index);
          }
        };

        return (
          <li
            key={step.id}
            className={clsx(
              'step',
              isCompleted ? 'before:bg-primary-500' : 'before:bg-gray-200 dark:before:bg-surface-2'
            )}
            aria-current={isActive ? 'step' : undefined}>
            <button
              type="button"
              onClick={handleClick}
              className={clsx(
                'step-header rounded-full dark:text-white',
                isActive &&
                  'border-2 border-primary-500 bg-gray-200 text-gray-800 dark:bg-surface-2',
                !isActive && isCompleted && 'bg-primary-600 text-white dark:bg-primary-500',
                !isCompleted && !isActive && 'bg-gray-200 text-gray-800 dark:bg-surface-2'
              )}
              aria-label={`${step.title} (Step ${index + 1})`}>
              {index + 1}
            </button>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-dark-100">{step.title}</p>
              {step.subtitle && (
                <p className="text-xs text-gray-500 dark:text-dark-300">{step.subtitle}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

BonusTemplateStepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string
    })
  ).isRequired,
  activeStep: PropTypes.number.isRequired,
  onStepClick: PropTypes.func
};
