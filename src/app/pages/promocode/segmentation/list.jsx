import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useClipboard, useLockScrollbar } from 'hooks';

// Local Imports - UI, Services, Helpers, Utils
import { columns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';

import PromoCodeService from 'services/promocode.services';
import {
  currencyTypeToAPP,
  discountTypeToAPP,
  displayTypeToAPP,
  parsePromoCodeStateToApp,
  parsePromoCodeStatus,
  segmentationTypeToAPP,
  typeToAPP
} from '../helper';
import { Button, Card, Skeleton, Upload } from 'components/ui';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
import { Toolbar } from './Toolbar';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';
import RenderImage from 'components/ui/custom/ImageRender';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
// import { Toolbar } from './Toolbar';

export default function SegmentationList() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState();
  const [response, setResponse] = useState();
  const { handleSubmit } = useForm();
  const pageTitle = t('segmentation') + ' ' + t('list');
  const { copied, copy } = useClipboard({ timeout: 2000 });
  const { promocodeId } = useParams();
  const [uploadFileResponse, setUploadFileResponse] = useState();

  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const uploadRef = useRef();

  const breadcrumbs = [{ title: t('promocode'), path: '/promocode' }, { title: t('segmentation') }];

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchPromocodeDetails = async () => {
    setLoading(true);
    const result = await PromoCodeService.getPromocodeDetail(promocodeId);

    if (result.status === 200) {
      const apiData = result.response.data;
      setResponse(apiData);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const fetchSegmentationDetails = async () => {
    const result = await PromoCodeService.getSegmentationDetail(promocodeId);

    const data = await result.response.data;

    if (result.status === 200) {
      const resultData = data.map((item) => {
        return {
          id: item.UserID,
          userId: item.UserID,
          username: item.Username
        };
      });
      return {
        status: 200,
        data: resultData
      };
    }
    return { status: result.status, error: result.error };
  };
  const uploadSegmentation = async () => {
    const result = await PromoCodeService.submitSegmentationData(promocodeId, file);

    if (result.status === 200) {
      setUploadFileResponse(result.response);
    } else {
      setError(result.response);
    }
    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData: fetchSegmentationDetails,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: { enableFullScreen: false },
      columnVisibility: { rejectReason: false }
    }
  });

  useEffect(() => {
    fetchPromocodeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promocodeId]);

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (!isLoading && uploadFileResponse) {
      toast.success(uploadFileResponse.message);
      setUploadFileResponse('');
      setFile('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadFileResponse]);

  const onSubmit = async (data) => {
    console.log('submitData', data);

    await uploadSegmentation(data);
  };

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper
      pageTitle={pageTitle}
      title={pageTitle}
      enableFullScreen={tableSettings.enableFullScreen}>
      <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
        <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
          {pageTitle}
        </h2>
        <div className="hidden self-stretch py-1 sm:flex">
          <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
        </div>
        <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
      </div>

      <div className="col-span-12 m-3 sm:col-span-8 lg:col-span-9">
        {loading ? (
          [...Array(10)].map((_, i) => (
            <Skeleton key={i} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />
          ))
        ) : (
          <Card className="h-full p-4 sm:p-5">
            <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
              {t('promocode') + ' ' + t('information')}
            </h6>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('promocode')}
                </p>
                <div className="flex space-x-1 rtl:space-x-reverse">
                  <span> {response?.PromoCode || '-'}</span>

                  <Button
                    data-tooltip
                    data-tooltip-content={copied ? 'Copied' : 'Copy'}
                    onClick={() => copy(response?.PromoCode)}
                    isIcon
                    variant="flat"
                    className="size-5 rounded-full group-hover/td:opacity-100"
                    aria-label="Copy Button">
                    <DocumentDuplicateIcon className="size-3.5" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('promocode') + ' ' + t('status')}
                </p>
                <p>{capitalizeFirstLetter(parsePromoCodeStatus(response?.PromoCodeStatus))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('state')}</p>
                <p>{capitalizeFirstLetter(parsePromoCodeStateToApp(response?.PromoCodeState))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('benefit') + ' ' + t('currency') + ' ' + t('type')}
                </p>
                <p>{capitalizeFirstLetter(currencyTypeToAPP(response?.BenefitCurrencyType))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('depositRequirement') + ' ' + t('type')}
                </p>
                <p>{capitalizeFirstLetter(typeToAPP(response?.DepositRequirementType))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('discount')}
                </p>
                <p>{response?.Amount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('min') + ' ' + t('amount')}
                </p>
                <p>{response?.MinAmount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('max') + ' ' + t('amount')}
                </p>
                <p>{response?.MaxAmount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('expiration') + ' ' + t('startAt')}
                </p>
                <p>{getDateInUTCToTimeZone(response?.StartDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('expiration') + ' ' + t('endAt')}
                </p>
                <p>{getDateInUTCToTimeZone(response?.EndDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('usageLimit')}
                </p>
                <p>{response?.UsageLimit}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('exact') + ' ' + t('amount')}
                </p>
                <p>{response?.ExactAmount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('benefitCap')}
                </p>
                <p>{response?.BenefitCap}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('discount') + ' ' + t('type')}
                </p>
                <p>{discountTypeToAPP(response?.DiscountType)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('isPublicVisible')}
                </p>
                <p>{capitalizeFirstLetter(displayTypeToAPP(response?.IsPubliclyVisible))}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('segmentation') + ' ' + t('type')}
                </p>
                <p>{capitalizeFirstLetter(segmentationTypeToAPP(response?.SegmentationType))}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  {t('createdAt')}
                </p>
                <p>{getDateInUTCToTimeZone(response?.DateCreated)}</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="ml-4 mt-5 w-40 space-y-4">
          <div className="grid gap-4 sm:grid-cols-1">
            {preview && <RenderImage preview={preview} id={'segmentationFile'} label="Icon :" />}
            <Upload onChange={setFile} ref={uploadRef} setPreview={setPreview} accept={'.csv'}>
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
                uploadRef.current.value = '';
                setFile();
                setPreview();
              }}>
              {t('reset')}
            </Button>
          </div>
          {file && (
            <div>
              File name : <span className="font-medium">{file.name}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end space-x-3 rtl:space-x-reverse">
          <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
            {t('update')}
          </Button>
        </div>
      </form>

      <Toolbar table={table} title={t('title')} pageTitle={t('segmentation') + ' ' + t('list')} />

      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
}
