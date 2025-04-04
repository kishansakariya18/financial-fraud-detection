// Import Dependencies
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import PropTypes from 'prop-types';

// Local Imports
import { DateFilter } from 'components/shared/table/DateFilter';
import { FacedtedFilter } from 'components/shared/table/FacedtedFilter';
import { Button, Input } from 'components/ui';
import { playerStatusOptions } from '../helper';
import { t } from 'i18next';
// import { useNavigate } from "react-router";
import { CustomModal } from 'components/custom';
import CreateNote from './CreateNote';
import { useState } from 'react';

export function Toolbar({ table, pageTitle = '' }) {
  const isFullScreenEnabled = table.getState().tableSettings.enableFullScreen;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onOpenDialogBox = () => {
    setIsDialogOpen(true);
  };
  const onCloseDialogBox = () => {
    setIsDialogOpen(false);
  };

  const onOkDialogBox = async (row) => {
    await table.options.meta?.editRow(row);
    setIsDialogOpen(false);
  };

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
        <div className="h-8 space-x-1.5 rounded-md px-3 text-xs rtl:space-x-reverse">
          <CustomModal
            onClose={onCloseDialogBox}
            onOpen={onOpenDialogBox}
            onOk={onOkDialogBox}
            show={isDialogOpen}
            title={pageTitle}
            btnTitle={t('add') + ' ' + t('note')}
            btnColor={'primary'}
            isShowBtn={true}>
            <CreateNote onClose={onOkDialogBox} />
          </CustomModal>
        </div>
      </div>
    </div>
  );
}

function SearchInput({ table }) {
  return (
    <Input
      value={table?.getColumn('username')?.getFilterValue() || ''}
      onChange={(e) => table.getColumn('username').setFilterValue(e.target.value)}
      prefix={<MagnifyingGlassIcon className="size-4" />}
      classNames={{
        input: 'h-8 text-xs ring-primary-500/50 focus:ring',
        root: 'shrink-0'
      }}
      placeholder="Search Mobile, User..."
    />
  );
}

function Filters({ table, onApplyFilters = () => {}, onClearFilters = () => {} }) {
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

      {isFiltered && (
        <div>
          <Button onClick={onApplyFilters} className="h-8 whitespace-nowrap px-2.5 text-xs">
            {t('search')}
          </Button>
          <Button onClick={onClearFilters} className="ml-1 h-8 whitespace-nowrap px-2.5 text-xs">
            {t('reset') + ' ' + t('filter')}
          </Button>
        </div>
      )}
    </>
  );
}

Toolbar.propTypes = {
  table: PropTypes.object
};

SearchInput.propTypes = {
  table: PropTypes.object
};

Filters.propTypes = {
  table: PropTypes.object
};
