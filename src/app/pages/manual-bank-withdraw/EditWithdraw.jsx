import { Page } from 'components/shared/Page';
import {
  UserIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  HashtagIcon
} from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Upload } from 'components/ui';
import { CiMobile1 } from 'react-icons/ci';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { Listbox } from 'components/shared/form/Listbox';
import CurrencyService from 'services/currency.services';
import { currencyListResponseMapper } from '../casino-management/currencies/helper';
import RenderImage from 'components/ui/custom/ImageRender';
import { CloudArrowUpIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import apiConfig from 'configs/api.config';

import { createBankDepositSchema } from '../manual-bank-deposit/schema';
import BankService from 'services/bank.services';

const EditWithdraw = () => {
  const { id } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { t } = useTranslation();
  const [bankDetail, setBankDetail] = useState(null);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const uploadRef = useRef();

  const breadcrumbItem = [{ title: t('bank_deposit'), path: '/withdraw' }, { title: t('edit') }];

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

  useEffect(() => {
    // Load active currencies for dropdown
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
        console.error('Failed to load currencies:', e);
      }
    };
    fetchCurrencies();

    if (id) {
      setLoading(true);
      BankService.bankDetail(id)
        .then((res) => {
          const bankData = res.response.data;
          const mappedData = {
            id: bankData.id,
            bankName: bankData.BankName,
            accountHolderName: bankData.AccountHolderName,
            accountNumber: bankData.AccountNumber,
            bankCode: bankData.BankCode,
            upiID: bankData.UPIID,
            additionalInfo: bankData.AdditionalInfo,
            currencyID: bankData.CurrencyID,
            qrCode: bankData.QRCode
          };
          setBankDetail(mappedData);
          reset(mappedData);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, reset]);

  const updateBankAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await BankService.updateBank(requestObject);
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
      navigate('/withdraw');
    }, 1000);

    setResponse(null);
  }

  const onSubmit = async (data) => {
    // Build multipart form data for update
    const formData = new FormData();
    formData.append('id', id);
    formData.append('bankName', data.bankName);
    formData.append('accountHolderName', data.accountHolderName);
    formData.append('accountNumber', data.accountNumber);
    formData.append('bankCode', data.bankCode);
    formData.append('upiID', data.upiID);
    if (data.currencyID) {
      formData.append('currencyID', data.currencyID);
    }
    if (file) {
      formData.append('media', file);
    }

    const requestObject = formData;
    await updateBankAPI(requestObject);
  };

  return (
    <Page title={t('edit') + ' ' + t('bank_deposit')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('bank_deposit') + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        {bankDetail && (
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
                  {(preview || bankDetail?.qrCode) && (
                    <RenderImage
                      preview={preview}
                      id={'qrCodeImage'}
                      label="QR Code :"
                      value={`${apiConfig.baseURL.S3_URL}/deposit-bank/${bankDetail.qrCode}`}
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
            </div>
            <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
              <Button
                type="button"
                className="min-w-[7rem]"
                onClick={() => reset()}
                disabled={loading}>
                {t('reset')}
              </Button>
              <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
                {t('update')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Page>
  );
};

export default EditWithdraw;
