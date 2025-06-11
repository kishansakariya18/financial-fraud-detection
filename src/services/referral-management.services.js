import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const ReferralOfferService = {
  referralOfferList: async () => {
    try {
      const endPoint = apiConfig.endPoints.REFERRAL_OFFER.LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from Page List', error);
    }
  },
  referralOfferUpdate: async (data) => {
    try {
      const endPoint = apiConfig.endPoints.REFERRAL_OFFER.UPDATE;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          offerData: data
        }
      });
      return response;
    } catch (error) {
      console.log('Error from Page List', error);
    }
  }
};

export default ReferralOfferService;
