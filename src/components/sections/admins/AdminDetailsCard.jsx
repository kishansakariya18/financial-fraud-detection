import { Button, Card, GhostSpinner } from 'components/ui';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useClipboard } from 'hooks';
import { capitalizeFirstLetter, getDateInUTCToTimeZone } from 'helpers/functions';
import { parseAdminStatusToApp } from 'app/pages/users/admin/helper';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const AdminDetailsCard = ({
  data,
  loading,
  error,
  titleKey = 'admin_information',
  uidKey = 'adminUid',
  showSuperAdmin = false,
  showRole = false
}) => {
  const { t } = useTranslation();
  const { copied, copy } = useClipboard({ timeout: 2000 });

  if (loading) {
    return (
      <Card className="h-full p-4 sm:p-5">
        <div className="flex h-32 items-center justify-center">
          <GhostSpinner className="size-8 border-2" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full p-4 sm:p-5">
        <div className="flex h-32 items-center justify-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="h-full p-4 sm:p-5">
        <div className="flex h-32 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">{t('noData')}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full p-4 sm:p-5">
      <h6 className="mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
        {t(titleKey)}:
      </h6>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t(uidKey)}:</p>
          <p>{data?.AdminUID}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('userName')}:</p>
          <p>{data?.Username}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('firstName')}:</p>
          <p>{data?.FirstName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('lastName')}:</p>
          <p>{data?.LastName}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('createdBy')}:</p>
          <p>{data?.CreatedByAdmin}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('email')}</p>
          <div className="flex space-x-1 rtl:space-x-reverse">
            <span> {data?.Email || '-'}</span>
            {data?.Email && (
              <Button
                data-tooltip
                data-tooltip-content={copied ? 'Copied' : 'Copy'}
                onClick={() => copy(data?.Email)}
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
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('mobile')}:</p>
          <span>
            {data?.dialCode || '+91'} {data?.Mobile}
          </span>
          {data?.Mobile && (
            <Button
              data-tooltip
              data-tooltip-content={copied ? 'Copied' : 'Copy'}
              onClick={() => copy(data?.Mobile)}
              isIcon
              variant="flat"
              className="size-5 rounded-full group-hover/td:opacity-100"
              aria-label="Copy Button">
              <DocumentDuplicateIcon className="size-3.5" />
            </Button>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('status')}:</p>
          <p>
            {+data?.AccountStatus >= 0 &&
              capitalizeFirstLetter(parseAdminStatusToApp(data?.AccountStatus))}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('createdAt')}:</p>
          <p>{getDateInUTCToTimeZone(data?.DateCreated)}</p>
        </div>
        {showSuperAdmin && (
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
              {t('isSuperAdmin')}:
            </p>
            <p>{data?.IsSuperAdmin ? t('yes') : t('no')}</p>
          </div>
        )}
        {showRole && (
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('role')}:</p>
            <p>{data?.role?.RoleName}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
            {t('lastLoginAt')}:
          </p>
          <p>{data?.LastLoginAt ? getDateInUTCToTimeZone(data?.LastLoginAt) : 'N/A'}</p>
        </div>
      </div>
    </Card>
  );
};

AdminDetailsCard.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.string,
  titleKey: PropTypes.string,
  uidKey: PropTypes.string,
  showSuperAdmin: PropTypes.bool,
  showRole: PropTypes.bool
};

export default AdminDetailsCard;
