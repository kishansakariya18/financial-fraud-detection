// Local Imports
import { Box, Button, GhostSpinner, Input, Switch } from "components/ui";
import { Page } from "components/shared/Page";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useParams } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import PlayerService from "services/player.services";
import { ContextualHelp } from "components/shared/ContextualHelp";
import { playerLimitSchema } from "./schema";
import { Listbox } from "components/shared/form/Listbox";
import { DatePicker } from "components/shared/form/Datepicker";
import { getDateInUTCToTimeZone } from "helpers/functions";

// ----------------------------------------------------------------------

const breadcrumbs = [{ title: "Players", path: "/player" }, { title: "Limit" }];
const exclusionTimeOptions = [
  { label: "1 day", value: "1" },
  { label: "7 day", value: "2" },
  { label: "1 month", value: "3" },
  { label: "6 month", value: "4" },
  { label: "12 month", value: "5" },
  { label: "custom", value: "6" },
  { label: "permanent", value: "7" },
];

const PlayerLimit = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { playerId } = useParams();
  const [exclusionType, setExclusionType] = useState("");

  // const breadcrumbItem = [
  //   { title: "Admin", path: "/admin" },
  //   { title: "Edit" },
  // ];
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(playerLimitSchema),
  });

  useEffect(() => {
    if (playerId) {
      console.log("called: first useEffect");

      fetchUserDetails().then((result) => {
        if (result) {
          reset({
            dailyWagerLimit: result.BetDailyWageLimit,
            weeklyWagerLimit: result.BetWeeklyWageLimit,
            monthlyWagerLimit: result.BetMonthlyWageLimit,
            dailyDepositLimit: result.MaxDepositPerMonth,
            weeklyDepositLimit: result.MaxDepositPerWeek,
            monthlyDepositLimit: result.MaxDepositPerMonth,
            dailyWithdrawLimit: result.MaxWithdrawPerDay,
            weeklyWithdrawLimit: result.MaxWithdrawPerWeek,
            monthlyWithdrawLimit: result.MaxWithdrawPerMonth,
            dailyLossLimit: result.DailyLossLimit,
            weeklyLossLimit: result.WeeklyLossLimit,
            monthlyLossLimit: result.MonthlyLossLimit,
            selfExclusionType: result.ExclusionType,
            exclusionStartAt: getDateInUTCToTimeZone(
              result.ExclusionStartAt,
              "Asia/Kolkata",
              "YYYY-MM-DD HH:mm",
            ),
            exclusionEndAt: getDateInUTCToTimeZone(
              result.ExclusionEndAt,
              "Asia/Kolkata",
              "YYYY-MM-DD HH:mm",
            ),

            // Flags
            hasDailyWagerLimit: result.HasDailyBetWageLimit,
            hasWeeklyWagerLimit: result.HasWeeklyBetWageLimit,
            hasMonthlyWagerLimit: result.HasMonthlyBetWageLimit,
            hasDailyDepositLimit: result.HasMaxDepositPerDayLimit,
            hasWeeklyDepositLimit: result.HasMaxDepositPerWeekLimit,
            hasMonthlyDepositLimit: result.HasMaxDepositPerMonthLimit,
            hasDailyWithdrawLimit: result.HasMaxWithdrawPerDayLimit,
            hasWeeklyWithdrawLimit: result.HasMaxWithdrawPerWeekLimit,
            hasMonthlyWithdrawLimit: result.HasMaxWithdrawPerMonthLimit,
            hasDailyLossLimit: result.HasDailyLossLimit,
            hasWeeklyLossLimit: result.HasWeeklyLossLimit,
            hasMonthlyLossLimit: result.HasMonthlyLossLimit,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId, reset]);

  const fetchUserDetails = async () => {
    const result = await PlayerService.userDetail(playerId);

    if (result && result.status === 200) {
      const details = result.response.data;
      return details;
    } else {
      return null;
    }
  };

  const updatePlayerLimit = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await PlayerService.updateRiskManagementFields(
      requestObject,
      playerId,
    );
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  if (!loading && error) {
    toast.error(error);
    setError("");
  }

  useEffect(() => {
    if (!loading && !error && response) {
      toast.success(response.message);
      setResponse(null);
      fetchUserDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handlePlayerLimitUpdate = async (data) => {
    await updatePlayerLimit(data);
  };

  const handleChangeExclusionType = (field, val) => {
    field.onChange(val.value);
    setExclusionType(val.value);
  };

  return (
    <Page title="Box">
      {loading && <GhostSpinner />}
      <div className="transition-content w-full px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            Player Limit
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbs} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(handlePlayerLimitUpdate)}>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {/* Simple Box */}
            <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
              <div className="mt-1.5 flex items-center justify-between">
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  Daily Wager Limit
                </h2>
                <Switch {...register("hasDailyWagerLimit")} label="" />
              </div>
              <div className="pt-2">
                <div className="max-w-xl">
                  <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                    <Input
                      id="dailyWagerLimit"
                      {...register("dailyWagerLimit")}
                      error={errors?.dailyWagerLimit?.message}
                      placeholder="Enter Daily Wager Limit"
                      classNames={{
                        root: "flex-1",
                        input: "relative rounded-none hover:z-1 focus:z-1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Box>
            <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
              <div className="mt-1.5 flex items-center justify-between">
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  Weekly Wager Limit
                </h2>

                <Switch {...register("hasWeeklyWagerLimit")} label="" />
              </div>
              <div className="pt-2">
                <div className="max-w-xl">
                  <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                    <Input
                      {...register("weeklyWagerLimit")}
                      error={errors?.weeklyWagerLimit?.message}
                      id="weeklyWagerLimit"
                      placeholder="Enter Weekly Wager Limit"
                      classNames={{
                        root: "flex-1",
                        input: "relative rounded-none hover:z-1 focus:z-1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Box>
            <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
              <div className="mt-1.5 flex items-center justify-between">
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  Monthly Wager Limit
                </h2>

                <Switch {...register("hasMonthlyWagerLimit")} label="" />
              </div>
              <div className="pt-2">
                <div className="max-w-xl">
                  <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                    <Input
                      {...register("monthlyWagerLimit")}
                      error={errors?.monthlyWagerLimit?.message}
                      id="monthlyWagerLimit"
                      placeholder="Enter Monthly Wager Limit"
                      classNames={{
                        root: "flex-1",
                        input: "relative rounded-none hover:z-1 focus:z-1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Box>
            <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
              <div className="mt-1.5 flex items-center justify-between">
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  Daily Deposit Limit
                </h2>
                <Switch {...register("hasDailyDepositLimit")} label="" />
              </div>
              <div className="pt-2">
                <div className="max-w-xl">
                  <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                    <Input
                      {...register("dailyDepositLimit")}
                      error={errors?.dailyDepositLimit?.message}
                      id="dailyDepositLimit"
                      placeholder="Enter Daily Deposit Limit"
                      classNames={{
                        root: "flex-1",
                        input: "relative rounded-none hover:z-1 focus:z-1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Box>
            <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
              <div className="mt-1.5 flex items-center justify-between">
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  Weekly Deposit Limit
                </h2>
                <Switch {...register("hasWeeklyDepositLimit")} label="" />
              </div>
              <div className="pt-2">
                <div className="max-w-xl">
                  <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                    <Input
                      {...register("weeklyDepositLimit")}
                      error={errors?.weeklyDepositLimit?.message}
                      id="weeklyDepositLimit"
                      placeholder="Enter Weekly Deposit Limit"
                      classNames={{
                        root: "flex-1",
                        input: "relative rounded-none hover:z-1 focus:z-1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Box>
            <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
              <div className="mt-1.5 flex items-center justify-between">
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  Monthly Deposit Limit
                </h2>
                <Switch {...register("hasMonthlyDepositLimit")} label="" />
              </div>
              <div className="pt-2">
                <div className="max-w-xl">
                  <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                    <Input
                      {...register("monthlyDepositLimit")}
                      error={errors?.monthlyDepositLimit?.message}
                      id="monthlyDepositLimit"
                      placeholder="Enter Monthly Deposit Limit"
                      classNames={{
                        root: "flex-1",
                        input: "relative rounded-none hover:z-1 focus:z-1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Box>
            <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
              <div className="mt-1.5 flex items-center justify-between">
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  Daily Withdraw Limit
                </h2>
                <Switch {...register("hasDailyWithdrawLimit")} label="" />
              </div>
              <div className="pt-2">
                <div className="max-w-xl">
                  <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                    <Input
                      {...register("dailyWithdrawLimit")}
                      error={errors?.dailyWithdrawLimit?.message}
                      id="dailyWithdrawLimit"
                      placeholder="Enter Daily Withdraw Limit"
                      classNames={{
                        root: "flex-1",
                        input: "relative rounded-none hover:z-1 focus:z-1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Box>
            <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
              <div className="mt-1.5 flex items-center justify-between">
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  Weekly Withdraw Limit
                </h2>
                <Switch {...register("hasWeeklyWithdrawLimit")} label="" />
              </div>
              <div className="pt-2">
                <div className="max-w-xl">
                  <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                    <Input
                      {...register("weeklyWithdrawLimit")}
                      error={errors?.weeklyWithdrawLimit?.message}
                      id="weeklyWithdrawLimit"
                      placeholder="Enter Weekly Withdraw Limit"
                      classNames={{
                        root: "flex-1",
                        input: "relative rounded-none hover:z-1 focus:z-1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Box>
            <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
              <div className="mt-1.5 flex items-center justify-between">
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  Monthly Withdraw Limit
                </h2>
                <Switch {...register("hasMonthlyWithdrawLimit")} label="" />
              </div>
              <div className="pt-2">
                <div className="max-w-xl">
                  <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                    <Input
                      {...register("monthlyWithdrawLimit")}
                      error={errors?.monthlyWithdrawLimit?.message}
                      id="monthlyWithdrawLimit"
                      placeholder="Enter Monthly Withdraw Limit"
                      classNames={{
                        root: "flex-1",
                        input: "relative rounded-none hover:z-1 focus:z-1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Box>

            <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
              <div className="mt-1.5 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                    Daily Loss Limit
                  </h2>
                  <ContextualHelp
                    title="What is a Contextual help ?"
                    content={
                      <p>
                        Contextual help shows a user extra information about the
                        state of an adjacent component, or a total view.
                      </p>
                    }
                  />
                </div>
                <Switch {...register("hasDailyLossLimit")} label="" />
              </div>
              <div className="pt-2">
                <div className="max-w-xl">
                  <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                    <Input
                      {...register("dailyLossLimit")}
                      error={errors?.dailyLossLimit?.message}
                      id="dailyLossLimit"
                      placeholder="Enter Daily Loss Limit"
                      classNames={{
                        root: "flex-1",
                        input: "relative rounded-none hover:z-1 focus:z-1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Box>
            <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
              <div className="mt-1.5 flex items-center justify-between">
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  Weekly Loss Limit
                </h2>
                <Switch {...register("hasWeeklyLossLimit")} label="" />
              </div>
              <div className="pt-2">
                <div className="max-w-xl">
                  <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                    <Input
                      {...register("weeklyLossLimit")}
                      error={errors?.weeklyLossLimit?.message}
                      id="weeklyLossLimit"
                      placeholder="Enter Weekly Loss Limit"
                      classNames={{
                        root: "flex-1",
                        input: "relative rounded-none hover:z-1 focus:z-1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Box>
            <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
              <div className="mt-1.5 flex items-center justify-between">
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  Monthly Loss Limit
                </h2>
                <Switch {...register("hasMonthlyLossLimit")} label="" />
              </div>
              <div className="pt-2">
                <div className="max-w-xl">
                  <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                    <Input
                      {...register("monthlyLossLimit")}
                      error={errors?.monthlyLossLimit?.message}
                      id="monthlyLossLimit"
                      placeholder="Enter Monthly Loss Limit"
                      classNames={{
                        root: "flex-1",
                        input: "relative rounded-none hover:z-1 focus:z-1",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Box>
            <Box className="rounded-lg bg-white px-4 py-4 shadow-soft dark:bg-dark-700 dark:shadow-none sm:px-5">
              <div>
                <h2 className="line-clamp-1 text-lg font-medium tracking-wide text-gray-800 dark:text-dark-100">
                  Self Exclusion Time
                </h2>
              </div>
              <div className="pt-2">
                <div className="max-w-xl">
                  <div className="mt-1.5 flex -space-x-px rtl:space-x-reverse">
                    <Controller
                      render={({ field }) => (
                        <Listbox
                          data={exclusionTimeOptions}
                          value={
                            exclusionTimeOptions.find(
                              (exclusionTime) =>
                                +exclusionTime.value === +field.value,
                            ) || null
                          }
                          onChange={(val) =>
                            handleChangeExclusionType(field, val)
                          }
                          name={field.name}
                          placeholder="Select Self Exclusion Type"
                          displayField="label"
                          error={errors?.selfExclusionType?.message}
                        />
                      )}
                      control={control}
                      name="selfExclusionType"
                    />
                  </div>

                  <div>
                    {+exclusionType === 6 && (
                      <div className="flex flex-wrap gap-2 pt-1.5">
                        <Controller
                          render={({ field: { onChange, value, ...rest } }) => (
                            <DatePicker
                              onChange={onChange}
                              value={value || ""}
                              label="Exclusion Start At"
                              error={errors?.exclusionStartAt?.message}
                              options={{
                                disableMobile: true,
                                enableTime: true,
                                time_24hr: true,
                              }}
                              placeholder="Choose date..."
                              {...rest}
                            />
                          )}
                          control={control}
                          name="exclusionStartAt"
                        />
                        <Controller
                          render={({ field: { onChange, value, ...rest } }) => (
                            <DatePicker
                              onChange={onChange}
                              value={value || ""}
                              label="Exclusion End At"
                              error={errors?.exclusionEndAt?.message}
                              options={{
                                disableMobile: true,
                                enableTime: true,
                                time_24hr: true,
                              }}
                              placeholder="Choose date..."
                              {...rest}
                            />
                          )}
                          control={control}
                          name="exclusionEndAt"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Box>
          </div>
          {/* <div className="mt-1.5 flex items-center justify-center">
            <Button type="submit" color="primary" disabled={loading}>
              Update
            </Button>
          </div> */}

          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button
              className="min-w-[7rem]"
              onClick={() => reset()}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="min-w-[7rem]"
              color="primary"
              disabled={loading}
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default PlayerLimit;
