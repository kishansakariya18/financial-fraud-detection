import * as Yup from "yup";

export const playerLimitSchema = Yup.object().shape({
    dailyWagerLimit: Yup.number(),
    weeklyWagerLimit: Yup.number(),
    monthlyWagerLimit: Yup.number(),
    dailyDepositLimit: Yup.number(),
    weeklyDepositLimit: Yup.number(),
    monthlyDepositLimit: Yup.number(),
    dailyWithdrawLimit: Yup.number(),
    weeklyWithdrawLimit: Yup.number(),
    monthlyWithdrawLimit: Yup.number(),
    dailyLossLimit: Yup.number(),
    weeklyLossLimit: Yup.number(),
    monthlyLossLimit: Yup.number(),
  
    // Flags
    hasDailyWagerLimit: Yup.boolean(),
    hasWeeklyWagerLimit: Yup.boolean(),
    hasMonthlyWagerLimit: Yup.boolean(),
    hasDailyDepositLimit: Yup.boolean(),
    hasWeeklyDepositLimit: Yup.boolean(),
    hasMonthlyDepositLimit: Yup.boolean(),
    hasDailyWithdrawLimit: Yup.boolean(),
    hasWeeklyWithdrawLimit: Yup.boolean(),
    hasMonthlyWithdrawLimit: Yup.boolean(),
    hasDailyLossLimit: Yup.boolean(),
    hasWeeklyLossLimit: Yup.boolean(),
    hasMonthlyLossLimit: Yup.boolean(),
  });
  