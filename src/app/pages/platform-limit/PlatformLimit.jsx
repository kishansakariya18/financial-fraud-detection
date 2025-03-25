// Import Dependencies
import { Page } from "components/shared/Page";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button, Checkbox, Input } from "components/ui";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Breadcrumbs } from "components/shared/Breadcrumbs";
import PlatformLimitService from "services/platform.services";
import { updatePlatformLimitSchema } from "./schema";
import { useTranslation } from "react-i18next";

const PlatformLimit = () => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(null);

  const breadcrumbItem = [
    { title: "Platform", path: "/platform-limit" },
    { title: "Limit" },
  ];

  const pageTitle = t("platform") + " " + t("limit");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(updatePlatformLimitSchema),
  });

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchPlatformLimit();
      if (result) {
        reset({
          oneTimeBetLimit: result?.BetLimit?.Value || "",
          oneTimeWinLimit: result?.WinLimit?.Value || "",
          dailyDepositLimit: result?.MaxDepositPerDay?.Value || "",
          dailyWithdrawLimit: result?.MaxWithdrawPerDay?.Value || "",
          isCheckCaladerTime: +result?.CheckCalanderTime?.Value,
        });
      }
    };

    loadData();
  }, [reset]);

  const updatePlatformLimit = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result =
      await PlatformLimitService.updatePlatformLimit(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const fetchPlatformLimit = async () => {
    setError(null);
    const result = await PlatformLimitService.getPlatoformLimit();
    if (result) {
      if (result.status === 200 || result.status === 201) {
        const details = result.response.data;
        return details;
      } else {
        setError(result.error);
      }
    }
  };

  if (!loading && error) {
    toast.error(error);
    setError("");
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    setResponse(null);
    fetchPlatformLimit();
  }

  const onSubmit = async (data) => {
    await updatePlatformLimit(data);
  };

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {pageTitle}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register("dailyDepositLimit")}
                label={t("dailyDepositLimit")}
                type="number"
                error={errors?.dailyDepositLimit?.message}
                placeholder="Enter Daily Deposit Limit"
              />
              <Input
                {...register("dailyWithdrawLimit")}
                label={t("dailyWithdrawLimit")}
                type="number"
                error={errors?.dailyWithdrawLimit?.message}
                placeholder="Enter Daily Withdraw Limit"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register("oneTimeBetLimit")}
                label={t("oneTimeBetLimit")}
                type="number"
                error={errors?.oneTimeBetLimit?.message}
                placeholder="Enter Bet Limit"
              />
              <Input
                {...register("oneTimeWinLimit")}
                label={t("oneTimeWinLimit")}
                type="number"
                error={errors?.oneTimeWinLimit?.message}
                placeholder="Enter Win Limit"
              />
            </div>

            <div className="ml-1 grid gap-4 lg:grid-cols-2">
              <Checkbox
                label={t("checkCalenderTime")}
                {...register("isCheckCaladerTime")}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button
              className="min-w-[7rem]"
              onClick={() => reset()}
              disabled={loading}
            >
              {t("reset")}
            </Button>
            <Button
              type="submit"
              className="min-w-[7rem]"
              color="primary"
              disabled={loading}
            >
              {t("update")}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default PlatformLimit;
