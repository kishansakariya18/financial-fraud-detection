import { useTranslation } from 'react-i18next';
import { Page } from 'components/shared/Page';
import ContentWrapper from 'components/ui/custom/ContentWrapper';

export default function AgentRedeemCommission() {
  const { t } = useTranslation();

  return (
    <Page title={t('nav.calling_agent.redeem_commission')}>
      <ContentWrapper pageTitle={t('nav.calling_agent.redeem_commission')}>
        <div className="rounded-lg bg-white p-6 shadow dark:bg-dark-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-dark-100">
            {t('commission_redeem_requests')}
          </h2>

          <div className="py-8 text-center">
            <p className="text-gray-600 dark:text-dark-300">
              {t('view_your_commission_redeem_requests')}
            </p>
          </div>
        </div>
      </ContentWrapper>
    </Page>
  );
}
