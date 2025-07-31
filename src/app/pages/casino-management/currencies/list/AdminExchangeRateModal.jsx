import { yupResolver } from '@hookform/resolvers/yup';
import { CustomModal } from 'components/custom';
import { Button, Input } from 'components/ui';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { adminExchangeRateSchema } from '../schema';
import CurrencyService from 'services/currency.services';
import { toast } from 'sonner';

export function AdminExchangeRateModal({ show, onClose, row, table }) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(adminExchangeRateSchema)
  });

  const onSubmit = async (data) => {
    const result = await CurrencyService.addAdminExchangeRate(row.original.id, data);
    if (result.status === 200) {
      toast.success('Exchange rate added successfully');
      table.options.meta?.fetchSummary();
      onClose();
    } else {
      toast.error(result.error || 'Failed to add exchange rate');
    }
  };

  return (
    <CustomModal show={show} onClose={onClose} title={t('enter_admin_exchange_rate')}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div className="mt-6 space-y-4">
          <Input
            {...register('exchange_rate')}
            label={t('exchange_rate')}
            error={errors?.exchange_rate?.message}
            placeholder={t('enter') + ' ' + t('exchange_rate')}
          />
        </div>
        <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
          <Button className="min-w-[7rem]" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button type="submit" className="min-w-[7rem]" color="primary">
            {t('submit')}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}

AdminExchangeRateModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  row: PropTypes.object.isRequired,
  table: PropTypes.object.isRequired
};
