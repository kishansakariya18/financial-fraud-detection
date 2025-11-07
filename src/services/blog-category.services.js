import apiConfig from '../configs/api.config';
import { replaceText } from 'utils/custom.utilities';
import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import apiInstance from 'utils/apiInstance';

const BlogCategoryService = {
  getBlogCategoryList: (data) => {
    const { pagination, filters } = data || {};

    const apiQueryParams = {
      keyword: filters?.keyword || undefined,
      isActive:
        filters?.isActive !== undefined && filters?.isActive !== '' ? filters.isActive : undefined,
      page: pagination?.pageIndex !== undefined ? pagination.pageIndex + 1 : 1,
      perPage: pagination?.pageSize || DEFAULT_PER_PAGE_RECORD
    };

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

  createBlogCategory: (data) => {
    return apiInstance.post(apiConfig.endPoints.BLOG_CATEGORY.CREATE, data);
  },

  editBlogCategory: (categoryId, data) => {
    const endPoint = replaceText(apiConfig.endPoints.BLOG_CATEGORY.EDIT, ':categoryId', categoryId);

    return apiInstance.put(endPoint, data);
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
