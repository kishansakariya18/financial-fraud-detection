import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Button, Card, Input } from 'components/ui';
import { Listbox } from 'components/shared/form/Listbox';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const targetOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

const eventOptions = [
  { value: 'deposit', label: 'Deposit' },
  { value: 'wager', label: 'Wager' },
  { value: 'loss', label: 'Loss' }
];

const targetSchema = Yup.object().shape({
  targetName: Yup.string().required('Target name is required'),
  eventName: Yup.string().required('Event name is required'),
  ranges: Yup.array()
    .of(
      Yup.object().shape({
        rangeMin: Yup.number()
          .min(0, 'Minimum must be non-negative')
          .required('Range minimum is required'),
        rangeMax: Yup.number()
          .nullable()
          .when('rangeMin', (rangeMin, schema) => {
            return schema.test(
              'greater-than-min',
              'Maximum must be greater than minimum',
              function (value) {
                if (value === null || value === undefined) {
                  return true; // Allow null for unlimited ranges
                }
                return value > rangeMin[0];
              }
            );
          }),
        commissionRate: Yup.number()
          .min(0, 'Rate must be non-negative')
          .max(100, 'Rate cannot exceed 100%')
          .required('Commission rate is required')
      })
    )
    .min(1, 'At least one range is required')
    .max(3, 'Maximum 3 ranges allowed')
});

const defaultValues = {
  targetName: '',
  eventName: '',
  ranges: [{ rangeMin: 0, rangeMax: null, commissionRate: 0 }]
};

const TargetForm = ({
  t,
  title,
  initialValues,
  loading,
  onCancel,
  onSubmit,
  existingTargets = []
}) => {
  const [apiError, setApiError] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(targetSchema),
    defaultValues: defaultValues
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'ranges' });

  // Handle range max change and update next range min
  const handleRangeMaxChange = (index, value) => {
    const numValue = value === '' ? null : parseFloat(value) || 0;

    // Set the current range max value
    setValue(`ranges.${index}.rangeMax`, numValue);

    // If there's a next range, update its min value
    if (index < fields.length - 1 && numValue !== null) {
      setValue(`ranges.${index + 1}.rangeMin`, numValue);
    }
  };

  // Filter event options to exclude already used ones (except when editing the same target)
  const availableEventOptions = eventOptions.filter((option) => {
    const usedEventTypes = existingTargets
      .filter((target) => (initialValues ? target.id !== initialValues.id : true))
      .map((target) => target.eventName);
    return !usedEventTypes.includes(option.value);
  });

  // Handle form submission with API error handling
  const handleFormSubmit = async (data) => {
    setApiError(null); // Clear previous API errors
    const result = await onSubmit(data);

    if (result && !result.success) {
      if (result.formError) {
        // Display API error in the form
        setApiError(result.formError);

        // If API provides field-specific errors, set them
        if (typeof result.formError === 'object') {
          Object.keys(result.formError).forEach((field) => {
            setError(field, {
              type: 'api',
              message: result.formError[field]
            });
          });
        }
      }
    }
  };

  // sync initial values when editing
  useEffect(() => {
    if (initialValues) {
      const mapped = {
        targetName: initialValues.targetName || '',
        eventName: initialValues.eventName || '',
        ranges: (initialValues.ranges || []).map((r) => ({
          rangeMin: r.rangeMin,
          rangeMax: r.rangeMax,
          commissionRate: r.commissionRate
        }))
      };
      reset(mapped);
    } else {
      reset(defaultValues);
    }
    setApiError(null); // Clear API errors when form is reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const addRange = () => {
    if (fields.length < 3) {
      const currentRanges = watch('ranges');
      const lastRangeIndex = fields.length - 1;
      const lastRangeMax = currentRanges?.[lastRangeIndex]?.rangeMax;

      // Set the new range min to the last range's max value
      const newRangeMin = lastRangeMax || 0;

      append({ rangeMin: newRangeMin, rangeMax: null, commissionRate: 0 });
    }
  };

  const removeRange = (index) => {
    if (fields.length > 1) {
      remove(index);

      // After removing, update the next range's min value if needed
      setTimeout(() => {
        if (index > 0 && index < fields.length - 1) {
          const currentRanges = watch('ranges');
          const previousRangeMax = currentRanges?.[index - 1]?.rangeMax;
          if (previousRangeMax !== null) {
            setValue(`ranges.${index}.rangeMin`, previousRangeMax);
          }
        }
      }, 0);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-dark-500">
          <h4 className="text-lg font-medium text-gray-900 dark:text-dark-100">{title}</h4>
          <Button onClick={onCancel} variant="outline" size="sm">
            <XMarkIcon className="size-4" />
          </Button>
        </div>

        {/* API Error Display */}
        {apiError && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div className="text-sm text-red-700 dark:text-red-300">
              {typeof apiError === 'string' ? apiError : JSON.stringify(apiError)}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="targetName"
            control={control}
            render={({ field }) => (
              <Listbox
                data={targetOptions}
                value={targetOptions.find((option) => option.value === field.value) || null}
                onChange={(val) => field.onChange(val.value)}
                label={t('target_type')}
                placeholder={t('select') + ' ' + t('target_type')}
                displayField="label"
                error={errors?.targetName?.message}
              />
            )}
          />

          <Controller
            name="eventName"
            control={control}
            render={({ field }) => (
              <Listbox
                data={availableEventOptions}
                value={availableEventOptions.find((option) => option.value === field.value) || null}
                onChange={(val) => field.onChange(val.value)}
                label={t('event_type')}
                placeholder={
                  availableEventOptions.length === 0
                    ? t('no_event_types_available')
                    : t('select') + ' ' + t('event_type')
                }
                displayField="label"
                error={errors?.eventName?.message}
                disabled={availableEventOptions.length === 0}
              />
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-dark-100">Commission Ranges</h5>
              <p className="text-sm text-gray-600 dark:text-dark-300">
                Ranges are continuous with no gaps. Each new range starts where the previous one
                ends.
              </p>
            </div>
            <Button
              type="button"
              onClick={addRange}
              variant="outline"
              size="sm"
              disabled={fields.length >= 3}>
              <PlusIcon className="size-4" />
              Add Range
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <Controller
                  name={`ranges.${index}.rangeMin`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      step="0.01"
                      label={t('range_min')}
                      placeholder="0"
                      disabled={index > 0} // Disable for all ranges except the first one
                      error={errors?.ranges?.[index]?.rangeMin?.message}
                    />
                  )}
                />

                <Controller
                  name={`ranges.${index}.rangeMax`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value === null || field.value === undefined ? '' : field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleRangeMaxChange(index, value);
                      }}
                      type="number"
                      min="0"
                      step="0.01"
                      label={t('range_max')}
                      placeholder={t('leave_empty_for_unlimited')}
                      error={errors?.ranges?.[index]?.rangeMax?.message}
                    />
                  )}
                />

                <Controller
                  name={`ranges.${index}.commissionRate`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      label={t('commission_rate') + ' (%)'}
                      placeholder="0"
                      error={errors?.ranges?.[index]?.commissionRate?.message}
                    />
                  )}
                />

                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={() => removeRange(index)}
                    variant="outline"
                    color="error"
                    size="sm"
                    disabled={fields.length === 1}>
                    <TrashIcon className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4 dark:border-dark-500">
          <Button onClick={onCancel} variant="outline">
            {t('cancel')}
          </Button>
          <Button type="submit" color="primary" disabled={loading}>
            {loading ? t('saving') + '...' : t('create')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default TargetForm;
