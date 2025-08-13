// Import Dependencies
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

// Local Imports
import { Highlight } from 'components/shared/Highlight';
import { ensureString } from 'utils/ensureString';
import { Badge, Checkbox } from 'components/ui';
import { setThisClass } from 'utils/setThisClass';
import clsx from 'clsx';

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

export function OneLineDateCell({ getValue }) {
  // const { locale } = useLocaleContext();
  let serverDate = getValue();

  const date = dayjs(serverDate).format('DD MMM YYYY');
  const time = dayjs(serverDate).format('hh:mm A');
  return (
    <>
      {serverDate && (
        <>
          <p className="font-medium">
            {date} <span className="text-center">{time}</span>
          </p>
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

  console.log('val: ', val);
  console.log('optionData: ', column.columnDef.meta?.optionData);

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

export function SelectCell({ checked, row, onChange, align = 'center' }) {
  // console.log('select cell recived', { checked, row, onChange });

  const alignmentClass = align === 'start' ? 'justify-start' : 'justify-center';

  return (
    <div className={`flex items-center ${alignmentClass}`}>
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

export function ThemeSwatchCell({ getValue }) {
  const colors = getValue(); // This gets the array from the accessor
  if (!Array.isArray(colors) || !colors.length) return null;

  return (
    <div className="flex items-center gap-2">
      {colors.map((color, index) => (
        <div
          key={index}
          className="h-6 w-6 rounded-full border shadow"
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}
    </div>
  );
}

export function MultiLineCell({ getValue }) {
  const value = getValue();

  if (!value || value.length === 0) {
    return <span className="font-medium">-</span>;
  }

  const items = value.split(', ');

  return (
    <div>
      {items.map((item, index) => (
        <div key={index} className="font-medium text-gray-800 dark:text-dark-100">
          {item}
        </div>
      ))}
    </div>
  );
}

export function StatusIconCell({ getValue, column }) {
  const value = getValue();
  const options = column.columnDef.meta?.optionData || [];
  const option = options.find((opt) => opt.value === value);
  if (!option) return null;
  const Icon = option.icon;
  const color = option.color;

  return (
    <Icon
      className={clsx(
        'h-5 w-5',
        color && color !== 'neutral' && [setThisClass(color), 'text-this dark:text-this-light']
      )}
    />
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

SelectCell.propTypes = {
  checked: PropTypes.array,
  row: PropTypes.object,
  onChange: PropTypes.func,
  align: PropTypes.oneOf(['center', 'start'])
};

ThemeSwatchCell.propTypes = {
  getValue: PropTypes.func
};

MultiLineCell.propTypes = {
  getValue: PropTypes.func
};

StatusIconCell.propTypes = {
  getValue: PropTypes.func,
  column: PropTypes.object
};
