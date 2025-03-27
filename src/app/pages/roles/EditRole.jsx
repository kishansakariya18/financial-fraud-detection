import { useForm } from "react-hook-form";
import {
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { Page } from "components/shared/Page";
import { Button, Card, Input } from "components/ui";
import { useEffect, useState } from "react";
import { roleDetailMapper, rolePermissionListMapper } from "./helper";
import RoleService from "services/role.services";
import { useParams } from "react-router";

const EditRole = () => {
  const { rolePermissionId } = useParams();
  const { t } = useTranslation();

  const pageTitle = (t('edit') + ' ' + t('role'));
  const roleName = (t('role') + ' ' + t('name'));
  const update = t('update');
  //* === Get api state for Edit ===
  const [isDetailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [detail, setDetail] = useState({});
  const fetchRoleDetail = async (rolePermissionId) => {
    setDetailLoading(true);
    const result = await RoleService.roleDetail(rolePermissionId);
    if (result) {
      if (result.status === 200) {
        const apiData = result.response.data;
        const resultData = roleDetailMapper(apiData);
        console.log('resultData', resultData);
        setDetail(resultData);
        setCheckedList(resultData.permissionIDs);
      } else {
        setDetailError(result.error);
      }
    }
    setDetailLoading(false);
  };

  // TODO: remove below code and implement loader
  if (!isDetailLoading && detailError) {
    // toast.error(detailError, config.TOAST_UI);
    setDetailError(null);
  }
  if (!isDetailLoading && !detailError && detail) {
    // toast.success(detail.message, config.TOAST_UI);
  }
  useEffect(() => {
      if (rolePermissionId) {
      fetchRoleDetail(rolePermissionId);
    }
    }, [rolePermissionId]);

  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [checkedList, setCheckedList] = useState([]);
  const handleCheck = (checked, permissionObj, modulePermissionList) => {
    console.log('handleCheck', checked, permissionObj, modulePermissionList);
    
    if (permissionObj.permissionName == "View") {
      const modulePermissionIds = modulePermissionList.map(
        (item) => item.permissionID,
      );
      if (!checked) {
        modulePermissionIds.forEach((id) => {
          const foundIndex = checkedList.findIndex((item) => item == id);
          if (foundIndex != -1) {
            // console.log('found index::', id);
            checkedList.splice(foundIndex, 1);
            // console.log('new checklist:', checkedList);
          }
        });
        setCheckedList([...checkedList]);
      } else {
        // console.log('modulePermissionIds:', modulePermissionIds);
        setCheckedList([...checkedList, ...modulePermissionIds]);
      }
    } else {
      const viewId = modulePermissionList.find(
        (item) => item.permissionName == "View",
      );
      if (viewId && !checkedList.includes(viewId.permissionID)) {
        setCheckedList([
          ...checkedList,
          viewId.permissionID,
          permissionObj.permissionID,
        ]);
      } else {
        setCheckedList([...checkedList, permissionObj.permissionID]);
      }
      if (!checked) {
        setCheckedList(
          checkedList.filter(
            (checkedId) => checkedId !== permissionObj.permissionID,
          ),
        );
      }
    }
  };

  console.log('checkedList: ', checkedList);
  

  console.log("response: ", response);
  console.log("isLoading: ", isLoading);
  console.log("error: ", error);

  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitResponse, setSubmitResponse] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    data.permissionsIdList = checkedList;
    data.rolePermissionID = rolePermissionId;
    console.log('data::', data);

    setSubmitLoading(true);
    const result = await RoleService.roleEdit(data);

    if (result) {
      if (result.status === 200 || result.status === 201) {
        setSubmitResponse(result.response);
      } else {
        setSubmitError(result.error);
      }
    } else {
      setSubmitError(result.error);
    }
    setSubmitLoading(false);
  };

  if (!isSubmitLoading && submitError) {
    toast(submitError, {
        invert: true,
      });
    setSubmitError(null);
  }
  if (!isSubmitLoading && !submitError && submitResponse) {
    toast("Role created successfully", {
        invert: true,
      });
    setSubmitResponse(null)
    reset();
  }

  const fetchRolePermissionList = async () => {
    setIsLoading(true);
    const result = await RoleService.rolePermissionList();

    if (result.status === 200) {
      const apiData = result.response.data;
      const resultData = rolePermissionListMapper(apiData);
      setResponse(resultData);
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  console.log("response:", response);

  useEffect(() => {
    console.log("Component mounted or remounted!");
    fetchRolePermissionList();
  }, []);

  return (
    <Page title={pageTitle}>
      <div className="transition-content px-[--margin-x] pb-6">
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex items-center gap-1">
            <DocumentPlusIcon className="size-6" />
            <h2 className="line-clamp-1 text-xl font-medium text-gray-700 dark:text-dark-50">
              {pageTitle}
            </h2>
          </div>
        </div>
        <form
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}
          id="add-role-form"
        >
          <div className="grid grid-cols-12 place-content-start gap-4 sm:gap-5 lg:gap-6">
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="mt-5 space-y-5">
                {(
                  <Input
                    id="roleName"
                    className={`form-control ${errors.roleName ? 'is-invalid' : ''}`}
                    defaultValue={rolePermissionId ? detail.roleName : ''}
                    type="text"
                    name="roleName"
                    label={roleName}
                    placeholder="Enter Role Name"
                    {...register('roleName', {
                        required: 'Role name is required'
                      })}
                    error={errors?.roleName?.message}
                  />
                )}
                  <div className="flex flex-col">
                    <div>
                      {response?.length > 0 &&
                        response?.map((item) => (
                          <>
                            <div
                              key={item.moduleName}
                              className="mb-4 grid"
                            ></div>
                            <div className="flex items-center gap-3">
                              <div className="w-1/4">
                                <h4>
                                  {item.moduleName}
                                </h4>
                                <p className="text-sm text-gray-400">
                                  Access control for {item.moduleName}
                                </p>
                              </div>
                              <div className="w-3/4 flex flex-wrap">
                                {item?.permissionList.map((permissionObj) => (
                                  <Button
                                    type="button"
                                    key={permissionObj.permissionID}
                                    className={`mr-2 my-2`}
                                    color={checkedList?.includes(permissionObj.permissionID) ? "primary" : ""}
                                    variant='outlined'
                                    onClick={() =>
                                      handleCheck(
                                        !checkedList?.includes(
                                          permissionObj.permissionID,
                                        ),
                                        permissionObj,
                                        item?.permissionList,
                                      )
                                    }
                                  >
                                    {permissionObj.permissionName}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </form>
        <div className="flex flex-col !flex-row-reverse items-center space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex gap-2">
            <Button
              className="min-w-[7rem]"
              color="primary"
              type="submit"
              form="add-role-form"
            >
              {update}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default EditRole;
