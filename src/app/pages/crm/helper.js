import { CheckBadgeIcon } from '@heroicons/react/24/outline';
// import { getDateInUTCToTimeZone } from 'helpers/functions';

// export const emailtemplateListResponseMapper = (apiData) => {
//   const totalRecords = apiData?.total_record;
//   const list = apiData?.data?.map((item) => {
//     return {
//       id: item?.EmailTemplateID,
//       title: item?.Title,
//       slug: item?.Slug,
//       heading: item?.Subject,
//       template: item?.Template,
//       status: emailTemplateStatusToAPP(item?.IsActive),
//       createdAt: getDateInUTCToTimeZone(item?.DateCreated),
//       dateModified: getDateInUTCToTimeZone(item?.DateModified)
//     };
//   });
//   return { list, totalRecords };
// };
// export const emailtemplateDetailResponseMapper = (apiData) => {
//   return {
//     emailTemplateID: apiData?.EmailTemplateID,
//     title: apiData?.Title,
//     slug: apiData?.Slug,
//     heading: apiData?.Subject,
//     template: apiData?.Template,
//     to: apiData?.ToEmail,
//     cc: apiData?.CC,
//     bcc: apiData?.BCC,
//     status: emailTemplateStatusToAPP(apiData?.IsActive),
//     dateCreated: getDateInUTCToTimeZone(apiData?.DateCreated),
//     dateModified: getDateInUTCToTimeZone(apiData?.DateModified)
//   };
// };
// export const emailTemplateStatusToAPP = (status) => {
//   if (status == 0) {
//     return 'inactive';
//   } else if (status == 1) {
//     return 'active';
//   }
// };
// export const emailTemplateStatusToAPI = (status) => {
//   if (status == 'inactive') {
//     return 0;
//   } else if (status == 'active') {
//     return 1;
//   }
// };

export const mapUserClassOptions = (apiData) => {
  let options = [];
  if (apiData.length > 0) {
    options = apiData.map((data) => ({
      key: data.UserClassID,
      value: data.UserClassID,
      label: data.ClassName || 'User Class ' + data.UserClassID,
      color: 'success',
      icon: CheckBadgeIcon
    }));
  } else {
    const defaultops = { label: 'No options available', value: '' };
    options = [defaultops];
  }
  return options;
};

export const mapSegmentationOptions = (apiData) => {
  let options = [];
  if (apiData.length > 0) {
    options = apiData.map((data) => ({
      key: data.UserSegmentID,
      value: data.UserSegmentID,
      label: data.Name || 'Segmentation ' + data.UserSegmentID,
      color: 'success',
      icon: CheckBadgeIcon
    }));
  } else {
    const defaultops = { label: 'No options available', value: '' };
    options = [defaultops];
  }
  return options;
};

export const sendOptions = [
  {
    key: 'email',
    value: 'email',
    label: 'Electronic Mail (Email)',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    key: 'sms',
    value: 'sms',
    label: 'Short Message Service (SMS)',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    key: 'push',
    value: 'push',
    label: 'Push Notification',
    color: 'success',
    icon: CheckBadgeIcon
  }
];
export const parseNotificationStatusToApp = (status) => {
  switch (+status) {
    case 1:
      return 'success';
    case 2:
      return 'failure';
    case 0:
      return 'pending';
    default:
      break;
  }
};
export const parseNotificationStatusToApi = (status) => {
  switch (status) {
    case 'success':
      return 1;
    case 'failure':
      return 2;
    case 'pending':
      return 0;
    default:
      return -1; // or null, depending on how you want to handle invalid input
  }
};
//(1=Normal, 2=Scheduled)
export const parseTypeToApp = (status) => {
  switch (status) {
    case 1:
      return 'Normal';
    case 2:
      return 'Scheduled';
    default:
      return -1; // or null, depending on how you want to handle invalid input
  }
};
export const parseTypeToApi = (status) => {
  switch (status) {
    case 'normal':
      return 1;
    case 'scheduled':
      return 2;
    default:
      return -1; // or null, depending on how you want to handle invalid input
  }
};

// Options for Type filter (Normal / Scheduled)
export const typeOptions = [
  {
    key: 'normal',
    value: 'normal',
    label: 'Normal',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    key: 'scheduled',
    value: 'scheduled',
    label: 'Scheduled',
    color: 'success',
    icon: CheckBadgeIcon
  }
];
export const statusOptions = [
  {
    value: 'pending',
    label: 'Pending',
    color: 'warning'
  },
  {
    value: 'success',
    label: 'Success',
    color: 'success'
  },
  {
    value: 'failure',
    label: 'Failure',
    color: 'error'
  }
];
