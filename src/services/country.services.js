import { parseAdminStatusToApi } from "app/pages/country/helper";
import apiConfig from "configs/api.config";
import { sendRequest } from "utils/axios";
import { replaceText } from "utils/custom.utilities";

const CountryService = {
  getCountry: async ({ pagination, filters }) => {
    try {
      const endPoint = apiConfig.endPoints.COUNTRY.LIST;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        params: {
            perPage: pagination.pageSize,
            page: pagination.pageIndex + 1
        },
        body: {
            filters: {
                 keyword: filters.keyword ? filters.keyword : undefined,
                 status: filters.status ? parseAdminStatusToApi(filters.status): undefined,
            }
        }
      });
      return response;
    } catch (error) {
      console.log("Error from Country List", error);
    }
  },
  updateCountryStatus: async (countryId) => {
    try {

      const endPoint = replaceText(apiConfig.endPoints.COUNTRY.CHANGE_STATUS, ':countryId', countryId) ;
      const apiURL = apiConfig.baseURL.API_BASE_URL + endPoint;
      const response = await sendRequest({
        url: apiURL,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },

      });
      return response;
    } catch (error) {
      console.log("Error from Country Update Status", error);
    }
  },
};

export default CountryService;
