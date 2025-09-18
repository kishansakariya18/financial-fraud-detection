// Import Dependencies
import { Page } from 'components/shared/Page';
import {
  UserIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  HashtagIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Upload } from 'components/ui';
import { CiMobile1 } from 'react-icons/ci';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { Listbox } from 'components/shared/form/Listbox';
import RenderImage from 'components/ui/custom/ImageRender';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import CurrencyService from 'services/currency.services';
import { currencyListResponseMapper } from '../casino-management/currencies/helper';

import { createBankDepositSchema } from './schema';
import BankService from 'services/bank.services';
// import { useDisclosure } from 'hooks';

const CreateBankDeposit = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { t } = useTranslation();
  // const [show, { toggle }] = useDisclosure();

  const breadcrumbItem = [{ title: t('bank'), path: '/bank' }, { title: t('create') }];

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(createBankDepositSchema)
  });

  // Currency dropdown state
  const [currencyOptions, setCurrencyOptions] = useState([]);
  // Upload state for QR code (optional)
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const uploadRef = useRef();

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const result = await CurrencyService.getCurrencyList({
          filters: { status: 'active' },
          pagination: { pageIndex: 0, pageSize: 1000 }
        });

        if (result.status === 200) {
          const mapped = currencyListResponseMapper(result.response);
          const options = (mapped.list || []).map((c) => ({
            value: c.id,
            label: `${c.name} (${c.code})${c.symbol ? ` - ${c.symbol}` : ''}`
          }));
          setCurrencyOptions(options);
        } else {
          toast.error(result.error || 'Failed to load currencies');
        }
      } catch (e) {
        // Fallback error handling
        console.error('Failed to load currencies:', e);
        // toast.error('Failed to load currencies');
      }
    };

    fetchCurrencies();
  }, []);

  const createBankAPI = async (data) => {
    setLoading(true);
    setError(null);

    // Build multipart form data
    const formData = new FormData();
    formData.append('bankName', data.bankName);
    formData.append('accountHolderName', data.accountHolderName);
    formData.append('accountNumber', data.accountNumber);
    formData.append('bankCode', data.bankCode);
    formData.append('upiID', data.upiID);
    formData.append('currencyID', data.currencyID);
    if (file) {
      formData.append('media', file);
    }

    const result = await BankService.createBank(formData);

    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    setTimeout(() => {
      navigate('/bank');
    }, 0);

    setResponse(null);
  }

  const onSubmit = async (data) => {
    await createBankAPI(data);
  };
  return (
    <Page title={t('create') + ' ' + t('bank_deposit')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('bank_deposit') + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('bankName')}
                prefix={<BuildingLibraryIcon className="size-5" />}
                label={t('bankName')}
                error={errors?.bankName?.message}
                placeholder={t('enter') + ' ' + t('bankName')}
              />
              <Input
                {...register('accountHolderName')}
                prefix={<UserIcon className="size-5" />}
                label={t('accountHolderName')}
                error={errors?.accountHolderName?.message}
                placeholder={t('enter') + ' ' + t('accountHolderName')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register('accountNumber')}
                prefix={<CreditCardIcon className="size-5" />}
                label={t('accountNumber')}
                error={errors?.accountNumber?.message}
                placeholder={t('enter') + ' ' + t('accountNumber')}
              />
              <Input
                {...register('bankCode')}
                prefix={<HashtagIcon className="size-5" />}
                label={t('bankCode')}
                error={errors?.bankCode?.message}
                placeholder={t('enter') + ' ' + t('bankCode')}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={currencyOptions}
                    prefix={<CurrencyDollarIcon className="size-5" />}
                    value={currencyOptions.find((opt) => opt.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('currency')}
                    placeholder={t('select') + ' ' + t('currency')}
                    displayField="label"
                    error={errors?.currencyID?.message}
                  />
                )}
                control={control}
                name="currencyID"
              />
              <Input
                {...register('upiID')}
                prefix={<CiMobile1 className="size-5" />}
                label={t('enter') + ' ' + t('upiID')}
                error={errors?.upiID?.message}
                placeholder={t('enter') + ' ' + t('upiID')}
              />
            </div>

            {/* QR Code Upload (optional) */}
            <div className="mt-5 w-40 space-y-4">
              <div className="grid gap-4 sm:grid-cols-1">
                {preview && (
                  <RenderImage
                    preview={preview}
                    id={'qrCodeImage'}
                    label="QR Code :"
                    maxWidth="300px"
                    maxHeight="300px"
                  />
                )}
                <Upload
                  onChange={setFile}
                  ref={uploadRef}
                  setPreview={setPreview}
                  accept={'.png, .jpg, .jpeg'}>
                  {({ ...props }) => (
                    <Button color="primary" {...props} className="space-x-2">
                      <CloudArrowUpIcon className="size-5" />
                      <span>Choose File</span>
                    </Button>
                  )}
                </Upload>
                <Button
                  disabled={!file}
                  onClick={() => {
                    if (uploadRef.current) uploadRef.current.value = '';
                    setFile();
                    setPreview();
                  }}>
                  {t('reset')}
                </Button>
                {file && (
                  <div>
                    File name : <span className="font-medium">{file.name}</span>
                  </div>
                )}
              </div>
            </div>
            {/* The following block remains intentionally commented (legacy additionalInfo input)
            </div> */}
            {/* <div className="grid gap-4 lg:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={servicesOptions}
                    value={servicesOptions.find((status) => status.value === field.value) || null}
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('add') + ' ' + t('service')}
                    placeholder={t('select') + ' ' + t('service')}
                    displayField="label"
                    error={errors?.service?.message}
                  />
                )}
                control={control}
                name="service"
              />
            </div> */}
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
              {t('reset')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('create')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default CreateBankDeposit;
//"bankName":"State Bank Of India",
// "accountHolderName":"Akhilesh Rathore 8",
// "accountNumber":"10967899748",
// "bankCode":"SBIN0003493",
// "upiID":"rathoreakhilesh@ybl8",
// "additionalInfo":"{}"
