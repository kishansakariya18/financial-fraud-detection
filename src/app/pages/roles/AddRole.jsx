import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Page } from 'components/shared/Page';
import { Button, Card, Input } from 'components/ui';
import { useEffect, useState } from 'react';
import { rolePermissionListMapper } from './helper';
import RoleService from 'services/role.services';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { addRoleSchema } from './schema';

const AddRole = () => {
  const { t } = useTranslation();

  const pageTitle = t('add') + ' ' + t('role');
  const roleName = t('role') + ' ' + t('name');
  const save = t('save');
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [checkedList, setCheckedList] = useState([]);
  const handleCheck = (checked, permissionObj, modulePermissionList) => {
    let newCheckedList = [...checkedList];

    if (!checked) {
      // Unselect only this permission ID
      newCheckedList = newCheckedList.filter(
        (checkedId) => checkedId !== permissionObj.permissionID
      );
    } else {
      const idsToAdd = [permissionObj.permissionID];

      // Auto-select dependent permissions based on RequiredPermissions (slug list)
      if (permissionObj.requiredPermissions && permissionObj.requiredPermissions.length > 0) {
        permissionObj.requiredPermissions.forEach((requiredSlug) => {
          const requiredPermission = modulePermissionList.find(
            (perm) => perm.permissionSlug === requiredSlug
          );
          if (requiredPermission) {
            idsToAdd.push(requiredPermission.permissionID);
          }
        });
      }

      newCheckedList = [...newCheckedList, ...idsToAdd];
    }

    // Remove duplicates
    newCheckedList = Array.from(new Set(newCheckedList));
    setCheckedList(newCheckedList);
    setValue('permissionsIdList', newCheckedList, { shouldValidate: true });
    trigger('permissionsIdList');
  };

  console.log('checkedList: ', checkedList);

  console.log('response: ', response);
  console.log('isLoading: ', isLoading);
  console.log('error: ', error);

  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitResponse, setSubmitResponse] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    trigger
  } = useForm({
    resolver: yupResolver(addRoleSchema)
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    data.permissionsIdList = checkedList;
    console.log('data::', data);

    setSubmitLoading(true);
    const result = await RoleService.roleSubmit(data);

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
      invert: true
    });
    setSubmitError(null);
  }
  if (!isSubmitLoading && !submitError && submitResponse) {
    toast.success('Role created successfully', {
      invert: true
    });
    setTimeout(() => {
      navigate('/roles');
    }, 0);
    setSubmitResponse(null);
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

  console.log('response:', response);

  useEffect(() => {
    console.log('Component mounted or remounted!');
    fetchRolePermissionList();
  }, []);
  const breadcrumbItem = [{ title: t('roles'), path: '/roles' }, { title: t('add') }];
  return (
    <Page title={pageTitle}>
      <div className="transition-content px-[--margin-x] pb-6">
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex items-center gap-1">
            <DocumentPlusIcon className="size-6" />
            <h2 className="line-clamp-1 text-xl font-medium text-gray-700 dark:text-dark-50">
              {pageTitle}
            </h2>
            <div className="ml-4 flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
              <div className="hidden self-stretch py-1 sm:flex">
                <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
              </div>
              <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
            </div>
          </div>
        </div>
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} id="add-role-form">
          <div className="grid grid-cols-12 place-content-start gap-4 sm:gap-5 lg:gap-6">
            <div className="col-span-12">
              <Card className="p-4 sm:px-5">
                <div className="mt-5 space-y-5">
                  <Input
                    id="roleName"
                    className={`form-control ${errors.roleName ? 'is-invalid' : ''}`}
                    type="text"
                    name="roleName"
                    label={roleName}
                    placeholder="Enter Role Name"
                    {...register('roleName', {
                      required: 'Role name is required'
                    })}
                    error={errors?.roleName?.message}
                  />
                  <div className="flex flex-col">
                    <div>
                      {response?.length > 0 &&
                        response?.map((item) => (
                          <>
                            <div key={item.moduleName} className="mb-4 grid"></div>
                            <div className="flex items-center gap-3">
                              <div className="w-1/4">
                                <h4>{item.moduleName}</h4>
                                <p className="text-sm text-gray-400">
                                  Access control for {item.moduleName}
                                </p>
                              </div>
                              <div className="flex w-3/4 flex-wrap">
                                {item?.permissionList.map((permissionObj) => (
                                  <Button
                                    type="button"
                                    key={permissionObj.permissionID}
                                    className={`my-2 mr-2`}
                                    color={
                                      checkedList.includes(permissionObj.permissionID)
                                        ? 'primary'
                                        : ''
                                    }
                                    variant="outlined"
                                    onClick={() =>
                                      handleCheck(
                                        !checkedList.includes(permissionObj.permissionID),
                                        permissionObj,
                                        item?.permissionList
                                      )
                                    }>
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
                {errors?.permissionsIdList && (
                  <p className="mt-2 text-sm text-error">{errors.permissionsIdList.message}</p>
                )}
              </Card>
            </div>
          </div>
        </form>
        <div className="flex !flex-row-reverse items-center space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex gap-2">
            <Button className="min-w-[7rem]" color="primary" type="submit" form="add-role-form">
              {save}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default AddRole;
