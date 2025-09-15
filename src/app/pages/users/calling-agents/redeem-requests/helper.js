import { getDateInUTCToTimeZone } from 'helpers/functions';

export const responseMapper = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((item) => ({
    id: item.CallingAgentRedeemRequestID || item.id,
    agentInfo: item.callingAgent
      ? {
          id: item.callingAgent.AdminID,
          username: item.callingAgent.Username,
          firstName: item.callingAgent.FirstName,
          lastName: item.callingAgent.LastName,
          email: item.callingAgent.Email
        }
      : null,
    requestedAmount: item.RequestedAmount || 0,
    approvedAmount: item.ApprovedAmount || null,
    status: item.Status || 'pending',
    remarks: item.Remarks || '',
    requestedAt: item.RequestedAt ? getDateInUTCToTimeZone(item.RequestedAt) : '',
    approvedAt: item.ApprovedAt ? getDateInUTCToTimeZone(item.ApprovedAt) : null,
    approvedBy: item.ApprovedBy || null,
    // Additional fields that might be useful
    callingAgentId: item.CallingAgentID,
    commissionPeriodStart: item.CommissionPeriodStart
      ? getDateInUTCToTimeZone(item.CommissionPeriodStart)
      : null,
    commissionPeriodEnd: item.CommissionPeriodEnd
      ? getDateInUTCToTimeZone(item.CommissionPeriodEnd)
      : null,
    totalCommission: item.TotalCommission || 0,
    availableBalance: item.AvailableBalance || 0
  }));
};
