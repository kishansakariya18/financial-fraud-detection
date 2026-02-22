import { Badge } from 'components/ui';
import { getDateInUTCToTimeZone } from 'helpers/functions';
import {
  FRAUD_STATUS,
  TRANSACTION_TYPES,
  TRANSACTION_CATEGORIES,
  PAYMENT_METHODS
} from './constants';
import {
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  HashtagIcon,
  TagIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export function TransactionDetails({ transaction }) {
  const data = transaction?._originalData || transaction;

  const getLabel = (value, options) => {
    return options.find((opt) => opt.value === value)?.label || value;
  };

  const getStatusColor = (status) => {
    return FRAUD_STATUS.find((s) => s.value === status)?.color || 'neutral';
  };

  const getTypeColor = (type) => {
    return type === 'INCOME' ? 'success' : 'error';
  };

  const getRiskColor = (score) => {
    if (score > 80) return 'text-red-500';
    if (score > 50) return 'text-orange-500';
    if (score > 20) return 'text-yellow-500';
    return 'text-green-500';
  };

  const DetailItem = ({ icon: Icon, label, value, colorClass = '' }) => (
    <div className="flex items-start space-x-3 rtl:space-x-reverse">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-dark-700 dark:text-dark-300">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-dark-400">
          {label}
        </p>
        <p
          className={`mt-0.5 truncate text-sm font-semibold ${colorClass} text-gray-900 dark:text-dark-50`}>
          {value || 'N/A'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-2">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-dark-600">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            <CurrencyDollarIcon className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-dark-50">
              {data.amount} <span className="text-sm font-medium italic text-gray-500">USD</span>
            </h3>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Badge
                color={getTypeColor(data.type)}
                variant="flat"
                className="text-[10px] uppercase">
                {getLabel(data.type, TRANSACTION_TYPES)}
              </Badge>
              <Badge
                color={getStatusColor(data.fraudStatus)}
                variant="flat"
                className="text-[10px] uppercase">
                {getLabel(data.fraudStatus, FRAUD_STATUS)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-gray-500 dark:text-dark-400">Risk Score</p>
          <p className={`text-2xl font-black ${getRiskColor(data.fraudScore)}`}>
            {data.fraudScore}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-6">
          <DetailItem
            icon={HashtagIcon}
            label="Transaction ID"
            value={data._id?.toString() || data.id}
          />
          <DetailItem
            icon={UserIcon}
            label="User ID"
            value={data.userId?.toString() || data.userId}
          />
          <DetailItem
            icon={TagIcon}
            label="Category"
            value={getLabel(data.categoryId, TRANSACTION_CATEGORIES)}
          />
          <DetailItem
            icon={CreditCardIcon}
            label="Payment Method"
            value={getLabel(data.paymentMethod, PAYMENT_METHODS)}
          />
        </div>

        <div className="space-y-6">
          <DetailItem
            icon={CalendarIcon}
            label="Transaction Date"
            value={getDateInUTCToTimeZone(data.transactionDate)}
          />
          <DetailItem
            icon={ClockIcon}
            label="Created At"
            value={getDateInUTCToTimeZone(data.createdAt)}
          />
          <DetailItem icon={DocumentTextIcon} label="Description" value={data.description} />
          <DetailItem
            icon={ShieldCheckIcon}
            label="Fraud Status"
            value={getLabel(data.fraudStatus, FRAUD_STATUS)}
            colorClass={data.fraudStatus === 'CONFIRMED_FRAUD' ? 'text-red-600' : ''}
          />
        </div>
      </div>

      {data.location && (
        <div className="mt-8 rounded-xl bg-gray-50 p-4 dark:bg-dark-800/50">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-400">
            Location Details
          </h4>
          <div className="flex space-x-8 rtl:space-x-reverse">
            <div>
              <p className="text-[10px] font-medium uppercase text-gray-500">City</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-dark-50">
                {data.location.city || '-'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase text-gray-500">Country</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-dark-50">
                {data.location.country || '-'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
