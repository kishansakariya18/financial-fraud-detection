export const walletListResponseMapper = (apiData) => {
  const resultData = apiData.map((data) => ({
    id: data.WalletID,
    tenantUID: data.UserID,
    username: data.Username,
    firstname: data.CurrencyID,
    lastname: data.Balance,
    mobile: data.Bonus,
    dataModified: data.DateModified,
    code: data.Currency.Code,
    name: data.Currency.Name
  }));
  return resultData;
};
