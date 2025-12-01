// Import Dependencies
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';

// Local Imports
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { t } from 'i18next';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { DateFilter } from 'components/shared/table/DateFilter';
import { enquiresStatusOptions, enquiresSubjectOptions } from '../helper';

export function Toolbar({
  keyword,
  setKeyword,
  searchParams,
  setSearchParams,
  table,
  pageTitle = '',
  onApplyFilters = () => {},
  onClearFilters = () => {}
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          'transition-content flex items-center justify-between gap-4',
          isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x] pt-4'
        )}>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
            {pageTitle}
          </h2>
        </div>
      </div>

      {isXs ? (
        <>
          <div
            className={clsx(
              'flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}>
            <SearchInput
              keyword={keyword}
              setKeyword={setKeyword}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
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
            <SearchInput
              keyword={keyword}
              setKeyword={setKeyword}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
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

function SearchInput({ keyword, setKeyword, searchParams, setSearchParams }) {
  return (
    <>
      <Input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setSearchParams(
              (prev) => ({
                ...Object.fromEntries(prev),
                keyword: keyword.trim(),
                pageIndex: 0
              }),
              { replace: true }
            );
          }
        }}
        prefix={<MagnifyingGlassIcon className="size-4" />}
        classNames={{
          input: 'h-8 text-xs ring-primary-500/50 focus:ring',
          root: 'shrink-0'
        }}
        placeholder={t('search') + ' ' + t('enquiry_subject') + ', ' + t('email') + '...'}
      />
      <Button
        onClick={() =>
          setSearchParams(
            (prev) => ({
              ...Object.fromEntries(prev),
              keyword: keyword.trim(),
              pageIndex: 0
            }),
            { replace: true }
          )
        }
        className="h-8 whitespace-nowrap px-2.5 text-xs">
        {t('search')}
      </Button>
      <Button
        onClick={() => {
          setKeyword('');
          setSearchParams(
            (prev) => {
              const next = { ...Object.fromEntries(prev), pageIndex: 0 };
              delete next.keyword;
              return next;
            },
            { replace: true }
          );
        }}
        className="h-8 whitespace-nowrap px-2.5 text-xs"
        disabled={!keyword && !(searchParams.get('keyword') || '')}>
        {t('reset') + ' ' + t('search')}
      </Button>
    </>
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <>
      {table.getColumn('Status') && (
        <FacedtedFilter
          options={enquiresStatusOptions}
          column={table.getColumn('Status')}
          title={t('status')}
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}

      {table.getColumn('Subject') && (
        <FacedtedFilter
          options={enquiresSubjectOptions}
          column={table.getColumn('Subject')}
          title={t('enquiry_subject')}
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}

      {table.getColumn('Created At') && (
        <DateFilter
          column={table.getColumn('Created At')}
          title={t('date') + ' ' + t('range')}
          config={{
            maxDate: new Date().fp_incr(1),
            mode: 'range'
          }}
        />
      )}

      <div>
        <Button onClick={onApplyFilters} className="h-8 whitespace-nowrap px-2.5 text-xs">
          {t('apply_filters')}
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
  keyword: PropTypes.string.isRequired,
  setKeyword: PropTypes.func.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  table: PropTypes.object,
  pageTitle: PropTypes.string,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func
};

SearchInput.propTypes = {
  keyword: PropTypes.string.isRequired,
  setKeyword: PropTypes.func.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired
};

Filters.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func
};
