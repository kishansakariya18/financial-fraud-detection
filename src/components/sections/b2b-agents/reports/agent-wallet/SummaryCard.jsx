// Import Dependencies
import PropTypes from 'prop-types';

// Local Imports
import { DashboardCard } from 'components/custom/DashboardCard';
import { useCurrencyContext } from 'app/contexts/currency/context';

// ----------------------------------------------------------------------

export function AgentWalletSummaryCard({ summary, loading = false }) {
  const { formatCurrency } = useCurrencyContext();

  if (!summary && !loading) return null;

  const summaryCards = {
    TOTAL_BALANCE: {
      key: 'Total Commission Balance',
      value: loading ? '...' : formatCurrency(summary?.totalBalance || 0),
      gradientFrom: 'from-green-400',
      gradientTo: 'to-emerald-600'
    },
    TOTAL_LINEUP_BALANCE: {
      key: 'Total LineUp Balance',
      value: loading ? '...' : formatCurrency(summary?.totalLineUpBalance || 0),
      gradientFrom: 'from-purple-400',
      gradientTo: 'to-indigo-600'
    }
  };

  return (
    <div className="mb-3 mt-4 grid grid-cols-1 gap-4 px-[--margin-x] sm:grid-cols-4">
      <DashboardCard
        label={summaryCards.TOTAL_BALANCE.key}
        value={summaryCards.TOTAL_BALANCE.value}
        gradientFrom={summaryCards.TOTAL_BALANCE.gradientFrom}
        gradientTo={summaryCards.TOTAL_BALANCE.gradientTo}
        textColor="text-green-100"
        maskShape="is-hexagon-2"
      />
      <DashboardCard
        label={summaryCards.TOTAL_LINEUP_BALANCE.key}
        value={summaryCards.TOTAL_LINEUP_BALANCE.value}
        gradientFrom={summaryCards.TOTAL_LINEUP_BALANCE.gradientFrom}
        gradientTo={summaryCards.TOTAL_LINEUP_BALANCE.gradientTo}
        textColor="text-purple-100"
        maskShape="is-diamond"
      />
    </div>
  );
}

AgentWalletSummaryCard.propTypes = {
  summary: PropTypes.shape({
    totalAgents: PropTypes.number,
    totalBalance: PropTypes.number,
    totalLineUpBalance: PropTypes.number,
    grandTotal: PropTypes.number
  }),
  loading: PropTypes.bool
};
