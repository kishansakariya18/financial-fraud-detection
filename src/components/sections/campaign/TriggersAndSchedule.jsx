import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Checkbox, Input, Select } from 'components/ui';
import { Controller } from 'react-hook-form';

const DAYS_OF_WEEK = [
  { key: 'MO', label: 'MO', value: 1 },
  { key: 'TU', label: 'TU', value: 2 },
  { key: 'WE', label: 'WE', value: 3 },
  { key: 'TH', label: 'TH', value: 4 },
  { key: 'FR', label: 'FR', value: 5 },
  { key: 'SA', label: 'SA', value: 6 },
  { key: 'SU', label: 'SU', value: 7 }
];

const TriggersAndSchedule = ({
  control,
  watch,
  setValue,
  errors,
  register,
  isStep = false,
  data, // For manual mode
  onChange // For manual mode
}) => {
  const { t } = useTranslation(); // eslint-disable-line no-unused-vars
  const [scheduleType, setScheduleType] = useState('weekly'); // 'weekly' or 'hourly'

  // Helper to get value (RHF or Manual)
  const getValue = (name) => (control ? watch(name) : data?.[name]);

  const recurring = getValue('recurring');
  const selectedDays = getValue('scheduleDays') || [];
  const scheduleTime = getValue('scheduleTime');

  const scheduleInterval = getValue('scheduleInterval');

  useEffect(() => {
    if (scheduleInterval) {
      setScheduleType('hourly');
    }
  }, [scheduleInterval]);

  const handleManualChange = (name, value) => {
    if (onChange) {
      onChange(name, value);
    }
  };

  const toggleDay = (dayValue) => {
    const currentDays = selectedDays || [];
    let newDays;
    if (currentDays.includes(dayValue)) {
      newDays = currentDays.filter((d) => d !== dayValue);
    } else {
      newDays = [...currentDays, dayValue];
    }

    if (control) {
      setValue('scheduleDays', newDays);
    } else {
      handleManualChange('scheduleDays', newDays);
    }
  };

  const handleCheckboxChange = (field, e) => {
    const isChecked = e.target.checked;

    if (control) {
      setValue(field, isChecked, { shouldValidate: true });
      if (isChecked) {
        ['onSegmentEntry', 'onSegmentExit', 'recurring'].forEach((f) => {
          if (f !== field) setValue(f, false);
        });
      }
    } else {
      handleManualChange(field, isChecked);
      if (isChecked) {
        ['onSegmentEntry', 'onSegmentExit', 'recurring'].forEach((f) => {
          if (f !== field) handleManualChange(f, false);
        });
      }
    }
  };

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-6 dark:border-dark-600 dark:bg-dark-800 ${
        isStep ? 'border-0 p-0 shadow-none' : ''
      }`}>
      {!isStep && (
        <>
          <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-dark-50">
            3. Triggers & Schedule
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-dark-300">
            Choose at least one trigger. Weekly schedule or run every X hours.
          </p>
        </>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Side: Triggers */}
        <div className="flex flex-col space-y-4">
          <Checkbox
            {...(control ? register('onSegmentEntry') : {})}
            checked={!!getValue('onSegmentEntry')}
            onChange={(e) => handleCheckboxChange('onSegmentEntry', e)}
            label="On Segment Entry"
            id="onSegmentEntry"
          />
          <Checkbox
            {...(control ? register('onSegmentExit') : {})}
            checked={!!getValue('onSegmentExit')}
            onChange={(e) => handleCheckboxChange('onSegmentExit', e)}
            label="On Segment Exit"
            id="onSegmentExit"
          />
          <Checkbox
            {...(control ? register('recurring') : {})}
            checked={!!getValue('recurring')}
            onChange={(e) => handleCheckboxChange('recurring', e)}
            label="Recurring"
            id="recurring"
          />
          <p className="text-xs text-gray-500 dark:text-dark-300">
            Timezone: Europe/Copenhagen. Stored as UTC.
          </p>
        </div>

        {/* Right Side: Schedule (Visible only if Recurring is checked) */}
        {recurring && (
          <div className="space-y-6 rounded-lg bg-gray-50 p-4 dark:bg-dark-700/50">
            {/* Toggle Switch */}
            <div className="inline-flex rounded-md bg-gray-100 p-1 dark:bg-dark-700">
              <button
                type="button"
                onClick={() => {
                  setScheduleType('weekly');
                  // Clear hourly data when switching to weekly
                  if (control) {
                    setValue('scheduleInterval', '');
                    setValue('scheduleAnchor', '');
                  } else {
                    handleManualChange('scheduleInterval', '');
                    handleManualChange('scheduleAnchor', '');
                  }
                }}
                className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
                  scheduleType === 'weekly'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-dark-800 dark:text-dark-50'
                    : 'text-gray-600 hover:text-gray-900 dark:text-dark-300 dark:hover:text-dark-100'
                }`}>
                Weekly
              </button>
              <button
                type="button"
                onClick={() => {
                  setScheduleType('hourly');
                  // Clear weekly data when switching to hourly
                  if (control) {
                    setValue('scheduleDays', []);
                    setValue('scheduleTime', '');
                  } else {
                    handleManualChange('scheduleDays', []);
                    handleManualChange('scheduleTime', '');
                  }
                }}
                className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
                  scheduleType === 'hourly'
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-dark-800 dark:text-dark-50'
                    : 'text-gray-600 hover:text-gray-900 dark:text-dark-300 dark:hover:text-dark-100'
                }`}>
                Every X hours
              </button>
            </div>

            {scheduleType === 'weekly' ? (
              <div className="space-y-4">
                {/* Days Selection */}
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`flex size-9 items-center justify-center rounded text-xs font-medium transition-colors ${
                        selectedDays.includes(day.value)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-dark-600 dark:text-dark-300 dark:hover:bg-dark-500'
                      }`}>
                      {day.label}
                    </button>
                  ))}
                </div>
                {errors?.scheduleDays && (
                  <p className="text-error-500 text-xs">{errors.scheduleDays.message}</p>
                )}

                {/* Time Input */}
                <div className="w-full sm:w-40">
                  <Input
                    {...(control ? register('scheduleTime') : {})}
                    value={!control ? getValue('scheduleTime') : undefined}
                    onChange={(e) => !control && handleManualChange('scheduleTime', e.target.value)}
                    type="time"
                    label="Time *"
                    error={errors?.scheduleTime?.message}
                  />
                </div>

                <p className="text-xs text-gray-500 dark:text-dark-300">
                  Every{' '}
                  {selectedDays.length > 0
                    ? selectedDays
                        .map((d) => DAYS_OF_WEEK.find((day) => day.value === d)?.label)
                        .join(', ')
                    : '...'}{' '}
                  at {scheduleTime || '--:--'} (Europe/Copenhagen)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Interval Input */}
                <div>
                  <Input
                    {...(control ? register('scheduleInterval') : {})}
                    value={!control ? getValue('scheduleInterval') : undefined}
                    onChange={(e) =>
                      !control && handleManualChange('scheduleInterval', e.target.value)
                    }
                    type="number"
                    label="Interval (hours) * 1-168"
                    placeholder="e.g. 24"
                    min="1"
                    max="168"
                    error={errors?.scheduleInterval?.message}
                  />
                </div>

                {/* Anchor Selection */}
                <div>
                  {control ? (
                    <Controller
                      name="scheduleAnchor"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Anchor *"
                          data={[
                            { value: 0, label: 'From Start time' },
                            { value: 1, label: 'Activation time' }
                          ]}
                          error={errors?.scheduleAnchor?.message}
                        />
                      )}
                    />
                  ) : (
                    <Select
                      value={getValue('scheduleAnchor')}
                      onChange={(e) => handleManualChange('scheduleAnchor', e.target.value)}
                      label="Anchor *"
                      data={[
                        { value: 0, label: 'From Start time' },
                        { value: 1, label: 'Activation time' }
                      ]}
                      error={errors?.scheduleAnchor?.message}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TriggersAndSchedule;
