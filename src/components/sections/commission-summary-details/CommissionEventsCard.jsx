import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import CommissionEventsList from 'components/sections/commission-events/list';
import { getDateInUTCToTimeZone } from 'helpers/functions';

export function CommissionEventsCard({ summaryData, agentUID, breadcrumbs }) {
  const { t } = useTranslation();

  if (!summaryData) return null;

  return (
    <div className="rounded-lg bg-white shadow dark:bg-dark-800">
      <EventsHeader
        eventName={summaryData.eventName}
        periodStart={summaryData.periodStart}
        periodEnd={summaryData.periodEnd}
      />

      <div className="p-1">
        <CommissionEventsList
          agentUID={agentUID}
          summaryData={summaryData}
          breadcrumbs={breadcrumbs}
          pageTitle={t('commission_events')}
          hideDateFilter={true}
          hideFilters={true}
          hideEventNameColumn={true}
        />
      </div>
    </div>
  );
}

function EventsHeader({ eventName, periodStart, periodEnd }) {
  const { t } = useTranslation();

  return (
    <div className="border-b border-gray-200 p-4 dark:border-dark-600">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
        {t('commission_events')} - {eventName}
      </h2>
      <p className="text-sm text-gray-600 dark:text-dark-300">
        {t('period')}: {getDateInUTCToTimeZone(periodStart)} - {getDateInUTCToTimeZone(periodEnd)}
      </p>
    </div>
  );
}

CommissionEventsCard.propTypes = {
  summaryData: PropTypes.object.isRequired,
  agentUID: PropTypes.string,
  breadcrumbs: PropTypes.array
};

EventsHeader.propTypes = {
  eventName: PropTypes.string.isRequired,
  periodStart: PropTypes.string.isRequired,
  periodEnd: PropTypes.string.isRequired
};
