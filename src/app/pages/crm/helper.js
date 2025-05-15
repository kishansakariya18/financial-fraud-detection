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
    const defaultOption = { label: 'No options available', value: '' };
    options = [defaultOption];
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
