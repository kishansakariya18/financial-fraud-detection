// Import Dependencies

// Local Imports
import { Page } from "components/shared/Page";

import { UserIcon } from "@heroicons/react/20/solid";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
// Local Imports
import { Listbox } from "components/shared/form/Listbox";
import { Button, Checkbox, GhostSpinner, Input } from "components/ui";
import { createAdminSchema } from "./schema";
import { CiMobile1 } from "react-icons/ci";
import AdminService from "services/admin.services";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const adminStatus = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
];

const CreateAdmin = () => {

    console.log('create admin')
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(createAdminSchema),
  });

  const fetchRoles = async () => {
    setIsLoading(true)
    const result = await AdminService.getAdminRole();

    if ( result && result.status === 200) {
      const roles = result.response.data;

      const roleList = roles.map((role) => {
        return {
          value: role.RoleID,
          label: role.RoleName,
        };
      });

      setRoles(roleList);
    } else {
        setError('err')
    }

    setIsLoading(false)
  }

  const createAdminAPI = async (requestObject) => {
    setIsLoading(true);
    setError(null);
    const result = await AdminService.createAdmin(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (!isLoading && error) {
    toast.error(error);
    setError("");
  }

  if (!isLoading && !error && response) {
    toast.success(response.message);
    setTimeout(() => {
      navigate("/admin");
    }, 0);

    setResponse(null);
  }

  const onSubmit = async (data) => {
    console.log('data: ', data)
    await createAdminAPI(data);
  };
  return (
    <Page title="Create Admin">
        {isLoading && <GhostSpinner className="size-4 border-2" />}
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <h2 className="py-5 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:py-6 lg:text-2xl">
          Create Admin Form
        </h2>

        {/* form for create */}

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register("userName")}
                prefix={<UserIcon className="size-5" />}
                label="User Name"
                error={errors?.userName?.message}
                placeholder="Enter User Name"
              />
              <Input
                {...register("firstName")}
                prefix={<UserIcon className="size-5" />}
                label="First Name"
                error={errors?.firstName?.message}
                placeholder="Enter First Name"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                {...register("lastName")}
                prefix={<UserIcon className="size-5" />}
                label="Last Name"
                error={errors?.lastName?.message}
                placeholder="Enter Last Name"
              />
              <Input
                {...register("email")}
                prefix={<EnvelopeIcon className="size-5" />}
                label="Enter Email"
                error={errors?.email?.message}
                placeholder="Enter Email Address"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={roles}
                    value={
                      roles.find((role) => role.value === field.value) || null
                    }
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label="Roles"
                    placeholder="Select Roles"
                    displayField="label"
                    error={errors?.roles?.message}
                  />
                )}
                control={control}
                name="roles"
              />

              <Input
                {...register("password")}
                prefix={
                  <LockClosedIcon
                    className="size-5 transition-colors duration-200"
                    strokeWidth="1"
                  />
                }
                label="Enter Password"
                error={errors?.password?.message}
                placeholder="Enter Password"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    data={adminStatus}
                    value={
                      adminStatus.find(
                        (status) => status.value === field.value,
                      ) || null
                    }
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label="Status"
                    placeholder="Select Status"
                    displayField="label"
                    error={errors?.status?.message}
                  />
                )}
                control={control}
                name="status"
              />

              <Input
                {...register("mobile")}
                prefix={<CiMobile1 className="size-5" />}
                label="Enter Mobile"
                error={errors?.mobile?.message}
                placeholder="Enter Mobile Number"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Checkbox label="Is Master Admin?" {...register("isMasterAdmin")} />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button className="min-w-[7rem]" onClick={() => reset()}>
              Reset
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default CreateAdmin;
