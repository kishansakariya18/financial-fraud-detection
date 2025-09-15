// Import Dependencies
import { toast } from 'sonner';
// import { HexColorPicker } from 'react-colorful';

// Local Imports
import { useThemeContext } from 'app/contexts/theme/context';
import { useDidUpdate } from 'hooks';
import { Button, Card, Input } from 'components/ui';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import HomePageService from 'services/home-page.services';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

const notificationPos = [
  {
    value: 'top-left',
    label: 'Top Left'
  },
  {
    value: 'top-center',
    label: 'Top Center'
  },
  {
    value: 'top-right',
    label: 'Top Right'
  },
  {
    value: 'bottom-left',
    label: 'Bottom Left'
  },
  {
    value: 'bottom-center',
    label: 'Bottom Center'
  },
  {
    value: 'bottom-right',
    label: 'Bottom Right'
  }
];

// const MAX_NOTIFICATION_COUNT = 5;

export default function CreateAppearance() {
  const theme = useThemeContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [primaryColor, setPrimaryColor] = useState('#00A676');
  const [secondaryColor, setSecondaryColor] = useState('#1BA9F5');
  const [fontColor1, setFontColor1] = useState('#FF0000');
  const [fontColor2, setFontColor2] = useState('#FF0000');
  const [fontColor3, setFontColor3] = useState('#FF0000');
  const [fontColor4, setFontColor4] = useState('#FF0000');
  const [name, setName] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const handleAddAppearance = async () => {
    setIsLoading(true);
    setError('');

    const result = await HomePageService.addAppearance({
      name,
      primaryColor,
      secondaryColor,
      fontColor1,
      fontColor2,
      fontColor3,
      fontColor4
    });

    if (result.status === 200) {
      setResponse(result.response);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  };

  if (!isLoading && error) {
    toast.error(error);
    setError('');
  }

  if (!isLoading && response) {
    toast.success(response.message);
    setResponse(null);
    navigate('/web/appearance');
  }
  useDidUpdate(() => {
    toast('Position updated', {
      description: `Notification position updated to ${
        notificationPos.find((pos) => pos.value === theme.notification?.position).label
      }`,
      descriptionClassName: 'text-gray-600 dark:text-dark-200 text-xs mt-0.5'
    });
  }, [theme.notification?.position]);

  useDidUpdate(() => {
    for (let i = 0; i < 3; i++) toast('This is a Toast');
  }, [theme.notification?.isExpanded]);

  return (
    <ContentWrapper isTable={false} pageTitle={t('appearance')}>
      <div className="w-full max-w-3xl 2xl:max-w-5xl">
        <h5 className="text-lg font-medium text-gray-800 dark:text-dark-50">{t('appearance')}</h5>
        <p className="mt-0.5 text-balance text-sm text-gray-500 dark:text-dark-200">
          {t(t('appearance_desc'))}
        </p>
        <div className="my-3 h-px bg-gray-200 dark:bg-dark-500" />
        <div>
          <Input
            label={t('appearance') + ' ' + t('name')}
            error={errors?.name?.message}
            placeholder={t('enter') + ' ' + t('appearance') + ' ' + t('name')}
            {...register('name', {
              required: 'Appearance Name Required',
              onChange: (e) => setName(e.target.value)
            })}
          />
        </div>
        <div className="space-y-8">
          <div>
            <div>
              <p className="text-base font-medium text-gray-800 dark:text-dark-100">
                {t('primary') + ' ' + t('color')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Card className="mt-2 px-4 py-4 pb-4 sm:px-5">
                <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
                <HexColorInput
                  color={primaryColor}
                  onChange={setPrimaryColor}
                  className="mt-2 p-2"
                />
                <div
                  className={`mt-2 border-l-[24px] pl-[10px]`}
                  style={{ borderLeftColor: primaryColor }}>
                  {t('current') + ' ' + t('color')} {primaryColor}
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div className="my-6 h-px bg-gray-200 dark:bg-dark-500"></div>
        <div className="space-y-8">
          <div>
            <div>
              <p className="text-base font-medium text-gray-800 dark:text-dark-100">
                {t('secondary') + ' ' + t('color')}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Card className="mt-2 px-4 py-4 pb-4 sm:px-5">
                <HexColorPicker color={secondaryColor} onChange={setSecondaryColor} />
                <HexColorInput
                  color={secondaryColor}
                  onChange={setSecondaryColor}
                  className="mt-2 p-2"
                />
                <div
                  className={`mt-2 border-l-[24px] pl-[10px]`}
                  style={{ borderLeftColor: secondaryColor }}>
                  {t('current') + ' ' + t('color')} {secondaryColor}
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div className="my-6 h-px bg-gray-200 dark:bg-dark-500"></div>
        <div className="space-y-8">
          <div>
            <div>
              <p className="text-base font-medium text-gray-800 dark:text-dark-100">
                {t('font') + ' ' + t('color')}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-2 lg:grid-cols-3 lg:gap-2">
              <Card className="mt-2 h-fit w-fit px-2 py-2 sm:px-3">
                <HexColorPicker color={fontColor1} onChange={setFontColor1} />
                <HexColorInput color={fontColor1} onChange={setFontColor1} className="mt-2 p-2" />
                <div
                  className={`mt-2 border-l-[24px] pl-[10px]`}
                  style={{ borderLeftColor: fontColor1 }}>
                  {t('current') + ' ' + t('color')}
                  {fontColor1}
                </div>
              </Card>
              <Card className="mt-2 h-fit w-fit px-2 py-2 sm:px-3">
                <HexColorPicker color={fontColor2} onChange={setFontColor2} />
                <HexColorInput color={fontColor2} onChange={setFontColor2} className="mt-2 p-2" />
                <div
                  className={`mt-2 border-l-[24px] pl-[10px]`}
                  style={{ borderLeftColor: fontColor2 }}>
                  {t('current') + ' ' + t('color')} {fontColor2}
                </div>
              </Card>
              <Card className="mt-2 h-fit w-fit px-2 py-2 sm:px-3">
                <HexColorPicker color={fontColor3} onChange={setFontColor3} />
                <HexColorInput color={fontColor3} onChange={setFontColor3} className="mt-2 p-2" />
                <div
                  className={`mt-2 border-l-[24px] pl-[10px]`}
                  style={{ borderLeftColor: fontColor3 }}>
                  {t('current') + ' ' + t('color')} {fontColor3}
                </div>
              </Card>
              <Card className="mt-2 h-fit w-fit px-2 py-2 sm:px-3">
                <HexColorPicker color={fontColor4} onChange={setFontColor4} />
                <HexColorInput color={fontColor4} onChange={setFontColor4} className="mt-2 p-2" />
                <div
                  className={`mt-2 border-l-[24px] pl-[10px]`}
                  style={{ borderLeftColor: fontColor4 }}>
                  {t('current') + ' ' + t('color')} {fontColor4}
                </div>
              </Card>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-2">
          <Button color="primary" onClick={handleSubmit(handleAddAppearance)} disabled={isLoading}>
            {t('create')}
          </Button>
        </div>
      </div>
    </ContentWrapper>
  );
}
