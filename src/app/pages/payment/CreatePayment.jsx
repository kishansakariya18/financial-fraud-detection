// Import Dependencies
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { createPaymentSchema } from './schema';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import PaymentService from 'services/payment.services';
import { paymentOption, paymentStatusOption } from './helper';
import { Listbox } from 'components/shared/form/Listbox';
import { PAYMENT_OPT } from 'constants/app.constant';
import GameService from 'services/game.services';

const CreatePayment = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(null);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(createPaymentSchema)
  });

  const paymentOpt = watch('payment');
  const [statusOption, setStatusOption] = useState(paymentStatusOption);
  const [gameList, setGameList] = useState([]);

  console.log('errors: ', errors);

  const deposit = async (requestObject) => {
    setLoading(true);
    setError(null);

    const result = await PaymentService.deposit(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const winning = async (requestObject) => {
    setLoading(true);
    setError(null);

    const result = await PaymentService.winning(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const withdraw = async (requestObject) => {
    setLoading(true);
    setError(null);

    const result = await PaymentService.withdraw(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const betslip = async (requestObject) => {
    setLoading(true);
    setError(null);

    const result = await PaymentService.betslip(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const fetchActiveGameList = async () => {
    const result = await GameService.getGameList({
      filters: { status: 1 },
      isPaginationRequired: false
    });
    const apiData = result.response.data;

    if (result) {
      if (result.status === 200 || result.status === 201) {
        const gameListData = apiData.map((data) => {
          return {
            value: data.GameID,
            label: data.Name
          };
        });
        setGameList(gameListData);
      } else {
        setError(result.error);
      }
    }
  };

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    setResponse(null);
    reset();
  }

  useEffect(() => {
    if (+paymentOpt === PAYMENT_OPT.BETSLIP || +paymentOpt === PAYMENT_OPT.WINNING) {
      const newStatus = paymentStatusOption.filter((val) => val.value === 1);
      setStatusOption(newStatus);
    } else {
      setStatusOption(paymentStatusOption);
    }

    if (+paymentOpt === PAYMENT_OPT.BETSLIP) {
      fetchActiveGameList();
    }
  }, [paymentOpt]);

  const onSubmit = async (data) => {
    const postData = {
      userId: data.userUID,
      amount: data.amount,
      status: data.paymentStatus,
      odd: data?.odd || undefined,
      promoCode: data?.promoCode || undefined
    };

    switch (+paymentOpt) {
      case PAYMENT_OPT.DEPOSIT:
        await deposit(postData);
        break;
      case PAYMENT_OPT.WINNING:
        postData.betId = data.betUID;
        await winning(postData);
        break;
      case PAYMENT_OPT.WITHDRAW:
        await withdraw(postData);
        break;
      case PAYMENT_OPT.BETSLIP:
        postData.gameId = data.gameId;
        await betslip(postData);
        break;
      default:
        break;
    }
  };
  return (
    <ContentWrapper
      pageTitle={t('payment')}
      title={t('create') + ' ' + t('payment')}
      isTable={false}>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
        <div className="mt-2 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              {...register('userUID')}
              label={t('user') + ' ' + 'UID'}
              error={errors?.userUID?.message}
              placeholder={t('enter') + ' ' + t('user') + ' ' + 'UID'}
            />
            <Input
              {...register('amount')}
              label={t('amount')}
              error={errors?.amount?.message}
              placeholder={t('enter') + ' ' + t('amount')}
              type="number"
              name="amount"
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Controller
              render={({ field }) => (
                <Listbox
                  data={paymentOption}
                  value={paymentOption.find((opt) => opt.value === field.value) || null}
                  onChange={(val) => field.onChange(val.value)}
                  name={field.name}
                  label={t('payment') + ' ' + t('option')}
                  placeholder={t('select') + ' ' + t('payment') + ' ' + t('option')}
                  displayField="label"
                  error={errors?.payment?.message}
                />
              )}
              control={control}
              name="payment"
            />
            <Controller
              render={({ field }) => (
                <Listbox
                  data={statusOption}
                  value={statusOption.find((opt) => opt.value === field.value) || null}
                  onChange={(val) => field.onChange(val.value)}
                  name={field.name}
                  label={t('payment') + ' ' + t('status')}
                  placeholder={t('select') + ' ' + t('status')}
                  displayField="label"
                  error={errors?.paymentStatus?.message}
                />
              )}
              control={control}
              name="paymentStatus"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {+paymentOpt === PAYMENT_OPT.WINNING && (
              <Input
                name="betUID"
                label={t('bet') + ' ' + 'UID'}
                placeholder={t('enter') + ' ' + t('bet') + ' ' + 'UID'}
                {...register('betUID')}
                error={errors?.betUID?.message}
              />
            )}
            {+paymentOpt === PAYMENT_OPT.BETSLIP && (
              <>
                <Input
                  {...register('odd', {
                    validate: (val) => (val && isNaN(val)) || 'Value Must Be Valid Number'
                  })}
                  label={t('odd')}
                  error={errors?.odd?.message}
                  placeholder={t('enter') + ' ' + t('odd')}
                  type="number"
                />
                <Controller
                  render={({ field }) => (
                    <Listbox
                      data={gameList}
                      value={gameList.find((opt) => opt.value === field.value) || null}
                      onChange={(val) => field.onChange(val.value)}
                      name={field.name}
                      label={t('game')}
                      placeholder={t('select') + ' ' + t('game')}
                      displayField="label"
                      error={errors?.gameId?.message}
                    />
                  )}
                  control={control}
                  name="gameId"
                />
              </>
            )}
            {+paymentOpt === PAYMENT_OPT.DEPOSIT && (
              <Input
                {...register('promoCode')}
                label={t('promoCode')}
                error={errors?.promoCode?.message}
                placeholder={t('enter') + ' ' + t('promoCode')}
              />
            )}
          </div>
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
    </ContentWrapper>
  );
};

export default CreatePayment;
