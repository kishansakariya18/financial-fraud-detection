// Import Dependencies
// import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";

// Local Imports
import { Button, Card, GhostSpinner } from "components/ui";
// import { useKYCFormContext } from "../KYCFormContext";
// import { declarationSchema } from "../schema";
import AdminService from "services/admin.services";
import { useParams } from "react-router";
import { Page } from "components/shared/Page";
import { parseAdminStatusToApp } from "./helper";
import { getDateInUTCToTimeZone } from "helpers/functions";


export function ViewDetails({ setCurrentStep }) {
  //   const kycFormCtx = useKYCFormContext();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const { adminId } = useParams();

  const fetchAdminDetails = async () => {
    setLoading(true);
    const result = await AdminService.getAdminDetail(adminId);

    if (result.status === 200) {
      const apiData = result.response.data;
      setResponse(apiData);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminId]);

  return (
    <Page title="Admin Details">
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <h2 className="py-5 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:py-6 lg:text-2xl">
          Admin Details
        </h2>

        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          <Card className="h-full p-4 sm:p-5">
            <h5 className="text-lg font-medium text-gray-800 dark:text-dark-100">
              {"Details"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-dark-200">
              {"Details Regarding Admin"}
            </p>

            <h6 className="mt-8 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
              Personal Information:
            </h6>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  User Name:
                </p>
                <p>{response?.Username}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  First Name:
                </p>
                <p>{response?.FirstName}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  Last Name:
                </p>
                <p>{response?.LastName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  Email:
                </p>
                <p>{response?.Email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  Phone:
                </p>
                <p>
                  {response?.dialCode || "+91"} {response?.Mobile}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  Status:
                </p>
                <p>
                  {+response.Status >= 0 &&
                    parseAdminStatusToApp(+response?.Status)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  Created At:
                </p>
                <p>{getDateInUTCToTimeZone(response?.DateCreated)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                  Role:
                </p>
                <p>{response?.Role}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
              <Button
                className="min-w-[7rem]"
                onClick={() => setCurrentStep(2)}
              >
                Back
              </Button>
              {loading && <GhostSpinner className="size-4 border-2" />}
              {error && <p>{error}</p>}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
