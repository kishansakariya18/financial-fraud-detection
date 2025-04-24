import { getDateInUTCToTimeZone } from "helpers/functions";

export const translator = (t, text, ns) => t(`${text}`, { ns });

export const emailTemplateDetailResponseMapper = (apiData) => {
  return {
    emailTemplateId: apiData?.EmailTemplateID,
    title: apiData?.Title,
    slug: apiData?.Slug,
    heading: apiData?.Heading,
    template: apiData?.Template,
    to: apiData?.ToEmail,
    cc: apiData?.CC,
    bcc: apiData?.BCC,
    status: statusApiToApp(apiData?.Status),
    dateCreated: getDateInUTCToTimeZone(apiData?.DateCreated),
    dateModified: getDateInUTCToTimeZone(apiData?.DateModified)
  };
};

export const statusApiToApp = (status) => {
  if (status == 0) {
    return 'In Active';
  } else if (status == 1) {
    return 'Active';
  }
};