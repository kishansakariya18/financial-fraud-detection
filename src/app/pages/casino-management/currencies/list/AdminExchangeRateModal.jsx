import { yupResolver } from '@hookform/resolvers/yup';
import { CustomModal } from 'components/custom';
import { Button, Input } from 'components/ui';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { adminExchangeRateSchema } from '../schema';
import CurrencyService from 'services/currency.services';
import { toast } from 'sonner';
import { useState } from 'react';

export function AdminExchangeRateModal({ show, onClose, row, table }) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(adminExchangeRateSchema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await CurrencyService.addAdminExchangeRate(row.original.id, data);
      if (result.status === 200) {
        toast.success('Exchange rate added successfully');
        table.options.meta?.fetchSummary();
        setIsSuccess(true);
      } else {
        toast.error(result.error || 'Failed to add exchange rate');
      }
    } catch {
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <CustomModal show={show} onClose={handleClose} title={t('enter_admin_exchange_rate')}>
      {isSuccess ? (
        <div>
          <div className="text-center">
            <h4 className="mb-2">{t('submitted')}</h4>
            <p>{t('exchange_rate_added_successfully')}</p>
          </div>
          <div className="mt-8 flex justify-end">
            <Button onClick={handleClose} color="primary">
              {t('done')}
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <Input
              type="number"
              {...register('exchange_rate')}
              label={t('exchange_rate')}
              error={errors?.exchange_rate?.message}
              placeholder={t('enter') + ' ' + t('exchange_rate')}
              onKeyDown={(e) => {
                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={handleClose} disabled={isSubmitting}>
              {t('cancel')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={isSubmitting}>
              {isSubmitting ? t('submitting') : t('submit')}
            </Button>
          </div>
        </form>
      )}
    </CustomModal>
  );
}

AdminExchangeRateModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  row: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired
};
