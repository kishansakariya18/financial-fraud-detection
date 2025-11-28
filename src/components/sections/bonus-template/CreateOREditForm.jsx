import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Card } from 'components/ui';
import {
  BonusTemplatePreview,
  BonusTemplateStepper,
  StepBonusDetails,
  StepGameplayConfiguration,
  StepMaxCashoutConfiguration,
  StepRewardDetails,
  StepTemplateInfo,
  StepWageringConfiguration
} from 'components/sections/bonus-template';
import {
  BOOST_MODE_OPTIONS,
  BONUS_TYPE_OPTIONS,
  MCO_MODE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  WAGERING_MODE_OPTIONS,
  createOptionLookup,
  WAGERING_BASE_OPTIONS_DEPOSIT_BOOST,
  WAGERING_BASE_OPTIONS_FREE_CHIP,
  WAGERING_BASE_OPTIONS_FREE_SPINS
} from 'components/sections/bonus-template/constants';

import useBonusTemplateOptions from 'app/pages/bonus-template/hooks/useBonusTemplateOptions';
import { stepSchemas } from 'app/pages/bonus-template/validationSchemas';
import { useTranslation } from 'react-i18next';

const defaultRule = {
  paymentMethod: 'all',
  rangeFrom: '',
  rangeTo: '',
  boostPercent: '',
  wagering: '',
  mco: ''
};

const defaultFormState = {
  templateInfo: {
    templateName: '',
    bonusType: 'deposit_boost',
    bonusTag: [],
    expiryAfterIssuanceDays: ''
  },
  bonusDetails: {
    displayTitle: '',
    notes: '',
    adminNotes: '',
    displayPriority: '',
    desktopImage: null,
    mobileImage: null
  },
  rewardDetails: {
    // Deposit Boost
    boostMode: 'fixed',
    boostPercent: '',
    minDepositAmount: '',
    maxBonusAmount: '',
    variableRules: [defaultRule],
    // Free Chip
    amount: '',
    // Free Spins
    gameId: '',
    selectedGame: null,
    spinsCount: '',
    denominationPerSpin: '',
    maxFreeSpinWinnings: ''
  },
  wageringConfig: {
    mode: 'none',
    base: '',
    wageringValue: '',
    daysToWager: null
  },
  maxCashoutConfig: {
    mode: 'none',
    base: '',
    cashoutValue: '',
    stickyBonus: false,
    kycRequired: false
  },
  gameplay: {
    minBet: '',
    maxBet: '',
    allowedProviders: [],
    providerIncluded: true,
    allowedCategories: [],
    categoryIncluded: true,
    allowedGames: [],
    gameIncluded: true
  }
};

export default function CreateOREditForm({ onSubmit, isEdit = false, value }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const STEPS = [
    { id: 'templateInfo', title: t('template_info') },
    { id: 'bonusDetails', title: t('bonus_details') },
    { id: 'rewardDetails', title: t('reward_details') },
    { id: 'wageringConfiguration', title: t('wagering_configuration') },
    { id: 'maxCashoutConfiguration', title: t('max_cashout_configuration') },
    {
      id: 'gameplayConfiguration',
      title: t('gameplay_configuration')
    }
  ];

  const [formState, setFormState] = useState(defaultFormState);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState({});
  const { providerOptions, categoryOptions, gameOptions, tagOptions, handleGameOptionsCache } =
    useBonusTemplateOptions();

  const currentStep = STEPS[activeStep];
  const isLastStep = activeStep === STEPS.length - 1;

  const lookups = useMemo(
    () => ({
      bonusType: createOptionLookup(BONUS_TYPE_OPTIONS(t)),
      wageringMode: createOptionLookup(WAGERING_MODE_OPTIONS(t)),
      maxCashoutMode: createOptionLookup(MCO_MODE_OPTIONS(t)),
      paymentMethod: createOptionLookup(PAYMENT_METHOD_OPTIONS(t)),
      provider: createOptionLookup(providerOptions),
      category: createOptionLookup(categoryOptions),
      game: createOptionLookup(gameOptions)
    }),
    [t, providerOptions, categoryOptions, gameOptions]
  );

  const handleTemplateInfoChange = (field, value) => {
    const updateData = {
      wageringConfig: {},
      maxCashoutConfig: {}
    };
    if (field === 'bonusType') {
      updateData.wageringConfig.base = '';
      updateData.maxCashoutConfig.base = '';
    }
    setFormState((prev) => ({
      ...prev,
      templateInfo: {
        ...prev.templateInfo,
        [field]: value
      },
      wageringConfig: {
        ...prev.wageringConfig,
        ...updateData.wageringConfig
      },
      maxCashoutConfig: {
        ...prev.maxCashoutConfig,
        ...updateData.maxCashoutConfig
      }
    }));
  };

  const handleBonusTagsChange = (tags) => {
    setFormState((prev) => ({
      ...prev,
      templateInfo: {
        ...prev.templateInfo,
        bonusTagsSelectedData: tags,
        bonusTag: tags.map((tag) => tag.value)
      }
    }));
  };

  const handleBonusDetailsChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      bonusDetails: {
        ...prev.bonusDetails,
        [field]: value
      }
    }));
  };

  const handleImageChange = (field, file) => {
    setFormState((prev) => ({
      ...prev,
      bonusDetails: {
        ...prev.bonusDetails,
        [field]: file
      }
    }));
  };

  const handleRewardDetailsChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      rewardDetails: {
        ...prev.rewardDetails,
        [field]: value
      }
    }));
  };

  const handleVariableRulesChange = (rules) => {
    setFormState((prev) => ({
      ...prev,
      rewardDetails: {
        ...prev.rewardDetails,
        variableRules: rules
      }
    }));
  };

  // Validate a single field and update errors incrementally
  const validateVariableRuleField = async (rules) => {
    const schema = stepSchemas.rewardDetails;
    if (!schema) return;

    try {
      const boostMode = formState.rewardDetails.boostMode;
      const stepData = {
        ...formState.rewardDetails,
        variableRules: rules
      };
      const context = boostMode ? { boostMode } : {};

      // Validate the entire step data
      await schema.validate(stepData, { abortEarly: false, context });

      // If validation passes, clear only variableRules errors (all of them since validation passed)
      setStepErrors((prev) => {
        const updated = { ...prev };
        if (updated.rewardDetails) {
          const newRewardErrors = { ...updated.rewardDetails };
          // Remove all variableRules errors since validation passed
          Object.keys(newRewardErrors).forEach((key) => {
            if (key.startsWith('variableRules')) {
              delete newRewardErrors[key];
            }
          });
          updated.rewardDetails =
            Object.keys(newRewardErrors).length > 0 ? newRewardErrors : undefined;
          if (!updated.rewardDetails) {
            delete updated.rewardDetails;
          }
        }
        return updated;
      });
    } catch (error) {
      // Only update errors for variableRules fields
      if (error.inner) {
        const fieldErrors = {};
        error.inner.forEach((err) => {
          if (err.path && err.path.startsWith('variableRules')) {
            fieldErrors[err.path] = err.message;
          }
        });

        // Merge with existing errors, keeping non-variableRules errors
        setStepErrors((prev) => {
          const existingRewardErrors = prev.rewardDetails || {};
          const nonVariableRulesErrors = {};
          Object.keys(existingRewardErrors).forEach((key) => {
            if (!key.startsWith('variableRules')) {
              nonVariableRulesErrors[key] = existingRewardErrors[key];
            }
          });

          return {
            ...prev,
            rewardDetails: {
              ...nonVariableRulesErrors,
              ...fieldErrors
            }
          };
        });
      }
    }
  };

  const handleWageringConfigChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      wageringConfig: {
        ...prev.wageringConfig,
        [field]: value
      }
    }));
  };

  const handleMaxCashoutChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      maxCashoutConfig: {
        ...prev.maxCashoutConfig,
        [field]: value
      }
    }));
  };

  const handleGameplayChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      gameplay: {
        ...prev.gameplay,
        [field]: value
      }
    }));
  };

  const handleGameplayMultiSelectChange = (field, values) => {
    handleGameplayChange(field, values);
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepSelect = (index) => {
    // Allow free navigation when clicking on stepper
    setActiveStep(index);
    // Clear errors for the step being navigated to
    setStepErrors((prev) => {
      const updated = { ...prev };
      delete updated[STEPS[index].id];
      return updated;
    });
  };

  const validateStep = async (stepId, stepData, boostMode = null) => {
    const schema = stepSchemas[stepId];
    if (!schema) return { isValid: true, errors: null };

    try {
      const context = boostMode ? { boostMode } : {};
      await schema.validate(stepData, { abortEarly: false, context });
      return { isValid: true, errors: null };
    } catch (error) {
      const errors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
      }
      return { isValid: false, errors };
    }
  };

  const handleNext = async () => {
    const stepId = currentStep.id;
    let stepData = formState[stepId];
    const boostMode = formState.rewardDetails.boostMode;

    // Special handling for maxCashoutConfiguration
    if (stepId === 'maxCashoutConfiguration') {
      stepData = { ...stepData, boostMode };
    }
    // Special handling for wageringConfiguration
    if (stepId === 'wageringConfiguration') {
      stepData = { ...stepData, boostMode };
    }

    const { isValid, errors } = await validateStep(stepId, stepData, boostMode);
    console.log('errors', errors);
    if (!isValid) {
      setStepErrors((prev) => ({
        ...prev,
        [stepId]: errors
      }));
      console.error('Please fix the errors before proceeding', errors);
      return;
    }
    // Clear errors for current step
    setStepErrors((prev) => {
      const updated = { ...prev };
      delete updated[stepId];
      return updated;
    });

    // Move to next step
    setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const getWageringBaseOptions = () => {
    const bonusType = formState.templateInfo.bonusType;
    if (bonusType === 'deposit_boost') {
      return WAGERING_BASE_OPTIONS_DEPOSIT_BOOST(t);
    }
    if (bonusType === 'free_chip') {
      return WAGERING_BASE_OPTIONS_FREE_CHIP(t);
    }
    if (bonusType === 'free_spins') {
      return WAGERING_BASE_OPTIONS_FREE_SPINS(t);
    }
    return [];
  };

  useEffect(() => {
    if (isEdit && value) {
      setFormState({
        ...defaultFormState,
        ...value
      });
    }
  }, [isEdit, value]);

  const renderStepContent = () => {
    const currentStepErrors = stepErrors[currentStep.id] || {};
    const bonusType = formState.templateInfo.bonusType;
    const wageringBaseOptions = getWageringBaseOptions();

    switch (currentStep.id) {
      case 'templateInfo':
        return (
          <StepTemplateInfo
            data={formState.templateInfo}
            tagOptions={tagOptions}
            onChange={handleTemplateInfoChange}
            onTagsChange={handleBonusTagsChange}
            bonusTypeOptions={BONUS_TYPE_OPTIONS(t)}
            errors={currentStepErrors}
          />
        );
      case 'bonusDetails':
        return (
          <StepBonusDetails
            data={formState.bonusDetails}
            onChange={handleBonusDetailsChange}
            onImageChange={handleImageChange}
            errors={currentStepErrors}
          />
        );
      case 'rewardDetails':
        return (
          <StepRewardDetails
            data={formState.rewardDetails}
            onChange={handleRewardDetailsChange}
            bonusType={bonusType}
            boostModeOptions={BOOST_MODE_OPTIONS(t)}
            paymentMethodOptions={PAYMENT_METHOD_OPTIONS(t)}
            onRulesChange={handleVariableRulesChange}
            onValidateRuleField={validateVariableRuleField}
            onGameOptionsCache={handleGameOptionsCache}
            errors={currentStepErrors}
          />
        );
      case 'wageringConfiguration':
        return (
          <StepWageringConfiguration
            data={formState.wageringConfig}
            onChange={handleWageringConfigChange}
            options={WAGERING_MODE_OPTIONS(t)}
            baseOptions={wageringBaseOptions}
            errors={currentStepErrors}
          />
        );
      case 'maxCashoutConfiguration':
        return (
          <StepMaxCashoutConfiguration
            data={formState.maxCashoutConfig}
            onChange={handleMaxCashoutChange}
            options={MCO_MODE_OPTIONS(t)}
            baseOptions={wageringBaseOptions}
            errors={currentStepErrors}
          />
        );
      case 'gameplayConfiguration':
        return (
          <StepGameplayConfiguration
            data={formState.gameplay}
            onChange={handleGameplayChange}
            onSelectChange={handleGameplayMultiSelectChange}
            providerOptions={providerOptions}
            categoryOptions={categoryOptions}
            onGameOptionsCache={handleGameOptionsCache}
            errors={currentStepErrors}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLastStep) {
      await handleNext();
      return;
    }

    // Validate all steps before final submit
    const allErrors = {};
    let firstErrorStepIndex = -1;

    for (let i = 0; i < STEPS.length; i++) {
      const step = STEPS[i];
      const stepId = step.id;
      let stepData = formState[stepId];
      const boostMode = formState.rewardDetails.boostMode;

      // Special handling for steps that need boostMode context
      if (stepId === 'maxCashoutConfiguration' || stepId === 'wageringConfiguration') {
        stepData = { ...stepData, boostMode };
      }

      const { isValid, errors } = await validateStep(stepId, stepData, boostMode);

      if (!isValid) {
        allErrors[stepId] = errors;
        if (firstErrorStepIndex === -1) {
          firstErrorStepIndex = i;
        }
      }
      delete formState?.templateInfo?.bonusTagsSelectedData;
    }

    if (firstErrorStepIndex !== -1) {
      setStepErrors(allErrors);
      setActiveStep(firstErrorStepIndex);
      return;
    }

    setIsSubmitting(true);
    await onSubmit(formState);
    setIsSubmitting(false);
  };

  return (
    <div className="grid gap-6 px-[--margin-x] pb-6 pt-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <BonusTemplateStepper
          steps={STEPS}
          activeStep={activeStep}
          onStepClick={handleStepSelect}
        />

        <Card className="flex flex-col px-6 py-6">
          <form onSubmit={handleSubmit} className="flex h-full flex-col">
            <header className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-50">
                {currentStep.title}
              </h2>
              {currentStep.subtitle && (
                <p className="mt-2 text-sm text-gray-500 dark:text-dark-200">
                  {currentStep.subtitle}
                </p>
              )}
            </header>

            <div className="min-h-[24rem] flex-1 space-y-6">{renderStepContent()}</div>

            <div className="mt-6 flex items-center justify-between">
              <Button type="button" color="neutral" onClick={() => navigate('/bonus/templates')}>
                Cancel
              </Button>

              <div className="flex gap-3">
                {activeStep !== 0 && (
                  <Button type="button" variant="outlined" color="neutral" onClick={handleBack}>
                    Back
                  </Button>
                )}
                <Button
                  type="submit"
                  color="primary"
                  loading={isSubmitting && isLastStep}
                  disabled={isSubmitting}>
                  {isLastStep ? t('save') + ' ' + t('template') : t('next_step')}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>

      <div className="space-y-4">
        <BonusTemplatePreview data={formState} lookups={lookups} />
      </div>
    </div>
  );
}
