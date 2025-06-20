import { parseAdminStatusToApi } from 'app/pages/country/helper';
import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';
import { replaceText } from 'utils/custom.utilities';

const CountryService = {
  getCountry: async ({ pagination, filters }) => {
    try {
      const endPoint = apiConfig.endPoints.GEORESTRICTION.COUNTRY_LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          filters: {
            keyword: filters.keyword ? filters.keyword : '',
            status: filters.status ? parseAdminStatusToApi(filters.status) : 1
          }
        }
      });
      return response;
    } catch (error) {
      console.log('Error from Country List', error);
    }
  },
  updateCountryStatus: async (countryId) => {
    try {
      const endPoint = replaceText(
        apiConfig.endPoints.COUNTRY.CHANGE_STATUS,
        ':countryId',
        countryId
      );
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from Country Update Status', error);
    }
  },
  getCountrySummary: async () => {
    try {
      const endPoint = apiConfig.endPoints.COUNTRY.SUMMARY;

      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.log('Error from getCountrySummary', error);
    }
  }
};

export default CountryService;
