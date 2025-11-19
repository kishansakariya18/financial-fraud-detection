// Import Dependencies
import { useEffect, useState } from 'react';

// Local Imports
import { Button, Card, Input, Radio, Skeleton } from 'components/ui';
import { useNavigate, useParams } from 'react-router';
import { Page } from 'components/shared/Page';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
import { useTranslation } from 'react-i18next';
import { useClipboard } from 'hooks';
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid';
import UserKycServices from 'services/player-kyc.services';
import { parseUserKycStatusToApp } from './helper';
import { toast } from 'sonner';
import { DOCUMENT_STATUS, DOCUMENT_TYPE, PERMISSIONS } from 'constants/app.constant';
import { showImage } from 'utils/showImage';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import usePermissions from 'app/router/usePermissions';

export function ViewDetails() {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { documentId } = useParams();
  const pageTitle = t('player') + ' ' + t('kyc') + ' ' + t('details');
  const { copied, copy } = useClipboard({ timeout: 2000 });
  const breadcrumbItem = [
    { title: t('playerKycRecords'), path: '/kyc/player-kyc-records' },
    { title: t('details') }
  ];

  const [selected, setSelected] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [approvalResponse, setApprovalResponse] = useState('');

  const fetchUserKycDetails = async () => {
    setLoading(true);
    const result = await UserKycServices.getUserKycDetails(documentId);

    if (result.status === 200) {
      const apiData = result.response.data;
      setResponse(apiData);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  useEffect(() => {
    fetchUserKycDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  if (!loading && approvalResponse) {
    toast.success(approvalResponse.message);
    fetchUserKycDetails();
    setApprovalResponse('');
  }

  const handleKycUpdate = async () => {
    setLoading(true);
    setError('');
    const result = await UserKycServices.updateKyc({
      userId: response?.UserID,
      status: selected === 'approve' ? DOCUMENT_STATUS.APPROVED : DOCUMENT_STATUS.REJECTED,
      documentId: response?.DocumentID,
      rejectReason
    });

    if (result.status === 200 || result.status === 201) {
      setApprovalResponse(result.response);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <Page title={t('playerKyc')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {pageTitle}
          </h2>

          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          {loading ? (
            [...Array(10)].map((_, i) => (
              <Skeleton key={i} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" />
            ))
          ) : (
            <Card className="h-full p-4 sm:p-5">
              <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
                {t('player') + ' ' + t('information')}
              </h6>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('userName')}
                  </p>
                  <p>{response?.user?.Username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('name')}
                  </p>
                  <p>{response?.NameOnDocument}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('email')}
                  </p>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <span> {response?.user?.Email || '-'}</span>
                    {response?.user?.Email && (
                      <Button
                        data-tooltip
                        data-tooltip-content={copied ? 'Copied' : 'Copy'}
                        onClick={() => copy(response?.Email)}
                        isIcon
                        variant="flat"
                        className="size-5 rounded-full group-hover/td:opacity-100"
                        aria-label="Copy Button">
                        <DocumentDuplicateIcon className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {response?.DocumentType === DOCUMENT_TYPE.DOCUMENT
                      ? t('document') + ' ' + t('number')
                      : t('account') + ' ' + t('number')}
                  </p>
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <span> {response?.DocumentIdentifier || '-'}</span>
                    {response?.DocumentIdentifier && (
                      <Button
                        data-tooltip
                        data-tooltip-content={copied ? 'Copied' : 'Copy'}
                        onClick={() => copy(response?.DocumentIdentifier)}
                        isIcon
                        variant="flat"
                        className="size-5 rounded-full group-hover/td:opacity-100"
                        aria-label="Copy Button">
                        <DocumentDuplicateIcon className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('mobile')}
                  </p>

                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <span>
                      {response?.dialCode || '+91'} {response?.user?.Mobile}
                    </span>
                    <Button
                      data-tooltip
                      data-tooltip-content={copied ? 'Copied' : 'Copy'}
                      onClick={() => copy(response?.user?.Mobile)}
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
                    {t('rejectReason')}
                  </p>

                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <span className="text-center">
                      {response?.RejectReason && response.RejectReason !== 'Approved'
                        ? response.RejectReason
                        : '-'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('status')}
                  </p>
                  <p>
                    {+response.DocumentStatus >= 0 &&
                      capitalizeFirstLetter(
                        parseUserKycStatusToApp(+response?.DocumentStatus).toUpperCase()
                      )}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('createdAt')}:
                  </p>
                  <p>{getDateInUTCToTimeZone(response?.DateCreated)}</p>
                </div>
              </div>
              <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
                {t('identification')}:
              </h6>
              <div className="mt-4">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    Document Type:
                  </p>
                  <p>
                    {+response?.DocumentType === DOCUMENT_TYPE.IDENTITY
                      ? t('identity')
                      : +response?.DocumentType === DOCUMENT_TYPE.ADDRESS
                        ? t('address')
                        : +response?.DocumentType === DOCUMENT_TYPE.SOURCE_OF_FUND
                          ? t('source_of_fund')
                          : '-'}
                  </p>
                </div>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('frontImage')}
                    </p>
                    <div className="mt-2 h-64 rounded-md border p-2 dark:border-dark-500">
                      {showImage('document', response?.FrontImage, 'h-full w-full object-contain')}
                    </div>
                  </div>
                  {response?.BackImage && (
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                        {t('backImage')}
                      </p>
                      <div className="mt-2 h-64 rounded-md border p-2 dark:border-dark-500">
                        {showImage('document', response?.BackImage, 'h-full w-full object-contain')}
                      </div>
                    </div>
                  )}
                </div>

                {hasPermission(PERMISSIONS.USER_KYC.UPDATE_KYC) && (
                  <div className="mt-4 space-y-4">
                    {+response?.DocumentStatus === DOCUMENT_STATUS.PENDING && (
                      <div className="flex flex-wrap gap-5">
                        <Radio
                          value="approve"
                          checked={selected === 'approve'}
                          onChange={(event) => {
                            setSelected(event.target.value);
                          }}
                          label="Approve"
                        />
                        <Radio
                          value="reject"
                          checked={selected === 'reject'}
                          onChange={(event) => {
                            setSelected(event.target.value);
                          }}
                          label={t('reject')}
                        />
                      </div>
                    )}
                    {selected === 'reject' &&
                      +response?.DocumentStatus === DOCUMENT_STATUS.PENDING && (
                        <div className="max-w-xl">
                          <Input
                            onChange={(e) => setRejectReason(e.target.value)}
                            label={t('rejectReason')}
                            placeholder={t('enter') + ' ' + t('rejectReason')}
                          />
                        </div>
                      )}
                  </div>
                )}
              </div>

              {hasPermission(PERMISSIONS.USER_KYC.UPDATE_KYC) && (
                <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
                  {+response?.DocumentStatus === DOCUMENT_STATUS.PENDING && (
                    <Button
                      className="min-w-[7rem]"
                      color={'primary'}
                      onClick={handleKycUpdate}
                      disabled={loading}>
                      {t('update')}
                    </Button>
                  )}
                  <Button className="min-w-[7rem]" onClick={() => navigate('/player-kyc')}>
                    {t('back')}
                  </Button>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
}
