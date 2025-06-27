import { useState } from 'react';

import CustomSwitch from 'components/custom/CustomSwitch';
import { useTranslation } from 'react-i18next';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { Card } from 'components/ui';

export default function ApplicationSettings() {
  const [settings, setSettings] = useState({
    allowBetting: false,
    maintenance: false,
    casino: false,
    sportsbook: false,
    manualKYC: false
  });
  const { t } = useTranslation();
  const pageTitle = t('appSettings');

  const handleSwitch = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsList = [
    {
      key: 'allowBetting',
      label: t('allowBetting'),
      description: t('allowBettingDescription')
    },
    {
      key: 'maintenance',
      label: t('maintenance'),
      description: t('maintananceDescription')
    },
    {
      key: 'casino',
      label: t('casino'),
      description: t('casinoDescription')
    },
    {
      key: 'sportsbook',
      label: t('sportsBook'),
      description: t('sportsBookDescription')
    },
    {
      key: 'manualKYC',
      label: t('manualKYC'),
      description: t('manualKYCDescription')
    }
  ];

  return (
    <ContentWrapper pageTitle={pageTitle}>
      <div className="flex items-center space-x-4 px-[--margin-x] py-5 lg:py-6 rtl:space-x-reverse">
        <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
          {pageTitle}
        </h2>
        <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
        </div>
      </div>
      <div className="px-[--margin-x]">
        <Card className="px-[--margin-x]">
          <div className="grid grid-cols-1 gap-8 py-6 sm:grid-cols-2">
            {settingsList.map((setting) => (
              <div key={setting.key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-dark-50">
                      {setting.label}
                    </div>
                    <div className="text-sm text-gray-400 dark:text-dark-200">
                      {setting.description}
                    </div>
                  </div>
                  <CustomSwitch
                    checked={settings[setting.key]}
                    onChange={() => handleSwitch(setting.key)}
                    label=""
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ContentWrapper>
  );
}
