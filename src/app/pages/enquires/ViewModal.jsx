import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Badge } from 'components/ui/Badge';
import { enquiresStatusOptions } from './helper';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export default function ViewModal({ data }) {
  const { t } = useTranslation();

  const subject = useMemo(() => data?.Subject || data?.subject || '-', [data]);
  const description = useMemo(() => data?.Description || data?.description || '-', [data]);
  const email = useMemo(() => data?.Email || data?.email || '-', [data]);
  const status = useMemo(() => data?.Status || data?.status || '-', [data]);
  const createdAt = useMemo(() => data?.DateCreated || data?.createdAt || '-', [data]);
  const createdAtFormatted = useMemo(() => {
    if (data?.DateCreated) return getDateInUTCToTimeZone(data.DateCreated);
    return createdAt;
  }, [createdAt, data?.DateCreated]);
  const statusOption = useMemo(
    () => enquiresStatusOptions.find((o) => o.value === status) || null,
    [status]
  );

  return (
    <div className="col-span-12 sm:col-span-8 lg:col-span-9">
      <div className="h-full px-4 pb-2">
        <h6 className="mt-2 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
          {t('enquires')} {t('details')}:
        </h6>
        <div className="mt-4 max-h-[60vh] overflow-y-auto overflow-x-hidden pr-1">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('subject')}:
              </p>
              <p className="break-words">{subject}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('email')}:</p>
              <p className="break-all">{email}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('description')}:
              </p>
              <p className="whitespace-pre-wrap break-words">{description}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">{t('status')}:</p>
              {statusOption ? (
                <Badge color={statusOption.color} variant="soft" className="inline-flex">
                  {statusOption.label}
                </Badge>
              ) : (
                <p className="break-words">{status}</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                {t('date_created')}:
              </p>
              <p className="break-words">{createdAtFormatted}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ViewModal.propTypes = {
  data: PropTypes.object
};
