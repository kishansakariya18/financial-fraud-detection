// Import Dependencies
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';

// Local Imports
import { DateFilter } from 'components/shared/table/DateFilter';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { playerStatusOptions, panVerifiedOptions } from '../helper';
import { bankVerifiedOptions } from '../helper';
import { t } from 'i18next';
import { DashboardCard } from 'components/custom/DashboardCard';
import { dummyCards } from 'helpers/functions';
import { genderOptions } from '../helper';
// ----------------------------------------------------------------------

export function Toolbar({
  table,
  pageTitle = '',
  summary = null,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  countries = null,
  segmentations = null
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
      <div className="mb-3 mt-4 grid grid-cols-1 gap-4 px-[--margin-x] sm:grid-cols-4">
        <DashboardCard
          label={dummyCards.User.TOTAL_USERS.key}
          value={summary ? summary.totalUsers : dummyCards.User.TOTAL_USERS.value}
          gradientFrom={dummyCards.User.TOTAL_USERS.gradientFrom}
          gradientTo={dummyCards.User.TOTAL_USERS.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
        <DashboardCard
          label={dummyCards.User.INACTIVE_USERS.key}
          value={summary ? summary.inactiveUsers : dummyCards.User.INACTIVE_USERS.value}
          gradientFrom={dummyCards.User.INACTIVE_USERS.gradientFrom}
          gradientTo={dummyCards.User.INACTIVE_USERS.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
        <DashboardCard
          label={dummyCards.User.TOTAL_REALCASH.key}
          value={summary ? summary.totalRealCash : dummyCards.User.TOTAL_REALCASH.value}
          gradientFrom={dummyCards.User.TOTAL_REALCASH.gradientFrom}
          gradientTo={dummyCards.User.TOTAL_REALCASH.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
        <DashboardCard
          label={dummyCards.User.TOTAL_BONUS.key}
          value={summary ? summary.totalBonus : dummyCards.User.TOTAL_BONUS.value}
          gradientFrom={dummyCards.User.TOTAL_BONUS.gradientFrom}
          gradientTo={dummyCards.User.TOTAL_BONUS.gradientTo}
          textColor="text-sky-100"
          maskShape="is-reuleaux-triangle"
        />
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
              country={countries}
              segmentation={segmentations}
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
              country={countries}
              segmentation={segmentations}
            />
          </div>

          <TableConfig table={table} />
        </div>
      )}
    </div>
  );
}

function SearchInput({ table, onApplyFilters }) {
  return (
    <Input
      value={table?.getColumn('username')?.getFilterValue() || ''}
      onChange={(e) => table.getColumn('username').setFilterValue(e.target.value)}
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
      placeholder={t('search_desc')}
    />
  );
}

function Filters({
  table,
  onApplyFilters = () => {},
  onClearFilters = () => {},
  country,
  segmentation
}) {
  const isFiltered = table.getState().columnFilters.length > 0;
  return (
    <>
      {table.getColumn('status') && (
        <FacedtedFilter
          options={playerStatusOptions}
          column={table.getColumn('status')}
          title={t('status')}
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      {table.getColumn('isBankVerified') && (
        <FacedtedFilter
          options={bankVerifiedOptions}
          column={table.getColumn('isBankVerified')}
          title={t('bank_verified')}
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      {table.getColumn('gender') && (
        <FacedtedFilter
          options={genderOptions}
          column={table.getColumn('gender')}
          title={t('gender')}
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      {table.getColumn('isKYCVerified') && (
        <FacedtedFilter
          options={panVerifiedOptions}
          column={table.getColumn('isKYCVerified')}
          title={t('pan_verified')}
          Icon={MapPinIcon}
          isMultiple={false}
          showCheckbox={false}
        />
      )}
      {table.getColumn('createdAt') && (
        <DateFilter
          column={table.getColumn('createdAt')}
          title={t('date') + ' ' + t('range')}
          config={{
            maxDate: new Date().fp_incr(1),
            mode: 'range'
          }}
        />
      )}
      {/* <FacedtedFilter
        title={'Countries'}
        options={countries}
        labelField={'CountryName'}
        valueField={'CountryID'}
        selectedValues={selectedSegmentations}
        setSelectedValues={setSelectedSegmentations}
      /> */}
      <FacedtedFilter
        options={
          country
            ? country.map((countr) => ({
                label: countr.CountryName,
                value: countr.CountryID
              }))
            : []
        }
        title={t('country')}
        column={table.getColumn('CountryID')}
        Icon={MapPinIcon}
        isMultiple={true}
        showCheckbox={true}
      />
      {table.getColumn('SegmentationID') && (
        <FacedtedFilter
          options={
            segmentation
              ? segmentation.map((segment) => ({
                  label: segment.Name,
                  value: segment.UserSegmentID
                }))
              : []
          }
          title={t('segmentation')}
          column={table.getColumn('SegmentationID')}
          Icon={MapPinIcon}
          isMultiple={true}
          showCheckbox={true}
        />
      )}
      {/* {segmentations && (
        <FacedtedFilter
          options={
            segmentations
              ? segmentations.map((segment) => ({
                  label: segment.segmentationName,
                  value: segment.segmentationID
                }))
              : []
          }
          value={selectedSegmentations}
          onChange={setSelectedSegmentations}
          title={t('segmentation')}
          Icon={MapPinIcon}
          isMultiple={true}
          showCheckbox={true}
        />
      )} */}
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
  summary: PropTypes.object,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  countries: PropTypes.array,
  segmentations: PropTypes.array
};

SearchInput.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func
};

Filters.propTypes = {
  table: PropTypes.object,
  onApplyFilters: PropTypes.func,
  onClearFilters: PropTypes.func,
  countries: PropTypes.array,
  segmentations: PropTypes.array
};
