// Import Dependencies
import { Page } from 'components/shared/Page';
// UserIcon, EnvelopeIcon, LockClosedIcon are no longer strictly needed for the table inputs,
// but I'll keep them imported in case you use them elsewhere or revert.
// import { yupResolver } from '@hookform/resolvers/yup'; // Removed for simpler table state management
import { useForm } from 'react-hook-form'; // Still used for form submission overall
import { Button, Checkbox } from 'components/ui'; // Keeping Button for the submit/reset buttons
// The Input component from components/ui will need adjustments or a simple HTML input
// to match the table's input field style precisely. I'll define a simple Input-like component directly for the table.
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import ReferralOfferService from 'services/referral-management.services';
import { referralOfferResponseMapper } from './helper';

// This is a simplified Input component for use directly within the table cells
// It matches the desired white box, black text, and focus styling.
const TableInput = ({ value, onChange, placeholder, type = 'text', className = '', ...props }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 placeholder-gray-400 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 ${className}`}
    {...props}
  />
);

const ReferralManagement = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [referralOffers, setReferralOffers] = useState([]); // State for table data
  const { t } = useTranslation();

  // useForm is kept primarily for handleSubmit which is useful for triggering form submission
  // even if individual inputs are not directly registered with it.
  const { handleSubmit } = useForm();

  // Function to handle changes in input fields
  const handleInputChange = (id, field, value) => {
    setReferralOffers((prevOffers) =>
      prevOffers.map((offer) => (offer.id === id ? { ...offer, [field]: value } : offer))
    );
  };

  // Function to handle changes in the active checkbox
  const handleCheckboxChange = (id, checked) => {
    setReferralOffers((prevOffers) =>
      prevOffers.map((offer) => (offer.id === id ? { ...offer, status: checked } : offer))
    );
  };

  const getReferralData = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await ReferralOfferService.referralOfferList();

      console.log('res::> ', result);

      const apiData = referralOfferResponseMapper(result.response.data);

      if (result.status === 200) {
        setReferralOffers(apiData);
      } else {
        setError(result.response);
      }
    } catch (error) {
      console.log('err: ', error);
    }

    setLoading(false);
  };

  // Simulate an API call to save the referral offers
  const saveReferralOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual API call to save the entire referralOffers data
      // For demonstration, simulating a success/failure
      const result = await ReferralOfferService.referralOfferUpdate(referralOffers);

      if (result && (result.status === 200 || result.status === 201)) {
        setResponse(result.response);
      } else {
        setError(result.error || t('something_went_wrong'));
      }
    } catch (err) {
      setError(t('an_unexpected_error_occurred'));
      console.error('API error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReferralData();
  }, []);

  useEffect(() => {
    if (!loading && error) {
      toast.error(error);
      setError('');
    }
  }, [loading, error]);

  useEffect(() => {
    if (!loading && !error && response) {
      toast.success(response.message);
      // Optional: navigate or reset form after success
      // setTimeout(() => { navigate('/users/admin'); }, 0);
      setResponse(null);
    }
  }, [loading, error, response]);

  const onSubmit = async () => {
    // This `referralOffers` state contains all the updated data from the table
    await saveReferralOffers(referralOffers);
  };

  const handleReset = () => {
    getReferralData();
    // toast.info(t('form_reset')); // Assuming 'form_reset' is a translation key
  };

  return (
    <Page title={t('referral') + ' ' + t('management')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('referral') + ' ' + t('management')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>{' '}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-6">
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {t('sr_no')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {t('name')}
                  </th>
                  <th
                    scope="colgroup"
                    colSpan="2"
                    className="border-l border-r border-gray-200 px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-300">
                    {t('referred') + ' ' + t('by')}
                  </th>
                  <th
                    scope="colgroup"
                    colSpan="2"
                    className="border-l border-r border-gray-200 px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-300">
                    {t('referred') + ' ' + t('to')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {t('status')}
                  </th>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"></th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"></th>
                  <th className="border-l border-gray-200 px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-300">
                    {t('user') + ' ' + t('realCash')}
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {t('user') + ' ' + t('bonus')}
                  </th>
                  <th className="border-l border-gray-200 px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-300">
                    {t('friend') + ' ' + t('realCash')}
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    {t('friend') + ' ' + t('bonus')}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                {referralOffers?.map((offer) => (
                  <tr key={offer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                      {offer.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      {t(offer.name)} {/* Translate name */}
                    </td>
                    <td className="border-l border-gray-200 px-2 py-2 dark:border-gray-700">
                      <TableInput
                        type="number"
                        step="any"
                        value={offer.userReal}
                        onChange={(e) =>
                          handleInputChange(offer.id, 'userReal', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <TableInput
                        type="number"
                        step="any"
                        value={offer.userBonus}
                        onChange={(e) =>
                          handleInputChange(offer.id, 'userBonus', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0"
                      />
                    </td>
                    {!offer.withoutReferral ? (
                      <>
                        <td className="border-l border-gray-200 px-2 py-2 dark:border-gray-700">
                          <TableInput
                            type="number"
                            step="any"
                            value={offer.friendReal}
                            onChange={(e) =>
                              handleInputChange(
                                offer.id,
                                'friendReal',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                          />
                        </td>
                        <td className="px-2 py-2">
                          <TableInput
                            type="number"
                            step="any"
                            value={offer.friendBonus}
                            onChange={(e) =>
                              handleInputChange(
                                offer.id,
                                'friendBonus',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="0"
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-2 py-2"></td>
                        <td className="px-2 py-2"></td>
                      </>
                    )}
                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm">
                      <Checkbox
                        defaultChecked
                        onChange={(e) => handleCheckboxChange(offer.id, e.target.checked)}
                        className="form-checkbox h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-500"
                        checked={offer.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={handleReset} disabled={loading}>
              {t('reset')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('save')} {/* Changed from 'create' to 'save' for clarity */}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default ReferralManagement;
