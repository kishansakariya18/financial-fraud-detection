import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const ToolsService = {
  getToolDetail: async (ip) => {
    try {
      const url = `${apiConfig.baseURL.API_BASE_URL}${apiConfig.endPoints.TOOLS.DETAIL}`;
      const response = await sendRequest({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: { ip }
      });
      return response;
    } catch (err) {
      console.log('Error', err);
    }
  }
};

export default ToolsService;
