import { useTranslation } from 'react-i18next';
import { DashboardCard } from 'components/custom/DashboardCard';

const AgentDashboardCards = ({ dashboardData = {}, loading = false }) => {
  const { t } = useTranslation();

  const cards = [
    {
      label: `${t('total')} ${t('active')} ${t('agents')}`,
      value: dashboardData?.totalActiveAgents?.toString() || '0',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      textColor: 'text-blue-100',
      maskShape: 'is-diamond'
    },
    {
      label: `${t('total')} ${t('inactive')} ${t('agents')}`,
      value: dashboardData?.totalInactiveAgents?.toString() || '0',
      gradientFrom: 'from-gray-500',
      gradientTo: 'to-gray-600',
      textColor: 'text-gray-100',
      maskShape: 'is-reuleaux-triangle'
    },
    {
      label: `${t('total')} ${t('active')} ${t('players')}`,
      value: dashboardData?.totalActivePlayers?.toString() || '0',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-green-600',
      textColor: 'text-green-100',
      maskShape: 'is-hexagon-2'
    },
    {
      label: `${t('total')} ${t('inactive')} ${t('players')}`,
      value: dashboardData?.totalInactivePlayers?.toString() || '0',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-red-600',
      textColor: 'text-red-100',
      maskShape: 'is-diamond'
    },
    {
      label: `${t('direct')} ${t('agents')}`,
      value: dashboardData?.directAgents?.toString() || '0',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-purple-600',
      textColor: 'text-purple-100',
      maskShape: 'is-reuleaux-triangle'
    },
    {
      label: `${t('grandchild')} ${t('agents')}`,
      value: dashboardData?.grandchildAgents?.toString() || '0',
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-orange-600',
      textColor: 'text-amber-100',
      maskShape: 'is-hexagon-2'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, index) => (
        <DashboardCard
          key={index}
          label={card.label}
          value={card.value}
          gradientFrom={card.gradientFrom}
          gradientTo={card.gradientTo}
          textColor={card.textColor}
          maskShape={card.maskShape}
        />
      ))}
    </div>
  );
};

export default AgentDashboardCards;
