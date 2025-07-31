import { Page } from 'components/shared/Page';
import { useForm } from 'react-hook-form';
import { Button, Checkbox } from 'components/ui';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const fieldsData = [
  { id: 'firstName', name: 'First Name', hide: false, optional: false, required: true },
  { id: 'lastName', name: 'Last Name', hide: true, optional: false, required: false },
  { id: 'email', name: 'Email', hide: false, optional: false, required: true },
  { id: 'phone', name: 'Phone', hide: false, optional: false, required: true },
  { id: 'username', name: 'Username', hide: false, optional: false, required: true },
  { id: 'nickName', name: 'Nick Name', hide: true, optional: false, required: false },
  { id: 'dob', name: 'Dob', hide: true, optional: false, required: false },
  { id: 'currency', name: 'Currency', hide: false, optional: false, required: true },
  { id: 'city', name: 'City', hide: true, optional: false, required: false },
  { id: 'zipCode', name: 'Zip Code', hide: true, optional: false, required: false },
  { id: 'password', name: 'Password', hide: false, optional: false, required: true },
  { id: 'promoCode', name: 'Promo Code', hide: false, optional: false, required: true },
  { id: 'confirmPassword', name: 'Confirm Password', hide: false, optional: false, required: true },
  {
    id: 'eighteenYearCheck',
    name: 'Eighteen Year Check',
    hide: false,
    optional: false,
    required: true
  },
  { id: 'nationalId', name: 'National ID', hide: false, optional: false, required: true }
];

const RegistrationFields = () => {
  const [fields, setFields] = useState(fieldsData);
  const { t } = useTranslation();
  const { handleSubmit } = useForm();

  const handleCheckboxChange = (id, type) => {
    setFields((prevFields) =>
      prevFields.map((field) => {
        if (field.id === id) {
          const newField = { ...field };
          if (type === 'hide') {
            newField.hide = !newField.hide;
            if (newField.hide) {
              newField.optional = false;
              newField.required = false;
            }
          } else if (type === 'optional') {
            newField.optional = !newField.optional;
            if (newField.optional) {
              newField.hide = false;
              newField.required = false;
            }
          } else if (type === 'required') {
            newField.required = !newField.required;
            if (newField.required) {
              newField.hide = false;
              newField.optional = false;
            }
          }
          return newField;
        }
        return field;
      })
    );
  };

  const onSubmit = () => {
    console.log('Form submitted:', fields);
    toast.success('Settings saved successfully!');
  };

  return (
    <Page title={t('registration_fields')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('registration_fields')}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {t('field_name')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {t('hide')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {t('show_as_optional')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {t('show_as_required')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {fields.map((field) => (
                  <tr key={field.id}>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {field.name}
                    </td>
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={field.hide}
                        onChange={() => handleCheckboxChange(field.id, 'hide')}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={field.optional}
                        onChange={() => handleCheckboxChange(field.id, 'optional')}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={field.required}
                        onChange={() => handleCheckboxChange(field.id, 'required')}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="submit">{t('submit')}</Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default RegistrationFields;
