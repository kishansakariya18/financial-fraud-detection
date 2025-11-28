import apiConfig from '../configs/api.config';
import { replaceText } from 'utils/custom.utilities';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import apiInstance from 'utils/apiInstance';
import moment from 'moment';

const BlogCategoryService = {
  getBlogCategoryList: (data) => {
    const { pagination, filters } = data || {};
    console.log('filters', filters);

    const apiQueryParams = {
      keyword: filters?.keyword || undefined,
      isActive:
        filters?.isActive !== undefined && filters?.isActive !== '' ? filters.isActive : undefined,
      page: pagination?.pageIndex !== undefined ? pagination.pageIndex + 1 : 1,
      perPage: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD
    };
    if (filters?.startDate && filters?.endDate) {
      apiQueryParams.startDate = moment(+filters.startDate).startOf('day').toDate();
      apiQueryParams.endDate = moment(+filters.endDate).endOf('day').toDate();
    }
    console.log(apiQueryParams);

    // Remove undefined values
    Object.keys(apiQueryParams).forEach((key) => {
      if (apiQueryParams[key] === undefined) {
        delete apiQueryParams[key];
      }
    });

    return apiInstance.get(apiConfig.endPoints.BLOG_CATEGORY.LIST, {
      params: apiQueryParams
    });
  },

  createBlogCategory: (data, file) => {
    const formData = new FormData();
    if (data.name) {
      formData.append('name', data.name);
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', data.isActive);
    }
    if (file && file.name) {
      formData.append('image', file, file.name);
    }

    return apiInstance.post(apiConfig.endPoints.BLOG_CATEGORY.CREATE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  editBlogCategory: (categoryId, data, file) => {
    const endPoint = replaceText(apiConfig.endPoints.BLOG_CATEGORY.EDIT, ':categoryId', categoryId);

    const formData = new FormData();
    if (data.name !== undefined) {
      formData.append('name', data.name);
    }
    if (data.isActive !== undefined) {
      formData.append('isActive', data.isActive);
    }
    if (file && file.name) {
      formData.append('image', file, file.name);
    }
    return apiInstance.put(endPoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  deleteBlogCategory: (categoryId) => {
    const endPoint = replaceText(
      apiConfig.endPoints.BLOG_CATEGORY.DELETE,
      ':categoryId',
      categoryId
    );

    return apiInstance.delete(endPoint);
  },

  getBlogCategoryDetails: (categoryId) => {
    const endPoint = replaceText(
      apiConfig.endPoints.BLOG_CATEGORY.DETAIL,
      ':categoryId',
      categoryId
    );
    return apiInstance.get(endPoint);
  },

  changeBlogCategoryStatus: (categoryId) => {
    const endPoint = replaceText(
      apiConfig.endPoints.BLOG_CATEGORY.CHANGE_STATUS,
      ':categoryId',
      categoryId
    );
    return apiInstance.patch(endPoint);
  }
};

export default BlogCategoryService;
