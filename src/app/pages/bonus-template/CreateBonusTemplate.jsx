// import { toast } from 'sonner';

import CreateOREditForm from 'components/sections/bonus-template/CreateOREditForm';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import BonusTemplateService from 'services/bonus-template.services';
import { toast } from 'sonner';
import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

export default function CreateBonusTemplate() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const buildConfigPayloads = (formState = {}) => {
    const {
      templateInfo = {},
      rewardDetails = {},
      wageringConfig = {},
      maxCashoutConfig = {}
    } = formState;
    const bonusType = templateInfo.bonusType;

    const depositBoostConfig =
      bonusType === 'deposit_boost'
        ? {
            boostMode: rewardDetails.boostMode || null,
            boostPercent: Number(rewardDetails.boostPercent) || 0,
            minDepositAmount: Number(rewardDetails.minDepositAmount) || 0,
            maxBonusAmount: Number(rewardDetails.maxBonusAmount) || 0,
            variableRules: rewardDetails.variableRules
          }
        : null;

    const freeChipConfig =
      bonusType === 'free_chip' ? { amount: Number(rewardDetails.amount) || 0 } : null;

    const freeSpinsConfig =
      bonusType === 'free_spins'
        ? {
            gameID: rewardDetails.gameId || null,
            spinsCount: Number(rewardDetails.spinsCount) || 0,
            denominationPerSpin: Number(rewardDetails.denominationPerSpin) || 0,
            maxFreeSpinWinnings: Number(rewardDetails.maxFreeSpinWinnings) || 0
          }
        : null;

    return {
      bonusType,
      depositBoostConfig,
      freeChipConfig,
      freeSpinsConfig,
      wageringConfig: {
        wageringMode: wageringConfig.mode || null,
        wageringBase: wageringConfig.base || null,
        wageringValue: Number(wageringConfig.wageringValue) || 0,
        daysToWager: Number(wageringConfig.daysToWager) || 0
      },
      maxCashoutConfig: {
        mcoMode: maxCashoutConfig.mode || null,
        mcoBase: maxCashoutConfig.base || null,
        cashoutValue: Number(maxCashoutConfig.cashoutValue) || 0,
        stickyBonus: maxCashoutConfig.stickyBonus ? 1 : 0,
        kycRequired: maxCashoutConfig.kycRequired ? 1 : 0
      }
    };
  };

  const handleSubmit = async (formState) => {
    const { templateInfo = {}, bonusDetails = {}, gameplay = {} } = formState;
    const {
      depositBoostConfig,
      freeChipConfig,
      freeSpinsConfig,
      wageringConfig,
      maxCashoutConfig
    } = buildConfigPayloads(formState);
    const payload = {
      ...templateInfo,
      ...bonusDetails,
      displayPriority: Number(bonusDetails.displayPriority) || 0,
      expiryAfterIssuanceDays: Number(templateInfo.expiryAfterIssuanceDays) || 0,

      // gameplay
      minBet: Number(gameplay.minBet) || 0,
      maxBet: Number(gameplay.maxBet) || 0,
      allowedProviders: gameplay.allowedProviders.map((provider) => provider?.value || provider),
      allowedCategories: gameplay.allowedCategories.map((category) => category?.value || category),
      allowedGames: gameplay.allowedGames.map((game) => game?.value || game),
      gameProviderIncluded: gameplay.providerIncluded ? 1 : 0,
      gameCategoryIncluded: gameplay.categoryIncluded ? 1 : 0,
      gameIncluded: gameplay.gameIncluded ? 1 : 0,

      // configs (these will be JSON.stringified by objectToFormData)
      depositBoostConfig,
      freeChipConfig,
      freeSpinsConfig,
      ...wageringConfig,
      ...maxCashoutConfig
    };

    await BonusTemplateService.createTemplate(payload)
      .then(() => {
        toast.success(t('bonus_template_created_successfully'));
        setTimeout(() => {
          navigate('/bonus/templates');
        }, 0);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const breadcrumbItem = [
    { title: t('bonus_template'), path: '/bonus/templates' },
    { title: t('create') }
  ];

  return (
    <Page title={t('create') + ' ' + t('bonus_template')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('bonus_template') + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <CreateOREditForm onSubmit={handleSubmit} />
      </div>
    </Page>
  );
}
