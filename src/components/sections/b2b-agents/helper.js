import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from '../../../helpers/functions';
import {
  AGENT_TIER_TYPE,
  GENERAL_STATUS,
  AGENT_TRANSACTION_TYPE,
  CREDIT_DEBIT_TYPE
} from 'constants/app.constant';

export const parseAgentStatusToApp = (status) => (status ? 'active' : 'inactive');

export const parseAgentStatusToApi = (status) => {
  let apiStatus = null;
  if (status === 'inactive') {
    apiStatus = GENERAL_STATUS.INACTIVE;
  } else if (status === 'active') {
    apiStatus = GENERAL_STATUS.ACTIVE;
  }
  return apiStatus;
};

export const parseAgentTypeToApp = (agentType) => {
  switch (Number(agentType)) {
    case AGENT_TIER_TYPE.TIER_1:
      return 'Tier 1';
    case AGENT_TIER_TYPE.TIER_2:
      return 'Tier 2';
    case AGENT_TIER_TYPE.TIER_3:
      return 'Tier 3';
    default:
      return 'Tier 1';
  }
};

export const parseAgentTypeToApi = (agentType) => {
  switch (agentType) {
    case 'Tier 1':
      return AGENT_TIER_TYPE.TIER_1;
    case 'Tier 2':
      return AGENT_TIER_TYPE.TIER_2;
    case 'Tier 3':
      return AGENT_TIER_TYPE.TIER_3;
    default:
      return AGENT_TIER_TYPE.TIER_1;
  }
};

export const translator = (t, text, ns) => t(`${text}`, { ns });

export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => mapAgentdata(data));
  return resultData;
};

export const mapAgentdata = (data) => {
  return {
    id: data.AgentID,
    agentUID: data.AgentUID,
    username: data.Username,
    firstname: data.FirstName,
    lastname: data.LastName,
    email: data.Email,
    phoneCode: data.PhoneCode,
    mobile: data.Mobile,
    agentType: parseAgentTypeToApp(data.AgentType),
    parentAgentId: data.ParentAgentID,
    createdByAdminId: data.CreatedByAdminID,
    createdAt: getDateInUTCToTimeZone(data.DateCreated),
    modifiedAt: data.DateModified ? getDateInUTCToTimeZone(data.DateModified) : '',
    lastLoginAt: data.LastLoginAt ? getDateInUTCToTimeZone(data.LastLoginAt) : '',
    loginCount: data.LoginCount || 0,
    status: parseAgentStatusToApp(data.AccountStatus),
    commissionPercent: data.CommissionPercent || 0,
    commissions: mapCommissions(data.CommissionSettings)
  };
};

export const statusOptions = [
  { label: 'Active', value: 'active', color: 'success', icon: CheckBadgeIcon },
  { label: 'Inactive', value: 'inactive', color: 'error', icon: XCircleIcon }
];

export const agentTypeOptions = [
  { label: 'Tier 1', value: 'Tier 1' },
  { label: 'Tier 2', value: 'Tier 2' },
  { label: 'Tier 3', value: 'Tier 3' }
];

export const mapCommissions = (commissions) => {
  return (commissions || []).map((commission) => ({
    agentCommissionSettingID: commission.AgentCommissionSettingID,
    agentID: commission.AgentID,
    commissionType: commission.CommissionType,
    turnoverPercent: commission.TurnoverPercent,
    cpaPayoutAmount: commission.CpaPayoutAmount,
    cpaDepositMinAmount: commission.CpaDepositMinAmount,
    cpaBetMinAmount: commission.CpaBetMinAmount,
    cpaTrigger: commission.CpaTrigger,
    effectiveFrom: commission.EffectiveFrom,
    effectiveTo: commission.EffectiveTo,
    createdAt: commission.CreatedAt,
    updatedAt: commission.UpdatedAt
  }));
};

// Commission mapping functions
export const mapCommissionsFromApi = (commissions) => {
  if (!commissions || !Array.isArray(commissions)) {
    return [];
  }
};

export const mapCommissionsToApi = (commissions) => {
  if (!commissions || !Array.isArray(commissions)) {
    return [];
  }

  return commissions.map((commission) => {
    console.log(commission, 576846);
    const baseCommission = {
      commissionType: commission.commissionType
    };

    // Add type-specific fields
    switch (commission.commissionType) {
      case 'turnover':
        return {
          ...baseCommission,
          turnoverPercent: parseFloat(commission.turnoverPercent) || 0
        };
      case 'cpa': {
        const cpaCommission = {
          ...baseCommission,
          cpaPayoutAmount: parseFloat(commission.cpaPayoutAmount) || 0,
          cpaTrigger: commission.cpaTrigger || 'deposit'
        };

        // Add conditional fields based on trigger
        if (commission.cpaTrigger === 'deposit' || commission.cpaTrigger === 'both') {
          cpaCommission.cpaDepositMinAmount = parseFloat(commission.cpaDepositMinAmount) || 0;
        }

        if (commission.cpaTrigger === 'bet' || commission.cpaTrigger === 'both') {
          cpaCommission.cpaBetMinAmount = parseFloat(commission.cpaBetMinAmount) || 0;
        }

        return cpaCommission;
      }
      default:
        return baseCommission;
    }
  });
};

// Agent Transaction Helper Functions
export const agentTransactionTypeApiToApp = (type) => {
  switch (Number(type)) {
    case AGENT_TRANSACTION_TYPE.ALLOCATION:
      return 'Allocation';
    case AGENT_TRANSACTION_TYPE.DEALLOCATION:
      return 'Deallocation';
    case AGENT_TRANSACTION_TYPE.COMMISSION_CREDIT:
      return 'Commission Credit';
    case AGENT_TRANSACTION_TYPE.COMMISSION_DEBIT:
      return 'Commission Debit';
    case AGENT_TRANSACTION_TYPE.MANUAL_ADJUSTMENT:
      return 'Manual Adjustment';
    default:
      return 'Unknown';
  }
};

export const creditDebitTypeApiToApp = (type) => {
  switch (Number(type)) {
    case CREDIT_DEBIT_TYPE.CREDIT:
      return 'Credit';
    case CREDIT_DEBIT_TYPE.DEBIT:
      return 'Debit';
    default:
      return 'Unknown';
  }
};

export const agentTransactionsResponseMapper = (apiData) => {
  const totalRecords = apiData?.totalRecords || 0;
  // Ensure data is an array before mapping
  const dataArray = Array.isArray(apiData?.data) ? apiData.data : [];
  const list = dataArray.map((item) => mapTrasanctionMapper(item));

  return { totalRecords, list };
};

export const mapTrasanctionMapper = (item) => ({
  id: item?.AgentWalletTransactionID || item?.OperatorWalletTransactionID,
  agentWalletTransactionID: item?.AgentWalletTransactionID || item?.OperatorWalletTransactionID,
  fromEntityType: item.FromEntityType,
  fromEntityID: item.FromEntityID,
  toEntityType: item.ToEntityType,
  toEntityID: item.ToEntityID,
  from: item.From || null,
  to: item.To || null,
  amount: item.Amount,
  creditDebitType: creditDebitTypeApiToApp(item.CreditDebitType),
  transactionType: agentTransactionTypeApiToApp(item.TransactionType),
  transactionTypeCode: item.TransactionType,
  referenceID: item.ReferenceID,
  remarks: item.Remarks,
  openingBalance: item.OpeningBalance,
  closingBalance: item.ClosingBalance,
  createdAt: getDateInUTCToTimeZone(item.CreatedAt),
  // Store original data for details view
  _originalData: item
});

export const creditDebitTypeOptions = [
  { label: 'Credit', value: 'Credit', color: 'success', icon: CheckBadgeIcon },
  { label: 'Debit', value: 'Debit', color: 'error', icon: XCircleIcon }
];

export const agentTransactionTypeOptions = [
  {
    value: 'Allocation',
    label: 'Allocation',
    color: 'success'
  },
  {
    value: 'Deallocation',
    label: 'Deallocation',
    color: 'error'
  },
  {
    value: 'Commission Credit',
    label: 'Commission Credit',
    color: 'success'
  },
  {
    value: 'Commission Debit',
    label: 'Commission Debit',
    color: 'error'
  },
  {
    value: 'Manual Adjustment',
    label: 'Manual Adjustment'
    // color: 'warning'
  }
];

// Helper functions for filter conversion
export const parseCreditDebitTypeToApi = (value) => {
  if (value === null || value === undefined || value === '') return null;
  switch (value) {
    case 'Credit':
      return CREDIT_DEBIT_TYPE.CREDIT;
    case 'Debit':
      return CREDIT_DEBIT_TYPE.DEBIT;
    default:
      return null;
  }
};

export const parseTransactionTypeToApi = (value) => {
  if (value === null || value === undefined || value === '') return null;
  switch (value) {
    case 'Allocation':
      return AGENT_TRANSACTION_TYPE.ALLOCATION;
    case 'Deallocation':
      return AGENT_TRANSACTION_TYPE.DEALLOCATION;
    case 'Commission Credit':
      return AGENT_TRANSACTION_TYPE.COMMISSION_CREDIT;
    case 'Commission Debit':
      return AGENT_TRANSACTION_TYPE.COMMISSION_DEBIT;
    case 'Manual Adjustment':
      return AGENT_TRANSACTION_TYPE.MANUAL_ADJUSTMENT;
    default:
      return null;
  }
};
// For transaction status (assuming similar to player transactions)
export const agentTransactionStatusOptions = [
  { label: 'Completed', value: 'completed', icon: CheckBadgeIcon },
  { label: 'Pending', value: 'pending', icon: XCircleIcon },
  { label: 'Failed', value: 'failed', icon: XCircleIcon }
];

export const TRANSACTION_ENTITY = {
  SYSTEM: 0,
  ADMIN: 1,
  AGENT_TIER_1: 2,
  AGENT_TIER_2: 3,
  AGENT_TIER_3: 4,
  PLAYER: 5
};

// Helper function to get entity label
export const getEntityLabel = (entityType, entityData) => {
  if (!entityData && entityType === TRANSACTION_ENTITY.ADMIN) {
    return 'Admin/Operator';
  }
  if (!entityData && entityType === TRANSACTION_ENTITY.SYSTEM) {
    return 'System';
  }
  if (!entityData) {
    return 'N/A';
  }

  switch (entityType) {
    case TRANSACTION_ENTITY.ADMIN:
      return `Admin: ${entityData.Username || 'N/A'}`;
    case TRANSACTION_ENTITY.AGENT_TIER_1:
    case TRANSACTION_ENTITY.AGENT_TIER_2:
    case TRANSACTION_ENTITY.AGENT_TIER_3:
      return `Agent: ${entityData.Username || 'N/A'}`;
    case TRANSACTION_ENTITY.PLAYER:
      return `Player: ${entityData.Username || 'N/A'}`;
    case TRANSACTION_ENTITY.SYSTEM:
      return 'System';
    default:
      return 'Unknown';
  }
};

// Helper function to get entity type badge color
export const getEntityTypeBadge = (entityType) => {
  switch (entityType) {
    case TRANSACTION_ENTITY.SYSTEM:
      return 'System';
    case TRANSACTION_ENTITY.ADMIN:
      return 'Admin';
    case TRANSACTION_ENTITY.AGENT_TIER_1:
    case TRANSACTION_ENTITY.AGENT_TIER_2:
    case TRANSACTION_ENTITY.AGENT_TIER_3:
      return 'Agent';
    case TRANSACTION_ENTITY.PLAYER:
      return 'Player';
    default:
      return 'Unknown';
  }
};
