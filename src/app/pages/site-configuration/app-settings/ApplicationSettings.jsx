import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { Card } from 'components/ui';
import { Input, Select, Radio, Textarea } from 'components/ui/Form';
import { Button } from 'components/ui/Button';
import { Collapse } from 'components/ui/Collapse';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import AuthService from 'services/auth.services';
import AppSettingsService from 'services/app-settings.services';
import { responseMapper } from './helper';
import { validateNumberValue } from '../schema';
import { capitalizeFirstLetter } from 'helpers/functions';
import { toast } from 'sonner';

export default function ApplicationSettings() {
  const [settings, setSettings] = useState([]); // normalized list of settings
  const [formValues, setFormValues] = useState({}); // key => edited value
  const [loadingIds, setLoadingIds] = useState({}); // id => boolean
  const [expandedKeys, setExpandedKeys] = useState({}); // key => boolean
  const [jsonForms, setJsonForms] = useState({}); // key => parsed object for editing
  const [errors, setErrors] = useState({}); // key => error message
  const { t } = useTranslation();
  const pageTitle = t('appSettings');
  const currencies = [
    'CLP',
    'BDT',
    'CNY',
    'EUR',
    'IDR',
    'INR',
    'JPY',
    'KRW',
    'MYR',
    'THB',
    'USD',
    'VND',
    'KZT',
    'NOK',
    'MAD'
  ];

  const fetchSettings = async () => {
    try {
      const response = await AuthService.loadInitialSettings();
      if (response.status === 200 || response.status === 201) {
        const apiData = Array.isArray(response?.response?.data)
          ? response.response.data
          : Array.isArray(response?.response)
            ? response.response
            : [];
        const rows = responseMapper(apiData);
        setSettings(rows);
        // initialize form values from API
        const initial = {};
        rows.forEach((row) => {
          initial[row.key] = row.value;
        });
        setFormValues(initial);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const setValue = (key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const isNumeric = (v) => {
    if (v === null || v === undefined) return false;
    return /^-?\d+(?:\.\d+)?$/.test(String(v));
  };

  const isBooleanString = (v) => v === '0' || v === '1';

  const isOnOff = (v) => typeof v === 'string' && ['on', 'off', 'ON', 'OFF'].includes(v);

  const isPrimitive = (v) => v === null || ['string', 'number', 'boolean'].includes(typeof v);

  const canRenderFlatJson = (obj) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
    return Object.values(obj).every((v) => isPrimitive(v));
  };

  const toggleExpand = (key) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
    // lazy init jsonForms on first expand
    if (!expandedKeys[key]) {
      try {
        const src = formValues[key];
        // Safe parse with double-decode support
        let parsed = typeof src === 'string' ? JSON.parse(src) : src;
        if (typeof parsed === 'string' && /^\s*[{[]/.test(parsed)) {
          try {
            parsed = JSON.parse(parsed);
          } catch {
            // ignore second parse fail
          }
        }
        if (parsed && typeof parsed === 'object') {
          setJsonForms((p) => ({ ...p, [key]: parsed }));
        }
      } catch {
        // ignore parse error; will fallback to Textarea
      }
    }
  };

  const updateJsonField = (rowKey, field, newVal) => {
    setJsonForms((prev) => {
      let base = prev[rowKey];
      if (!base || typeof base !== 'object') {
        try {
          base =
            typeof formValues[rowKey] === 'string'
              ? JSON.parse(formValues[rowKey])
              : formValues[rowKey];
          if (typeof base === 'string' && /^\s*[{[]/.test(base)) {
            base = JSON.parse(base);
          }
        } catch {
          base = {};
        }
      }
      const next = { ...(base || {}), [field]: newVal };
      // sync back to Value string
      setFormValues((fv) => ({ ...fv, [rowKey]: JSON.stringify(next) }));
      return { ...prev, [rowKey]: next };
    });
  };

  const renderInput = (row) => {
    const value = formValues[row.key];
    // Keys that should always render as boolean radios (0/1)
    const FORCE_RADIO_KEYS = new Set([
      'IsAffiliateMFAEnabled',
      'IsMFAEnabled',
      'CheckCalanderTime',
      'DefaultOTP',
      'IsGeoRestricted'
    ]);
    const forceBooleanRadio = FORCE_RADIO_KEYS.has(row.key);
    // Decide early if this should be treated as a number field
    const isNumberField = String(row?.valueType).toLowerCase() === 'number' || isNumeric(value);
    // Prefer value type hints if present on the original response
    // We don't have ValueType here via mapper; derive by heuristics
    // KYC mode: dropdown manual/auto
    if (row.key && String(row.key).toLowerCase().includes('kyc')) {
      const v = String(value ?? '').toLowerCase();
      return (
        <Select value={v} onChange={(e) => setValue(row.key, e.target.value)}>
          <option value="manual">{t('Manual')}</option>
          <option value="auto">{t('Auto')}</option>
        </Select>
      );
    }

    // Currency: static dropdown
    if (row.key && String(row.key).toLowerCase().includes('currency')) {
      const v = String(value ?? '').toUpperCase();
      return (
        <Select value={v} onChange={(e) => setValue(row.key, e.target.value)}>
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      );
    }

    // Force radios for specific keys or when value clearly boolean-like string
    if (forceBooleanRadio || (!isNumberField && isBooleanString(value))) {
      // Radio Yes/No
      return (
        <div className="flex items-center gap-4">
          <Radio
            name={`radio-${row.key}`}
            label={t('yes')}
            checked={String(value) === '1'}
            onChange={() => {
              setValue(row.key, '1');
              setErrors((prev) => ({ ...prev, [row.key]: '' }));
            }}
          />
          <Radio
            name={`radio-${row.key}`}
            label={t('no')}
            checked={String(value) === '0'}
            onChange={() => {
              setValue(row.key, '0');
              setErrors((prev) => ({ ...prev, [row.key]: '' }));
            }}
          />
        </div>
      );
    }

    if (isOnOff(value)) {
      // Dropdown for on/off
      return (
        <Select
          value={String(value).toLowerCase()}
          onChange={(e) => setValue(row.key, e.target.value)}>
          <option value="on">{t('On')}</option>
          <option value="off">{t('Off')}</option>
        </Select>
      );
    }

    // JSON detection with valueType support and object fallback
    const isJsonField =
      String(row?.valueType).toLowerCase() === 'json' ||
      typeof value === 'object' ||
      (typeof value === 'string' && /^\s*[{[]/.test(value));
    if (isJsonField) {
      let parsed;
      try {
        parsed = typeof value === 'string' ? JSON.parse(value) : value;
        // Handle double-encoded JSON strings like "{\"max\":\"100\"}"
        if (typeof parsed === 'string' && /^\s*[{[]/.test(parsed)) {
          try {
            parsed = JSON.parse(parsed);
          } catch {
            // keep as string if second parse fails
          }
        }
      } catch {
        parsed = null;
      }

      const flatEditable = parsed && canRenderFlatJson(parsed);

      return (
        <div className="w-full">
          <Card className="border border-gray-200 p-0 dark:border-dark-500">
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-left"
              onClick={() => toggleExpand(row.key)}>
              <div className="flex items-center gap-2">
                {expandedKeys[row.key] ? (
                  <ChevronDownIcon className="size-5 text-gray-500 dark:text-dark-300" />
                ) : (
                  <ChevronRightIcon className="size-5 text-gray-500 dark:text-dark-300" />
                )}
              </div>
              <span className="text-xs text-gray-500 dark:text-dark-300">
                {expandedKeys[row.key] ? t('collapse') : t('expand')}
              </span>
            </button>
            <Collapse
              in={!!expandedKeys[row.key]}
              className="border-t border-gray-200 px-4 py-4 dark:border-dark-500">
              {flatEditable ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {Object.entries(jsonForms[row.key] || parsed).map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500 dark:text-dark-300">
                        {capitalizeFirstLetter(k)}
                      </span>
                      <Input
                        value={v ?? ''}
                        onChange={(e) => updateJsonField(row.key, k, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <Textarea
                  rows={6}
                  value={value}
                  onChange={(e) => setValue(row.key, e.target.value)}
                />
              )}
            </Collapse>
          </Card>
        </div>
      );
    }

    // Numeric field rendering (non-negative, up to 2 decimals)
    if (isNumberField && !forceBooleanRadio) {
      const onChange = (e) => {
        const v = e.target.value;
        setValue(row.key, v);
        const err = validateNumberValue(v, {
          positive: true,
          allowZero: true,
          maxDecimals: 2
        });
        setErrors((prev) => ({ ...prev, [row.key]: err }));
      };
      const onKeyDown = (e) => {
        // Block minus, plus and scientific notation
        if (['e', 'E', '-', '+'].includes(e.key)) {
          e.preventDefault();
        }
      };
      const onPaste = (e) => {
        const text = (e.clipboardData || window.clipboardData).getData('text');
        if (/[-+eE]/.test(text)) {
          e.preventDefault();
        }
      };
      return (
        <Input
          type="number"
          inputMode="decimal"
          step="0.01"
          min={0}
          pattern="^\\d*(?:\\.\\d{0,2})?$"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          error={errors[row.key] || false}
        />
      );
    }

    // Default to text input
    return <Input value={value ?? ''} onChange={(e) => setValue(row.key, e.target.value)} />;
  };

  const handleUpdate = async (row) => {
    try {
      // Validate current value before update (non-negative, up to 2 decimals)
      const currentVal = formValues[row.key];
      const err = validateNumberValue(currentVal, {
        positive: true,
        allowZero: true,
        maxDecimals: 2
      });
      if (err) {
        setErrors((prev) => ({ ...prev, [row.key]: err }));
        return;
      }
      setLoadingIds((prev) => ({ ...prev, [row.id]: true }));
      const payload = {
        id: row.id,
        value: formValues[row.key],
        valueType: row.valueType
      };
      const res = await AppSettingsService.updateAppSettings(payload);
      if (res?.status === 200 || res?.status === 201) {
        toast.success(res?.response.message);
        await fetchSettings();
      } else {
        toast.error(res?.response.message);
      }
    } catch (err) {
      toast.error(err?.response?.message);
      console.error('Failed to update app setting', err);
    } finally {
      setLoadingIds((prev) => ({ ...prev, [row.id]: false }));
    }
  };

  return (
    <ContentWrapper pageTitle={pageTitle}>
      <div className="flex items-center space-x-4 px-[--margin-x] py-5 lg:py-6 rtl:space-x-reverse">
        <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
          {pageTitle}
        </h2>
        <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
        </div>
      </div>
      <div className="px-[--margin-x]">
        <Card className="px-[--margin-x]">
          <div className="grid grid-cols-1 gap-6 py-6">
            {settings.map((row) => (
              <div
                key={row.id}
                className="flex flex-col gap-2 rounded-md border border-gray-200 p-4 dark:border-dark-500">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 dark:text-dark-50">{row.name}</div>
                    <div className="font-medium text-gray-500 dark:text-dark-300">{row.key}</div>
                  </div>
                  <div className="flex flex-1 items-center gap-3 sm:max-w-xl">
                    <div className="flex-1">{renderInput(row)}</div>
                    <Button
                      color="primary"
                      onClick={() => handleUpdate(row)}
                      disabled={
                        !!loadingIds[row.id] ||
                        !!errors[row.key] ||
                        !(
                          row?.isEditable === 1 ||
                          row?.isEditable === true ||
                          Number(row?.isEditable) === 1
                        )
                      }>
                      {loadingIds[row.id] ? t('updating') : t('update')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ContentWrapper>
  );
}
