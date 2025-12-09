import { useForm } from 'react-hook-form';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { Page } from 'components/shared/Page';
import { Button, Card, Checkbox, Input } from 'components/ui';
import { Listbox } from 'components/shared/form/Listbox';
import { useEffect, useMemo, useRef, useState } from 'react';
import { roleDetailMapper, rolePermissionListMapper } from './helper';
import RoleService from 'services/role.services';
// import { useParams } from 'react-router';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

const EditRole = () => {
  const { roleId } = useParams();
  const { t } = useTranslation();

  const pageTitle = t('edit') + ' ' + t('role');
  const roleName = t('role') + ' ' + t('name');
  const update = t('update');
  //* === Get api state for Edit ===
  const [isDetailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [detail, setDetail] = useState({});
  const [response, setResponse] = useState([]);
  const fetchRoleDetail = async (roleId) => {
    setDetailLoading(true);
    const result = await RoleService.roleDetail(roleId);
    console.log('result of roles edit', result);

    if (result.status === 200) {
      const apiData = result.response.data;
      const resultData = roleDetailMapper(apiData);
      console.log('resultData::::', resultData);
      setDetail(resultData);
      setCheckedList(resultData.permissionIDs);
    } else {
      setDetailError(result.error);
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
    if (roleId) {
      fetchRoleDetail(roleId);
    }
  }, [roleId]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [checkedList, setCheckedList] = useState([]);
  const [selectAllActive, setSelectAllActive] = useState(false);
  const allPermissionIds = useMemo(() => {
    const ids = [];
    response?.forEach((mod) => {
      mod?.permissionList?.forEach((perm) => ids.push(perm.permissionID));
    });
    return Array.from(new Set(ids));
  }, [response]);

  // Flatten all permissions across modules for global dependency checks
  const allPermissions = useMemo(() => {
    const list = [];
    response?.forEach((mod) => {
      mod?.permissionList?.forEach((perm) => list.push(perm));
    });
    return list;
  }, [response]);

  // Module-wise filter (multi-select with 'All')
  const [selectedModules, setSelectedModules] = useState(['all']);
  const moduleOptions = useMemo(() => {
    const list = [{ label: 'All Modules', value: 'all' }];
    const names = new Set();
    response?.forEach((m) => {
      if (m?.moduleName && !names.has(m.moduleName)) {
        names.add(m.moduleName);
        list.push({ label: m.moduleName, value: m.moduleName });
      }
    });
    return list;
  }, [response]);

  const filteredModules = useMemo(() => {
    if (!selectedModules?.length || selectedModules.includes('all')) return response || [];
    const setSel = new Set(selectedModules);
    return (response || []).filter((m) => setSel.has(m.moduleName));
  }, [response, selectedModules]);

  const filteredPermissionIds = useMemo(() => {
    const ids = [];
    (filteredModules || []).forEach((mod) => {
      mod?.permissionList?.forEach((perm) => ids.push(perm.permissionID));
    });
    return Array.from(new Set(ids));
  }, [filteredModules]);

  const targetIdsForToggle =
    !selectedModules?.length || selectedModules.includes('all')
      ? allPermissionIds
      : filteredPermissionIds;

  const allSelected =
    targetIdsForToggle.length > 0 && targetIdsForToggle.every((id) => checkedList.includes(id));

  const handleToggleAll = () => {
    if (allSelected) {
      // Deselect only the target IDs (filtered or all), keep others
      const newCheckedList = checkedList.filter((id) => !targetIdsForToggle.includes(id));
      setSelectAllActive(false);
      setCheckedList(newCheckedList);
    } else {
      // Select: union current selection with target IDs (do not remove previous selections)
      setSelectAllActive(true);
      setCheckedList((prev) => Array.from(new Set([...(prev || []), ...targetIdsForToggle])));
    }
  };

  // If Select All is active and the FILTER target changes, make selection exactly match the target
  const prevTargetKeyRef = useRef('');
  useEffect(() => {
    if (!selectAllActive) return;
    const target =
      !selectedModules?.length || selectedModules.includes('all')
        ? allPermissionIds
        : filteredPermissionIds;
    const key = (target || []).join(',');
    if (prevTargetKeyRef.current === key) return;
    prevTargetKeyRef.current = key;
    // Add target IDs without removing existing selections
    setCheckedList((prev) => Array.from(new Set([...(prev || []), ...target])));
  }, [selectAllActive, selectedModules, filteredPermissionIds, allPermissionIds]);
  const handleCheck = (checked, permissionObj, modulePermissionList) => {
    console.log('handleCheck', checked, permissionObj, modulePermissionList);

    let newCheckedList = [...checkedList];
    // Manual toggle cancels sticky Select All
    if (selectAllActive) setSelectAllActive(false);

    if (!checked) {
      // Cascading deselect: remove this permission and any dependents globally
      const toRemove = new Set([permissionObj.permissionID]);

      const collectDependents = (slug) => {
        allPermissions
          .filter(
            (perm) =>
              Array.isArray(perm.requiredPermissions) && perm.requiredPermissions.includes(slug)
          )
          .forEach((child) => {
            if (!toRemove.has(child.permissionID)) {
              toRemove.add(child.permissionID);
              if (child.permissionSlug) collectDependents(child.permissionSlug);
            }
          });
      };

      if (permissionObj.permissionSlug) collectDependents(permissionObj.permissionSlug);

      newCheckedList = newCheckedList.filter((id) => !toRemove.has(id));
    } else {
      const idsToAdd = [permissionObj.permissionID];

      // Auto-select required permissions (parents) based on RequiredPermissions (slug list)
      if (permissionObj.requiredPermissions && permissionObj.requiredPermissions.length > 0) {
        permissionObj.requiredPermissions.forEach((requiredSlug) => {
          const requiredPermission = allPermissions.find(
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
    formState: { errors }
  } = useForm({
    defaultValues: {
      roleName: detail.roleName
    }
  });

  useEffect(() => {
    if (detail?.roleName) {
      reset({
        roleName: detail.roleName
      });
    }
  }, [detail, reset]);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    data.permissionsIdList = checkedList;
    data.roleId = roleId;
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
      invert: true
    });
    setSubmitError(null);
  }
  if (!isSubmitLoading && !submitError && submitResponse) {
    toast.success(submitResponse.message, {
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
  const breadcrumbItem = [{ title: t('roles'), path: '/roles' }, { title: t('edit') }];

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
                  {
                    <div className="max-w-sm">
                      <Input
                        id="roleName"
                        className={`form-control ${errors.roleName ? 'is-invalid' : ''}`}
                        defaultValue={detail.roleName}
                        type="text"
                        name="roleName"
                        label={roleName}
                        placeholder="Enter Role Name"
                        {...register('roleName', {
                          required: 'Role name is required'
                        })}
                        error={errors?.roleName?.message}
                      />
                    </div>
                  }
                  <div className="flex flex-col">
                    <div>
                      <div className="mb-4">
                        <Checkbox
                          label={
                            allSelected ? 'Deselect all permissions' : 'Select all permissions'
                          }
                          checked={allSelected}
                          onChange={handleToggleAll}
                        />
                      </div>
                      <div className="mb-4 max-w-md">
                        <Listbox
                          data={moduleOptions}
                          multiple
                          value={
                            Array.isArray(selectedModules)
                              ? moduleOptions.filter((opt) => selectedModules.includes(opt.value))
                              : []
                          }
                          onChange={(vals) => {
                            const values = (vals || []).map((v) => v.value);
                            setSelectedModules((prev) => {
                              if (!values.length) return ['all'];

                              const prevSet = new Set(prev || []);
                              const newSet = new Set(values);
                              const added = values.filter((v) => !prevSet.has(v));

                              // If user explicitly selected 'All' now, keep only 'All'
                              if (added.includes('all')) return ['all'];

                              // If previously 'All' was selected and user added specifics, remove 'All'
                              if (prevSet.has('all') && added.length > 0) {
                                return values.filter((v) => v !== 'all');
                              }

                              // Safety: if both present without clear action, drop 'all'
                              if (newSet.has('all') && values.length > 1) {
                                return values.filter((v) => v !== 'all');
                              }

                              return values;
                            });
                          }}
                          placeholder={'Filter by module(s)'}
                          displayField="label"
                        />
                      </div>
                      {filteredModules?.length > 0 &&
                        filteredModules?.map((item) => (
                          <>
                            <div key={item.moduleName} className="mb-4 grid"></div>
                            <div className="flex items-center gap-3">
                              <div className="w-1/4">
                                <h4 className="font-bold">{item.moduleName}</h4>
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
                                      checkedList?.includes(permissionObj.permissionID)
                                        ? 'primary'
                                        : ''
                                    }
                                    variant="outlined"
                                    onClick={() =>
                                      handleCheck(
                                        !checkedList?.includes(permissionObj.permissionID),
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
              </Card>
            </div>
          </div>
        </form>
        <div className="flex !flex-row-reverse flex-col items-center space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <div className="flex gap-2">
            <Button className="min-w-[7rem]" color="primary" type="submit" form="add-role-form">
              {update}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default EditRole;
