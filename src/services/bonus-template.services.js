import apiConfig from 'configs/api.config';
import { replaceText } from 'utils/custom.utilities';
import apiInstance from 'utils/apiInstance';
import { buildBonusTemplateQueryParams } from 'app/pages/bonus-template/happer';
import { objectToFormData } from 'utils/formData';

const BonusTemplateService = {
  getTemplates: async ({ pagination = {}, filters = {} } = {}) => {
    const queryParams = buildBonusTemplateQueryParams({ pagination, filters });
    return await apiInstance.get(apiConfig.endPoints.BONUS_TEMPLATE.LIST, { params: queryParams });
  },

  getTemplateById: async (templateId) => {
    const endpoint = replaceText(
      apiConfig.endPoints.BONUS_TEMPLATE.DETAIL,
      ':bonusTemplateID',
      templateId
    );
    return apiInstance.get(endpoint);
  },

  getTagList: async (filters = {}) => {
    return await apiInstance.get(apiConfig.endPoints.BONUS_TEMPLATE.LIST_TAGS, { params: filters });
  },

  createTemplate: async (formState) => {
    const formData = objectToFormData(formState);
    console.log('formData: ', formData);
    return apiInstance.post(apiConfig.endPoints.BONUS_TEMPLATE.CREATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  duplicateTemplate: async (templateId) => {
    const endpoint = replaceText(
      apiConfig.endPoints.BONUS_TEMPLATE.DUPLICATE,
      ':bonusTemplateID',
      templateId
    );
    return apiInstance.post(endpoint);
  },

  updateTemplateStatus: async (templateId) => {
    const endpoint = replaceText(
      apiConfig.endPoints.BONUS_TEMPLATE.UPDATE_STATUS,
      ':bonusTemplateID',
      templateId
    );
    return apiInstance.patch(endpoint);
  },

  updateTemplate: async (templateId, formState) => {
    const formData = objectToFormData(formState);
    const endpoint = replaceText(
      apiConfig.endPoints.BONUS_TEMPLATE.UPDATE,
      ':bonusTemplateID',
      templateId
    );

    return apiInstance.put(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  deleteTemplate: async (templateId) => {
    const endpoint = replaceText(
      apiConfig.endPoints.BONUS_TEMPLATE.DELETE,
      ':bonusTemplateID',
      templateId
    );

    return apiInstance.delete(endpoint);
  },

  // getDenominations: async (gameId) => {
  getDenominations: async () => {
    return apiInstance.get(apiConfig.endPoints.BONUS_TEMPLATE.DENOMINATION, {
      params: { gameId: 1 }
    });
  }
};

export default BonusTemplateService;
