import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Form, Formik } from 'formik';
import { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Input, Select, Textarea } from '../../../../components/form';
import { getActivePaymentMethods } from '../../../../store/payment-methods/action';
import { getCurrency, updateCurrency } from '../../../../store/currencies/action';

const EditCurrency = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const { currency, loading, paymentMethods, paymentMethodsLoading } = useSelector(
    (state) => ({
      currency: state.currencies.currency,
      loading: state.currencies.loading,
      paymentMethods: state.paymentMethods.paymentMethods,
      paymentMethodsLoading: state.paymentMethods.loading
    }),
    shallowEqual
  );

  useEffect(() => {
    if (id) {
      dispatch(getCurrency(id));
    }
    dispatch(getActivePaymentMethods());
  }, [id, dispatch]);

  const initialValues = {
    name: currency?.name || '',
    code: currency?.code || '',
    symbol: currency?.symbol || '',
    payment_methods: currency?.payment_methods?.map((e) => e?._id) || [],
    is_active: currency?.is_active || false,
    is_default: currency?.is_default || false,
    is_crypto: currency?.is_crypto || false,
    description: currency?.description || '',
    icon: currency?.icon || ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    code: Yup.string().required('Code is required'),
    symbol: Yup.string().required('Symbol is required'),
    is_active: Yup.boolean(),
    is_default: Yup.boolean(),
    is_crypto: Yup.boolean(),
    description: Yup.string(),
    icon: Yup.string()
  });

  const handleSubmit = (values) => {
    dispatch(updateCurrency(id, values));
  };

  return (
    <div className="w-full">
      <div className="rounded-md bg-white dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300">Edit Currency</h4>
        </div>
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize>
            {() => (
              <Form>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Input label="Name" name="name" />
                  <Input label="Code" name="code" />
                  <Input label="Symbol" name="symbol" />
                  <Select
                    label="Payment Methods"
                    name="payment_methods"
                    options={paymentMethods?.map((e) => ({ value: e?._id, label: e?.name }))}
                    isMulti
                    isLoading={paymentMethodsLoading}
                  />
                  <div className="flex items-center space-x-4">
                    <Input label="Is Active" name="is_active" type="checkbox" />
                    <Input label="Is Default" name="is_default" type="checkbox" />
                    <Input label="Is Crypto" name="is_crypto" type="checkbox" />
                  </div>
                  <Textarea label="Description" name="description" />
                  <div className="flex items-center space-x-4">
                    <div className="h-32 w-32 overflow-hidden rounded-md">
                      <img
                        src={currency?.icon}
                        alt={currency?.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="icon"
                        className="h-32 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                        <div className="text-center">
                          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-1">Upload an icon or drag and drop</p>
                          <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                        <Input id="icon" name="icon" type="file" className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default EditCurrency;
