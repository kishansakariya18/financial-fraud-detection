import apiConfig from '../configs/api.config';
import { replaceText } from 'utils/custom.utilities';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import apiInstance from 'utils/apiInstance';
import moment from 'moment';

const BlogService = {
  getBlogList: async (data) => {
    const { pagination, filters } = data || {};

    const parseNumber = (value) => {
      if (value === undefined || value === null || value === '') {
        return undefined;
      }
      const parsed = Number(value);
      return Number.isNaN(parsed) ? undefined : parsed;
    };

    const formatDate = (value, type = 'start') => {
      const numericValue = parseNumber(value);
      if (numericValue === undefined) {
        return undefined;
      }

      const parsed = moment(numericValue);
      if (parsed.isValid()) {
        if (type === 'start') {
          return parsed.startOf('day');
        } else if (type === 'end') {
          return parsed.endOf('day');
        } else {
          return parsed;
        }
      }
      return undefined;
    };

    const apiQueryParams = {
      keyword: filters?.keyword || undefined,
      categoryId: parseNumber(filters?.blogCategoryId),
      isFeatured: parseNumber(filters?.isFeatured),
      authorName: filters?.authorName || undefined,
      isActive: parseNumber(filters?.isActive),
      startDate: formatDate(filters?.startDate, 'start'),
      endDate: formatDate(filters?.endDate, 'end'),
      page: pagination?.pageIndex !== undefined ? pagination.pageIndex + 1 : 1,
      perPage: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD
    };

    // Remove undefined values
    Object.keys(apiQueryParams).forEach((key) => {
      if (apiQueryParams[key] === undefined) {
        delete apiQueryParams[key];
      }
    });

    return apiInstance.get(apiConfig.endPoints.BLOG.LIST, {
      params: apiQueryParams
    });
  },

  createBlog: (data, file) => {
    const formData = new FormData();

    if (data.title) {
      formData.append('title', data.title);
    }
    if (data.slug) {
      formData.append('slug', data.slug);
    }
    if (data.content) {
      formData.append('content', data.content);
    }
    if (data.blogCategoryId !== undefined && data.blogCategoryId !== null) {
      formData.append('blogCategoryId', data.blogCategoryId);
    }
    if (data.shortDescription) {
      formData.append('shortDescription', data.shortDescription);
    }
    if (data.metaTitle) {
      formData.append('metaTitle', data.metaTitle);
    }
    if (data.metaDescription) {
      formData.append('metaDescription', data.metaDescription);
    }
    if (data.authorName) {
      formData.append('authorName', data.authorName);
    }
    if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
      data.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
    }
    if (data.isFeatured !== undefined) {
      formData.append('isFeatured', data.isFeatured);
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', data.isActive);
    }
    if (file && file.name) {
      formData.append('image', file, file.name);
    }

    return apiInstance.post(apiConfig.endPoints.BLOG.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  editBlog: (blogId, data, file) => {
    const formData = new FormData();

    if (data.title !== undefined) {
      formData.append('title', data.title);
    }
    if (data.slug !== undefined) {
      formData.append('slug', data.slug);
    }
    if (data.content !== undefined) {
      formData.append('content', data.content);
    }
    if (data.blogCategoryId !== undefined) {
      formData.append('blogCategoryId', data.blogCategoryId);
    }
    if (data.shortDescription !== undefined) {
      formData.append('shortDescription', data.shortDescription);
    }
    if (data.metaTitle !== undefined) {
      formData.append('metaTitle', data.metaTitle);
    }
    if (data.metaDescription !== undefined) {
      formData.append('metaDescription', data.metaDescription);
    }
    if (data.authorName !== undefined) {
      formData.append('authorName', data.authorName);
    }
    if (data.tags !== undefined) {
      if (Array.isArray(data.tags) && data.tags.length > 0) {
        data.tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
      }
    }
    if (data.isFeatured !== undefined) {
      formData.append('isFeatured', data.isFeatured);
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', data.isActive);
    }
    if (file && file.name) {
      formData.append('image', file, file.name);
    }

    const endPoint = replaceText(apiConfig.endPoints.BLOG.EDIT, ':blogId', blogId);
    return apiInstance.put(endPoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  deleteBlog: async (blogId) => {
    const endPoint = replaceText(apiConfig.endPoints.BLOG.DELETE, ':blogId', blogId);
    return apiInstance.delete(endPoint);
  },

  getBlogDetails: async (slug) => {
    const endPoint = replaceText(apiConfig.endPoints.BLOG.DETAIL, ':slug', slug);
    return apiInstance.get(endPoint);
  },

  changeBlogStatus: (blogId) => {
    const endPoint = replaceText(apiConfig.endPoints.BLOG.CHANGE_STATUS, ':blogId', blogId);
    return apiInstance.patch(endPoint);
  }
};

export default BlogService;
