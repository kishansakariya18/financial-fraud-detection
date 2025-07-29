import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams, useSearchParams } from 'react-router';

// Local Imports
import { bankColumns } from './columns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import UserClassService from 'services/user-class.services';
import { BankFilters } from './BankFilters';
import { Button, Circlebar } from 'components/ui';

export default function BankList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: userClassId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('bank') + ' ' + t('list');
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchAllBanks = async () => {
    console.log(queryParams);
    const pageIndex = isNaN(queryParams.pageIndex) ? 0 : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? 10 : +queryParams.pageSize;
    const result = await UserClassService.getUnmappedBanks(userClassId, {
      pagination: { pageIndex, pageSize },
      filters: queryParams,
      keyword: queryParams.keyword
    });

    if (result.status === 200) {
      return {
        status: 200,
        data: result.response.data, // Assuming API returns correct format
        totalRecords: parseInt(result.response.total_record, 10) || 0
      };
    }

    return { status: result.status, error: result.error };
  };

  const [checked, setChecked] = useState([]);

  const handleCheck = (id) => {
    console.log('Checkbox clicked with ID:', id);
    setChecked((prev) => {
      const newChecked = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      console.log('Updated checked list:', newChecked);
      return newChecked;
    });
  };

  // Debug: Log the current checked state when it changes
  useEffect(() => {
    console.log('Current checked state:', checked);
  }, [checked]);

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: bankColumns({ selectedIds: checked, handleCheck }),
    fetchData: fetchAllBanks,
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

  const handleAssign = async () => {
    setSubmitLoading(true);
    const result = await UserClassService.mapBank(userClassId, {
      depositBankAccountID: checked
    });
    if (result.status === 200 || result.status == 201) {
      toast.success(result.response.message);
      navigate(`/user-class/${userClassId}/assign-bank`);
    } else {
      toast.error(result.error || 'Failed to assign banks');
    }
    setSubmitLoading(false);
  };

  const breadcrumbItem = [
    { title: t('userClass'), path: '/user-class' },
    { title: t('assign_bank'), path: `/user-class/${userClassId}/assign-bank` },
    { title: pageTitle }
  ];

  return (
    <ContentWrapper pageTitle={pageTitle}>
      <BankFilters
        pageTitle={pageTitle}
        table={table}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        breadcrumbItem={breadcrumbItem}
      />

      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />

      <div className="mt-4 flex justify-center">
        <Button
          type="button"
          color="primary"
          disabled={!checked.length || submitLoading}
          onClick={handleAssign}>
          {submitLoading ? <Circlebar size={6} /> : t('assign')}
        </Button>
      </div>
    </ContentWrapper>
  );
}
