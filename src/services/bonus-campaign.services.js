import { parseCampaignStatusToApi } from 'app/pages/bonus-campaign/helper';
import { discountTypeToAPI, segmentationTypeToAPI } from 'app/pages/promocode/helper';
import apiConfig from 'configs/api.config';
import dayjs from 'dayjs';
import { getEndOfDate, getStartofDate } from 'helpers/functions';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const PromoCodeService = {
  getBonusCampaigns: async (body) => {
    try {
      const { pagination, filters } = body;

      const apiQueryParams = {
        per_page: pagination.pageSize,
        page: pagination.pageIndex + 1
      };

      const apiRequestParams = {
        ...(filters.status && { status: parseCampaignStatusToApi(filters.status) }),
        ...(filters.keyword && { keyword: filters.keyword }),
        start_date: filters.startDate
          ? dayjs(+filters.startDate).format('YYYY-MM-DD HH:mm:ss')
          : undefined,
        end_date: filters.endDate
          ? dayjs(+filters.endDate).format('YYYY-MM-DD HH:mm:ss')
          : undefined
      };

      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.BONUS_CAMPAIGN.LIST}`,
        method: 'POST',
        params: apiQueryParams,
        headers: {
          'Content-Type': 'application/json'
        },
        body: { filters: apiRequestParams }
      });

      return response;
    } catch (error) {
      console.error('Error fetching bonus campaigns:', error);
      throw error;
    }
  },
  getBonusCampaignDetails: async (id) => {
    try {
      const response = await sendRequest({
        url: replaceText(
          `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.BONUS_CAMPAIGN.DETAIL}`,
          ':id',
          id
        ),
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching bonus campaign details:', error);
      throw error;
    }
  },
  createBonusCampaign: async (data, file) => {
    try {
      const formData = new FormData();
      data.campaignName && formData.append('CampaignName', data.campaignName);
      data.campaignCode && formData.append('CampaignCode', data.campaignCode);
      data.titleMessage && formData.append('TitleMessage', data.titleMessage);
      data.shortMessage && formData.append('ShortMessage', data.shortMessage);
      data.campaignType && formData.append('CampaignType', data.campaignType);
      data.discountType && formData.append('BonusType', discountTypeToAPI(data.discountType));
      data.segmentationType &&
        formData.append('SegmentationType', segmentationTypeToAPI(data.segmentationType));
      data.segmentationId && formData.append('SegmentationID', data.segmentationId);
      data.isKYCRequired !== undefined && formData.append('IsKYCRequired', data.isKYCRequired);
      data.discount && formData.append('BonusValue', data.discount);
      data.bonusQuantity && formData.append('TotalMaxRedemptions', data.bonusQuantity);
      data.allowedPerUser != undefined &&
        formData.append('MaxRedemptionsPerUser', data.allowedPerUser);
      data.description && formData.append('Description', data.description);
      data.claimSettlement && formData.append('ClaimMethod', data.claimSettlement);
      data.maxBonusAmount && formData.append('MaxBonusAmount', data.maxBonusAmount);
      data.minDepositAmount && formData.append('MinDepositAmount', data.minDepositAmount);
      data.bonusExpiryDays && formData.append('BonusExpiryDays', data.bonusExpiryDays);
      data.cashoutMultiplier && formData.append('CashoutMultiplier', data.cashoutMultiplier);
      data.wageringRequirement &&
        formData.append('WageringRequirementType', data.wageringRequirement);
      data.wageringMultiplier && formData.append('WageringMultiplier', data.wageringMultiplier);

      data.startDate && formData.append('StartDate', getStartofDate(+data.startDate));
      data.endDate && formData.append('EndDate', getEndOfDate(+data.endDate));

      if (data.eligibleCurrencies.length) {
        for (let i = 0; i < data.eligibleCurrencies.length; i++) {
          formData.append(`EligibleCurrencies[${i}]`, data.eligibleCurrencies[i]);
        }
      }

      if (file && file.name) {
        formData.append('CampaignImage', file, file.name);
      }

      let apiURL = null;
      apiURL = `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.BONUS_CAMPAIGN.CREATE}`;

      if (apiURL) {
        const response = await sendRequest({
          url: apiURL,
          method: 'POST',
          body: formData,
          contentType: 'form-data',
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        return response;
      }

      return null;
    } catch (err) {
      console.log('Error', err);
    }
  },
  updateBonusCampaignStatus: async (id) => {
    try {
      const response = await sendRequest({
        url: replaceText(
          `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.BONUS_CAMPAIGN.CHANGE_STATUS}`,
          ':id',
          id
        ),
        method: 'PATCH'
      });
      return response;
    } catch (error) {
      console.error('Error updating campaign status:', error);
      throw error;
    }
  },
  getBonusGrants: async (body) => {
    try {
      const { bonusCampaignId, pagination } = body;

      const apiQueryParams = {
        per_page: pagination.pageSize,
        page: pagination.pageIndex + 1
      };
      const endPoint = replaceText(
        apiConfig.endPoints.BONUS_CAMPAIGN.HISTORY,
        ':id',
        bonusCampaignId
      );

      let apiURL = null;

      apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;

      if (apiURL) {
        const response = await sendRequest({
          url: apiURL,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          params: apiQueryParams
        });

        return response;
      }

      return null;
    } catch (err) {
      console.log('Error', err);
    }
  },
  getBonusCampaignSummary: async () => {
    try {
      const response = await sendRequest({
        url: `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.BONUS_CAMPAIGN.SUMMARY}`,
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error fetching bonus campaign summary:', error);
      throw error;
    }
  }
};

export default PromoCodeService;
