import * as Yup from "yup";

export const updatePlatformLimitSchema = Yup.object().shape({
    dailyDepositLimit: Yup.number("Value must be a number")
      .transform((val) => (isNaN(val) ? null : val))
      .positive("Daily Deposit Limit Must Be Positive")
      .required("Daily Deposit Limit Required"),
    dailyWithdrawLimit: Yup.number("Value must be a number")
      .transform((val) => (isNaN(val) ? null : val))
      .positive("Daily Withdraw Limit Must Be Positive")
      .required("Daily Withdraw Limit Required"),
    oneTimeBetLimit: Yup.number("Value must be a number")
      .transform((val) => (isNaN(val) ? null : val))
      .positive("One Time Bet Limit Must Be Positive")
      .required("One Time Bet Limit Required"),
    oneTimeWinLimit: Yup.number("Value must be a number")
      .transform((val) => (isNaN(val) ? null : val))
      .positive("One Time Win Limit Must Be Positive")
      .required("One Time Win Limit Required"),
    isCheckCalenderTime: Yup.boolean()
  });
