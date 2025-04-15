// Import Dependencies
import { Page } from 'components/shared/Page';
import { Avatar, Button, Card, Input, Radio } from 'components/ui';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import AffiliateService from 'services/affiliate.services';
import { BanknotesIcon } from '@heroicons/react/24/outline';

const UpdatePayout = ({ onOk, onClose, affiliate, row }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [selected, setSelected] = useState('approved');
  const [rejectReason, setRejectReason] = useState('');
  const { t } = useTranslation();
  const pageTitle = t('update') + ' ' + t('payout');

  const { affiliateId } = useParams();

  // Watch selected transaction type
  const updatePayoutAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await AffiliateService.updatePayoutRequest(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  if (!loading && response) {
    toast.success(response.message);
    setResponse('');
    onOk();
  }

  if (!loading && error) {
    toast.error(response.error);
    setError('');
  }

  const handleSubmit = () => {
    const postData = {
      payoutRequestId: row.original?.id,
      affiliateUID: affiliateId,
      status: selected,
      rejectReason: rejectReason || undefined
    };
    updatePayoutAPI(postData);
    onOk();
  };

  return (
    <Page title={pageTitle}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2 lg:grid-cols-2 lg:gap-2">
        <Card className="flex justify-between p-5">
          <div>
            <p>{t('requested') + ' ' + t('payout')}</p>
            <p className="this:info mt-0.5 text-2xl font-medium text-this dark:text-this-lighter">
              {row.original?.amount}
            </p>
          </div>
          <Avatar
            size={12}
            classNames={{
              display: 'mask is-squircle rounded-none'
            }}
            initialVariant="soft"
            initialColor="info">
            <BanknotesIcon className="size-6" />
          </Avatar>
        </Card>
        <Card className="flex justify-between p-5">
          <div>
            <p>{t('current') + ' ' + t('balance')}</p>
            <p className="this:info mt-0.5 text-2xl font-medium text-this dark:text-this-lighter">
              {affiliate?.Balance}
            </p>
          </div>
          <Avatar
            size={12}
            classNames={{
              display: 'mask is-squircle rounded-none'
            }}
            initialVariant="soft"
            initialColor="info">
            <BanknotesIcon className="size-6" />
          </Avatar>
        </Card>
      </div>

      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          <h6 className="mt-2 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
            {t('confirmation')}
          </h6>

          <div className="flex flex-wrap gap-5">
            <Radio
              value={'approved'}
              checked={selected === 'approved'}
              onChange={(event) => {
                setSelected(event.target.value);
              }}
              label={t('approve')}
            />
            <Radio
              value={'rejected'}
              checked={selected === 'rejected'}
              onChange={(event) => {
                setSelected(event.target.value);
              }}
              label={t('reject')}
            />
          </div>
          {selected === 'rejected' && (
            <div className="mt-4 flex flex-wrap gap-5">
              <Input
                label={t('reject') + ' ' + t('reason')}
                type="text"
                placeholder={t('enter') + ' ' + t('reject') + ' ' + t('reason')}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-2"></div>

          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button
              className="min-w-[7rem]"
              onClick={handleSubmit}
              disabled={loading}
              color={'primary'}>
              {t('update')}
            </Button>
            <Button className="min-w-[7rem]" onClick={onClose} disabled={loading}>
              {t('back')}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default UpdatePayout;
