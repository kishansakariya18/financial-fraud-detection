import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';

// Local Imports
import { bankColumns } from './columns';
import { bankResponseMapper } from './helper';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import UserClassService from 'services/user-class.services';
import { BankFilters } from './BankFilters';
import { Button, Circlebar } from 'components/ui';

export default function AssignedBanks() {
  const { t } = useTranslation();
  const { id: userClassId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('assign_bank');
  const [checked, setChecked] = useState([]);

  const handleCheck = (id) => {
    console.log('Checkbox clicked with ID:', id);
    setChecked((prev) => {
      const newChecked = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      console.log('Updated checked list:', newChecked);
      return newChecked;
    });
  };

  const columns = bankColumns({ selectedIds: checked, handleCheck, actionLabel: 'unassign' });
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchAssignedBanks = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    const result = await UserClassService.getMappedBanks(userClassId, {
      pagination: { pageIndex, pageSize },
      filters: queryParams
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: bankResponseMapper(result.response.data), // Use the response mapper
        totalRecords: parseInt(result.response.total_record, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: columns,
    fetchData: fetchAssignedBanks,
    queryParams,
    setSearchParams,
    enableRowSelection: true,
    getRowId: (row) => row.id
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
  }, [error, isLoading, setError]);

  useEffect(() => {
    const filtersFromQuery = [];
    if (queryParams.keyword) {
      filtersFromQuery.push({ id: 'BankName', value: queryParams.keyword });
    }
    setColumnFilters(filtersFromQuery);
  }, [queryParams, setColumnFilters]);

  const applyFilterHandler = () => {
    const filterItems = {};
    for (let data of table.getState().columnFilters) {
      if (data.id === 'BankName') {
        filterItems.keyword = data.value;
      }
    }
    setSearchParams({
      ...queryParams,
      pageIndex: 0,
      pageSize: 10,
      ...(filterItems.keyword && { keyword: filterItems.keyword })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({
        pageIndex: 0,
        pageSize: 10
      });
    }
    table.resetColumnFilters();
  };

  const [submitLoading, setSubmitLoading] = useState(false);

  const handleUnassign = async () => {
    setSubmitLoading(true);
    const result = await UserClassService.unmapBank(userClassId, checked);
    if (result.status === 200 || result.status === 201) {
      toast.success(result.response.message);
      table.options.meta?.fetchNewList();
      setChecked([]);
    } else {
      toast.error(result.response.message || 'Failed to unassign banks');
    }
    setSubmitLoading(false);
  };

  const breadcrumbItem = [{ title: t('user_class'), path: '/user-class' }, { title: pageTitle }];

  return (
    <ContentWrapper pageTitle={pageTitle}>
      <BankFilters
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        breadcrumbItem={breadcrumbItem}
        isAssignBank={true}
      />

      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />

      <div className="mt-4 flex justify-center">
        <Button
          type="button"
          color="primary"
          disabled={checked.length === 0 || submitLoading}
          onClick={handleUnassign}>
          {submitLoading ? <Circlebar size={6} /> : t('unassign')}
        </Button>
      </div>
    </ContentWrapper>
  );
}
