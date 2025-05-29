// Import Dependencies
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

// Local Imports
import { Highlight } from 'components/shared/Highlight';
import { ensureString } from 'utils/ensureString';
import { Badge, Checkbox } from 'components/ui';

export function DateCell({ getValue }) {
  // const { locale } = useLocaleContext();
  let serverDate = getValue();

  const date = dayjs(serverDate).format('DD MMM YYYY');
  const time = dayjs(serverDate).format('hh:mm A');
  return (
    <>
      {serverDate && (
        <>
          <p className="font-medium">{date}</p>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">{time}</p>
        </>
      )}
      {!serverDate && (
        <>
          <p className="font-medium">-</p>
        </>
      )}
    </>
  );
}

export function IdCell({ getValue }) {
  return <span className="font-medium text-primary-600 dark:text-primary-400">{getValue()}</span>;
}

export function BoldCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());

  const name = getValue();

  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <span className="font-medium text-gray-800 dark:text-dark-100">
        <Highlight query={[globalQuery, columnQuery]}>{name || 'not-found'}</Highlight>
      </span>
    </div>
  );
}

export function BadgeCell({ getValue, column }) {
  const val = getValue();

  // console.log('val: ', val);
  // console.log('optionData: ', column.columnDef.meta?.optionData);

  const optionData = column.columnDef.meta?.optionData || [];
  const option = optionData.find((item) => item.value === val);

  return <Badge color={option?.color}>{option.label}</Badge>;
}

export function AmountCell({ getValue }) {
  return (
    <p className="text-sm+ font-medium text-gray-800 dark:text-dark-100">
      {getValue()?.toFixed(2)}
    </p>
  );
}

export function AddressCell({ getValue }) {
  const val = getValue();
  return (
    <p className="w-48 truncate text-xs+ xl:w-56 2xl:w-64">
      <Highlight>{val}</Highlight>
    </p>
  );
}

export function CreateMarkupCell({ className = '', style = {}, getValue }) {
  const val = getValue();
  return (
    <>{<div className={className} style={style} dangerouslySetInnerHTML={{ __html: val }}></div>}</>
  );
}
export function SelectHeader({ table }) {
  return (
    <div className="flex items-center justify-center">
      <Checkbox
        className="size-4.5"
        color="error"
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    </div>
  );
}

export function SelectCell({ checked, row, onChange }) {
  // console.log('select cell recived', { checked, row, onChange });

  return (
    <div className="flex items-center justify-center">
      <Checkbox
        className="size-4.5"
        checked={checked?.includes(row.original.id)}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onChange={() => onChange(row.original.id)}
      />
    </div>
  );
}
DateCell.propTypes = {
  getValue: PropTypes.func
};

IdCell.propTypes = {
  getValue: PropTypes.func
};

BoldCell.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
  getValue: PropTypes.func
};

AmountCell.propTypes = {
  getValue: PropTypes.func
};
AddressCell.propTypes = {
  getValue: PropTypes.func
};

CreateMarkupCell.propTypes = {
  getValue: PropTypes.func
};
