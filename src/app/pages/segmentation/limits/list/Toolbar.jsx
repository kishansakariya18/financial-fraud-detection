// Import Dependencies
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

// Local Imports
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { t } from 'i18next';
import { userclassOptions } from '../../helper';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import {
  PERMISSIONS,
  USER_CLASS_LIMIT_TYPE,
  USER_CLASS_LIMIT_PERIOD
} from 'constants/app.constant';
import { useNavigate } from 'react-router';
import usePermissions from 'app/router/usePermissions';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

export function Toolbar({
  table,
  pageTitle = '',
  onApplyFilters = () => {},
  onClearFilters = () => {},
  segmentationId = ''
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  const breadcrumbItems = [
    { title: t('segmentation'), path: '/segmentation' },
    { title: t('limits') }
  ];

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          'transition-content flex items-center justify-between gap-4',
          isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x] pt-4'
        )}>
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {pageTitle}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {hasPermission(PERMISSIONS.SEGMENTATION_LIMIT.CREATE) && (
          <Button
            className="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse"
            color="primary"
            onClick={() => navigate(`/segmentation/${segmentationId}/limits/create`)}>
            <PlusIcon className="size-5" />
            <span>{t('add') + ' ' + t('limit')}</span>
          </Button>
        )}
      </div>

      {isXs ? (
        <>
          <div
            className={clsx(
              'flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}>
            <SearchInput table={table} onApplyFilters={onApplyFilters} />
            <TableConfig table={table} />
          </div>
          <div
            className={clsx(
              'hide-scrollbar flex shrink-0 space-x-2 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}>
            <Filters
              table={table}
              onApplyFilters={onApplyFilters}
              onClearFilters={onClearFilters}
            />
          </div>
        </>
      ) : (
        <div
          className={clsx(
            'custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse',
            isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
          )}
          style={{
            '--margin-scroll': isFullScreenEnabled ? '1.25rem' : 'var(--margin-x)'
          }}>
          <div className="flex shrink-0 space-x-2 rtl:space-x-reverse">
            <SearchInput table={table} onApplyFilters={onApplyFilters} />
            <Filters
              table={table}
              onApplyFilters={onApplyFilters}
              onClearFilters={onClearFilters}
            />
          </div>

          <TableConfig table={table} />
        </div>
      )}
    </div>
  );
}

function SearchInput({ table, onApplyFilters }) {
  const { t } = useTranslation();
  return (
    <Input
      value={table?.getColumn('limitType')?.getFilterValue() || ''}
      onChange={(e) => table.getColumn('limitType').setFilterValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onApplyFilters();
        }
      }}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        input: 'h-8 text-xs ring-primary-500/50 focus:ring',
        root: 'shrink-0'
      }}
      placeholder={t('search_limit_name')}
    />
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const { t } = useTranslation();
  const isFiltered = table.getState().columnFilters.length > 0;

  // Build options for limit type and period
  const limitTypeOptions = [
    { value: 'deposit', label: USER_CLASS_LIMIT_TYPE.DEPOSIT },
    { value: 'withdraw', label: USER_CLASS_LIMIT_TYPE.WITHDRAW },
    { value: 'wager', label: USER_CLASS_LIMIT_TYPE.WAGER },
    { value: 'loss', label: USER_CLASS_LIMIT_TYPE.LOSS }
  ];
  const limitPeriodOptions = [
    { value: 'daily', label: USER_CLASS_LIMIT_PERIOD.DAILY },
    { value: 'weekly', label: USER_CLASS_LIMIT_PERIOD.WEEKLY },
    { value: 'monthly', label: USER_CLASS_LIMIT_PERIOD.MONTHLY }
  ];

  return (
    <>
      {table.getColumn('limitType') && (
        <FacedtedFilter
          options={limitTypeOptions}
          column={table.getColumn('limitType')}
          title={t('limit_type')}
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      {table.getColumn('limitPeriod') && (
        <FacedtedFilter
          options={limitPeriodOptions}
          column={table.getColumn('limitPeriod')}
          title={t('limit_period')}
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      {table.getColumn('status') && (
        <FacedtedFilter
          options={userclassOptions}
          column={table.getColumn('status')}
          title={t('status')}
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      <div>
        <Button onClick={onApplyFilters} className="h-8 whitespace-nowrap px-2.5 text-xs">
          {t('search')}
        </Button>
        <Button
          onClick={onClearFilters}
          className="ml-1 h-8 whitespace-nowrap px-2.5 text-xs"
          disabled={!isFiltered}>
          {t('reset') + ' ' + t('filter')}
        </Button>
      </div>
    </>
  );
}

Toolbar.propTypes = {
  table: PropTypes.object,
  pageTitle: PropTypes.string,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  userClassUID: PropTypes.string
};

SearchInput.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func
};

Filters.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func
};
