export const bankResponseMapper = (apiData) => {
  if (!apiData) return [];
  const resultData = apiData.map((data) => ({
    id: data.DepositBankAccountID,
    DepositBankAccountID: data.DepositBankAccountID,
    BankName: data.BankName,
    AccountHolderName: data.AccountHolderName,
    AccountNumber: data.AccountNumber,
    BankCode: data.BankCode,
    UPIID: data.UPIID,
    AdditionalInfo: data.AdditionalInfo,
    IsActive: data.IsActive,
    CreatedByAdminID: data.CreatedByAdminID
  }));
  return resultData;
};
