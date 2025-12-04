import { getDateInUTCToTimeZone } from 'helpers/functions';

export const listResponseMapper = (apiResponse) => {
  const dataArr = apiResponse?.data || apiResponse?.Data || [];
  return dataArr.map((item) => ({
    id: item?.EnquiryUID,
    subject: item?.Subject || '-',
    description: item?.Description || '-',
    email: item?.Email || '-',
    status: statusToAPP(item?.Status),
    createdAt: item?.DateCreated ? getDateInUTCToTimeZone(item?.DateCreated) : undefined
  }));
};

export const statusToAPP = (status) => {
  return status;
};

export const enquiresStatusOptions = [
  {
    value: 'NEW',
    label: 'New',
    color: 'info'
  },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress',
    color: 'warning'
  },
  {
    value: 'RESOLVED',
    label: 'Resolved',
    color: 'success'
  }
];

export const enquiresSubjectOptions = [
  {
    value: 'Technical Support',
    label: 'Technical Support',
    color: 'primary'
  },
  {
    value: 'Feedback',
    label: 'Feedback',
    color: 'info'
  },
  {
    value: 'Payment Issue',
    label: 'Payment Issue',
    color: 'danger'
  },
  {
    value: 'Account Issues',
    label: 'Account Issues',
    color: 'warning'
  },
  {
    value: 'General Inquiry',
    label: 'General Inquiry',
    color: 'success'
  }
];
