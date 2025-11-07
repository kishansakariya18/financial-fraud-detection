// Import Dependencies
import PropTypes from 'prop-types';

// Local Imports
import { DashboardCard } from 'components/custom/DashboardCard';
import { useCurrencyContext } from 'app/contexts/currency/context';

// ----------------------------------------------------------------------

export function AgentCommissionSummaryCard({ summary, loading = false }) {
  const { formatCurrency } = useCurrencyContext();

  if (!summary && !loading) return null;

  const summaryCards = {
    TOTAL_AGENTS: {
      key: 'Total Agents Commission Achieved',
      value: loading ? '...' : (summary?.totalAgents || 0).toString(),
      gradientFrom: 'from-sky-400',
      gradientTo: 'to-blue-600'
    },
    TOTAL_COMMISSION_AMOUNT: {
      key: 'Total Commission Amount',
      value: loading ? '...' : formatCurrency(summary?.totalCommissionAmount || 0),
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-600'
    }
  };

  return (
    <div className="mb-3 mt-4 grid grid-cols-1 gap-4 px-[--margin-x] sm:grid-cols-4">
      <DashboardCard
        label={summaryCards.TOTAL_AGENTS.key}
        value={summaryCards.TOTAL_AGENTS.value}
        gradientFrom={summaryCards.TOTAL_AGENTS.gradientFrom}
        gradientTo={summaryCards.TOTAL_AGENTS.gradientTo}
        textColor="text-sky-100"
        maskShape="is-reuleaux-triangle"
      />
      <DashboardCard
        label={summaryCards.TOTAL_COMMISSION_AMOUNT.key}
        value={summaryCards.TOTAL_COMMISSION_AMOUNT.value}
        gradientFrom={summaryCards.TOTAL_COMMISSION_AMOUNT.gradientFrom}
        gradientTo={summaryCards.TOTAL_COMMISSION_AMOUNT.gradientTo}
        textColor="text-amber-100"
        maskShape="is-hexagon"
      />
    </div>
  );
}

AgentCommissionSummaryCard.propTypes = {
  summary: PropTypes.shape({
    totalAgents: PropTypes.number,
    totalCommissionSettings: PropTypes.number,
    totalCommissionAchievedCount: PropTypes.number,
    totalCommissionAmount: PropTypes.number
  }),
  loading: PropTypes.bool
};
