import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { getDateInUTCToTimeZone } from '../../../helpers/functions';

export const parseBlogStatusToApp = (status) => (status === 1 ? 'active' : 'inactive');

export const parseBlogStatusToApi = (status) => {
  let apiStatus = null;
  if (status === 'inactive') {
    apiStatus = 0;
  } else if (status === 'active') {
    apiStatus = 1;
  }
  return apiStatus;
};

export const responseMapper = (apiData) => {
  const resultData = apiData.map((data) => {
    let tags = [];
    try {
      if (typeof data.Tags === 'string') {
        tags = JSON.parse(data.Tags);
      } else if (Array.isArray(data.Tags)) {
        tags = data.Tags;
      }
    } catch {
      tags = [];
    }

    return {
      id: data.BlogID,
      blogId: data.BlogID,
      title: data.Title,
      slug: data.Slug,
      shortDescription: data.ShortDescription,
      content: data.Content,
      imageName: data.ImageName,
      blogCategoryId: data.BlogCategoryID,
      categoryName: data.category?.Name || '',
      metaTitle: data.MetaTitle,
      metaDescription: data.MetaDescription,
      authorName: data.AuthorName,
      tags: tags,
      isFeatured: data.IsFeatured === 1,
      isActive: data.IsActive === 1,
      status: parseBlogStatusToApp(data.IsActive),
      viewCount: data.ViewCount || 0,
      createdAt: getDateInUTCToTimeZone(data.DateCreated),
      updatedAt: getDateInUTCToTimeZone(data.DateModified)
    };
  });
  return resultData;
};

export const statusOptions = [
  {
    value: 'active',
    label: 'Active',
    color: 'success',
    icon: CheckBadgeIcon
  },
  {
    value: 'inactive',
    label: 'Inactive',
    color: 'error',
    icon: XCircleIcon
  }
];

export const featuredOptions = [
  {
    value: true,
    label: 'Yes',
    color: 'success',
    apiValue: 1
  },
  {
    value: false,
    label: 'No',
    color: 'default',
    apiValue: 0
  }
];
