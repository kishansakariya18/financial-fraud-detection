import apiConfig from 'configs/api.config';
import { sendRequest } from 'utils/axios';

const PaymentService = {
  deposit: async (data) => {
    try {
      const requestObject = {
        userId: data.userId,
        amount: data.amount,
        status: data.status,
        promoCode: data.promoCode || ''
      };

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.PAYMENT.DEPOSIT,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestObject
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  winning: async (data) => {
    try {
      const requestObject = {
        userId: data.userId,
        amount: data.amount,
        status: data.status,
        betId: data.betId
      };

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.PAYMENT.WINNING,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestObject
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  withdraw: async (data) => {
    try {
      const requestObject = {
        userId: data.userId,
        amount: data.amount,
        status: data.status
      };

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.PAYMENT.WITHDRAW,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestObject
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  },
  betslip: async (data) => {
    try {
      const requestObject = {
        userId: data.userId,
        amount: data.amount,
        status: data.status,
        odd: data?.odd || undefined,
        gameId: data.gameId || undefined
      };

      const response = await sendRequest({
        url: apiConfig.baseURL.API_BASE_URL + apiConfig.endPoints.PAYMENT.BETSLIP,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestObject
      });

      return response;
    } catch (err) {
      console.log('Error', err);
    }
  }
};

export default PaymentService;
