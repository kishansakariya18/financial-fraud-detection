import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardContent, CardHeader } from 'components/ui/card';
import { Form } from 'components/ui/Form';
import { Page } from 'components/shared/Page';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button } from 'components/ui';
import { FormInput } from 'components/shared/FormInput';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import CurrencyService from 'services/currency.services';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getError } from 'utils/axios';

const formSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  code: yup.string().required('Code is required'),
  symbol: yup.string().required('Symbol is required'),
  exchange_rate: yup
    .number()
    .typeError('Exchange rate must be a number')
    .min(0, 'Exchange rate must be a positive number')
    .required('Exchange rate is required')
});

export function EditCurrency() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currencyId } = useParams();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: '',
      code: '',
      symbol: '',
      exchange_rate: 0
    }
  });

  useEffect(() => {
    if (currencyId) {
      setLoading(true);
      CurrencyService.getCurrencyById(currencyId)
        .then((res) => {
          const currency = res.data.data;
          form.reset({
            name: currency.name,
            code: currency.code,
            symbol: currency.symbol,
            exchange_rate: currency.exchange_rate
          });
        })
        .catch((err) => {
          toast.error(getError(err));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currencyId, form]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await CurrencyService.updateCurrency(currencyId, data);
      toast.success(t('Currency updated successfully'));
      navigate('/casino-management/currencies/list');
    } catch (error) {
      toast.error(getError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page
      loading={loading}
      pageTitle={t('edit_currency')}
      breadcrumbs={[
        {
          title: t('casino_management')
        },
        {
          title: t('currencies'),
          href: '/casino-management/currencies/list'
        },
        {
          title: t('edit_currency')
        }
      ]}>
      <Card>
        <CardHeader>
          <h4 className="text-lg font-semibold tracking-wide">{t('edit_currency')}</h4>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput name="name" label={t('name')} placeholder={t('enter_name')} />
              <FormInput name="code" label={t('code')} placeholder={t('enter_code')} />
              <FormInput name="symbol" label={t('symbol')} placeholder={t('enter_symbol')} />
              <FormInput
                name="exchange_rate"
                label={t('exchange_rate')}
                placeholder={t('enter_exchange_rate')}
                type="number"
              />
              <div className="col-span-full flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={loading}>
                  {t('submit')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Page>
  );
}
