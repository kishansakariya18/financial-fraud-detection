import { MagnifyingGlassIcon, MapPinIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { t } from 'i18next';
import { useNavigate } from 'react-router';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { moduleOptions, faqStatusOption } from '../helper';

export function Toolbar({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  pageTitle = ''
}) {
  const { isXs } = useBreakpointsContext();
  const navigate = useNavigate();
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

        <Button
          className="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse"
          color="primary"
          onClick={() => navigate('/faq/add')}>
          <PlusIcon className="size-5" />
          <span>{t('add') + ' ' + t('faq')}</span>
        </Button>
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
          style={{ '--margin-scroll': isFullScreenEnabled ? '1.25rem' : 'var(--margin-x)' }}>
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
  const initialKeyword = useMemo(() => {
    const existing = table
      .getState()
      .columnFilters.find((filter) => filter.id === 'question' && filter.value);
    return existing?.value || '';
  }, [table]);

  const [keyword, setKeyword] = useState(initialKeyword);

  useEffect(() => {
    const relevant = table.getState().columnFilters.filter((f) => f.id === 'question');
    const anyHasValue = relevant.some((f) => f.value);
    if (!anyHasValue && keyword !== '') {
      setKeyword('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.getState().columnFilters, keyword]);

  return (
    <Input
      value={keyword}
      onChange={(e) => {
        const value = e.target.value;
        setKeyword(value);
        table.getColumn('question')?.setFilterValue(value || undefined);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onApplyFilters();
      }}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{ input: 'h-8 text-xs ring-primary-500/50 focus:ring', root: 'shrink-0' }}
      placeholder={t('search') + ' ' + t('question') + '...'}
    />
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleClearStatus = () => {
    table.getColumn('status')?.setFilterValue(undefined);
    onClearFilters();
  };
  const handleClearModule = () => {
    table.getColumn('module')?.setFilterValue(undefined);
    onClearFilters();
  };

  return (
    <>
      {table.getColumn('status') && (
        <FacedtedFilter
          options={faqStatusOption}
          column={table.getColumn('status')}
          title="Status"
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
          onClear={handleClearStatus}
        />
      )}
      {table.getColumn('module') && (
        <FacedtedFilter
          options={moduleOptions}
          column={table.getColumn('module')}
          title="Module"
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
          onClear={handleClearModule}
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

Toolbar.propTypes = { table: PropTypes.object };
SearchInput.propTypes = { table: PropTypes.object, onApplyFilters: PropTypes.func };
Filters.propTypes = { table: PropTypes.object };
