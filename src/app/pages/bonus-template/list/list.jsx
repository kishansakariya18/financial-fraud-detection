import { useCallback, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router';

import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import useTable from 'components/ui/useTable';

import BonusTemplateService from 'services/bonus-template.services';

import { createBonusTemplateColumns } from './columns.jsx';
import { getQueryParams, isEmptyObject } from 'utils/custom.utilities';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import {
  mapBonusTemplateListItem,
  bonusTemplateStatusOptions,
  bonusTemplateTypeOptions
} from '../happer';
import { useTranslation } from 'react-i18next';
import { PERMISSIONS } from 'constants/app.constant';
import { TableToolbar } from 'components/shared/table/TableToolbar';

export default function BonusTemplateList() {
  const { t } = useTranslation();
  const pageTitle = t('bonus_template');
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);
  const filtersInitializedRef = useRef(false);
  const navigate = useNavigate();

  const fetchTemplates = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    return await BonusTemplateService.getTemplates({
      pagination: { pageIndex, pageSize },
      filters: queryParams
    })
      .then(({ response }) => {
        return {
          status: 200,
          data: response.data?.map((item) => mapBonusTemplateListItem(item, t)) || [],
          totalRecords: response.totalRecords ?? 0
        };
      })
      .catch((error) => {
        return {
          status: 500,
          error: error.message || 'Unable to load bonus templates'
        };
      });
  };

  const handleView = useCallback(
    (template) => {
      if (!template?.id) return;
      navigate(`/bonus/templates/${template.id}/view`, { state: { mode: 'view' } });
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (template) => {
      if (!template?.id) return;
      navigate(`/bonus/templates/${template.id}/edit`);
    },
    [navigate]
  );

  const handleDelete = useCallback(async (template) => {
    if (!template?.id) return null;
    return BonusTemplateService.deleteTemplate(template.id);
  }, []);

  const handleChangeStatus = useCallback(async (template) => {
    if (!template?.id) return null;
    return BonusTemplateService.updateTemplateStatus(template.id);
  }, []);

  const handleDuplicate = useCallback(async (template) => {
    if (!template?.id) return null;
    return BonusTemplateService.duplicateTemplate(template.id);
  }, []);

  const tableColumns = useMemo(
    () =>
      createBonusTemplateColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onChangeStatus: handleChangeStatus,
        onDuplicate: handleDuplicate
      }),
    [handleView, handleEdit, handleDelete, handleChangeStatus, handleDuplicate]
  );

  const { table, isLoading, error, setError, tableSettings, setColumnFilters } = useTable({
    columns: tableColumns,
    fetchData: fetchTemplates,
    queryParams,
    setSearchParams,
    paginationEnabled: true,
    initialSettings: {
      tableSettings: { enableFullScreen: false },
      columnPinning: { left: ['id'], right: ['actions'] }
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
  }, [error, isLoading, setError]);

  useEffect(() => {
    if (!filtersInitializedRef.current) {
      const filtersFromQuery = [];
      if (queryParams.keyword) {
        filtersFromQuery.push({ id: 'templateName', value: queryParams.keyword });
      }
      if (queryParams.status) {
        filtersFromQuery.push({ id: 'status', value: queryParams.status });
      }
      if (queryParams.bonusType) {
        filtersFromQuery.push({ id: 'bonusType', value: queryParams.bonusType });
      }
      if (queryParams.startDate && queryParams.endDate) {
        filtersFromQuery.push({
          id: 'updatedAt',
          value: [+queryParams.startDate, +queryParams.endDate]
        });
      }
      setColumnFilters(filtersFromQuery);
      filtersInitializedRef.current = true;
    }
  }, [queryParams, setColumnFilters]);

  const applyFilterHandler = () => {
    const filterItems = {};
    table.getState().columnFilters.forEach((filter) => {
      switch (filter.id) {
        case 'templateName':
          filterItems.keyword = filter.value;
          break;
        case 'status':
          filterItems.status = filter.value;
          break;
        case 'bonusType':
          filterItems.bonusType = filter.value;
          break;
        case 'updatedAt':
          filterItems.date = filter.value;
          break;
        default:
          break;
      }
    });

    setSearchParams({
      pageIndex: DEFAULT_PAGE_INDEX,
      pageSize: DEFAULT_PER_PAGE_RECORD,
      ...(filterItems.keyword && { keyword: filterItems.keyword }),
      ...(filterItems.status && { status: filterItems.status }),
      ...(filterItems.bonusType && { bonusType: filterItems.bonusType }),
      ...(Array.isArray(filterItems.date) &&
        filterItems.date.length === 2 && {
          startDate: filterItems.date[0],
          endDate: filterItems.date[1]
        })
    });
  };

  const clearFilterHandler = () => {
    if (!isEmptyObject(queryParams)) {
      setSearchParams({
        pageIndex: DEFAULT_PAGE_INDEX,
        pageSize: DEFAULT_PER_PAGE_RECORD
      });
    }
    table.resetColumnFilters();
    filtersInitializedRef.current = false;
  };

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <TableToolbar
        table={table}
        pageTitle={pageTitle}
        onApplyFilters={applyFilterHandler}
        onClearFilters={clearFilterHandler}
        searchColumn="templateName"
        searchPlaceholder={t('search') + ' templates...'}
        createButton={{
          show: true,
          permission: PERMISSIONS.BONUS_TEMPLATES.ADD,
          route: '/bonus/templates/create',
          text: t('create') + ' ' + t('template')
        }}
        filters={[
          {
            type: 'faceted',
            column: 'status',
            title: t('status'),
            options: bonusTemplateStatusOptions,
            isMultiple: false,
            showCheckbox: false
          },
          {
            type: 'faceted',
            column: 'bonusType',
            title: t('bonus_type'),
            options: bonusTemplateTypeOptions,
            isMultiple: false,
            showCheckbox: false
          },
          {
            type: 'date',
            column: 'updatedAt',
            title: t('updated_range'),
            config: {
              mode: 'range',
              maxDate: new Date().fp_incr?.(1)
            }
          }
        ]}
      />
      <TableCard
        tableSettings={tableSettings}
        table={table}
        loading={isLoading}
        paginationEnabled
      />
    </ContentWrapper>
  );
}
