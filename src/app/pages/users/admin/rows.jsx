// Import Dependencies
import dayjs from "dayjs";
import PropTypes from "prop-types";
import {
  // Listbox,
} from "@headlessui/react";

// Local Imports
import { Highlight } from "components/shared/Highlight";
import { ensureString } from "utils/ensureString";
import { orderStatusOptions } from "./data";
import { Badge } from "components/ui";

// ----------------------------------------------------------------------

export function OrderIdCell({ getValue }) {
  return (
    <span className="font-medium text-primary-600 dark:text-primary-400">
      {getValue()}
    </span>
  );
}

export function DateCell({ getValue }) {
  // const { locale } = useLocaleContext();
  let serverDate = getValue();

  const date = dayjs(serverDate).format("DD MMM YYYY");
  const time = dayjs(serverDate).format("hh:mm A");
  return (
    <>
      <p className="font-medium">{date}</p>
      <p className="mt-0.5 text-xs text-gray-400 dark:text-dark-300">{time}</p>
    </>
  );
}

export function CustomerCell({ getValue, column, table }) {
  const globalQuery = ensureString(table.getState().globalFilter);
  const columnQuery = ensureString(column.getFilterValue());

  const name = getValue();


  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <span className="font-medium text-gray-800 dark:text-dark-100">
        <Highlight query={[globalQuery, columnQuery]}>{name}</Highlight>
      </span>
    </div>
  );
}

export function TotalCell({ getValue }) {
  return (
    <p className="text-sm+ font-medium text-gray-800 dark:text-dark-100">
      ${getValue().toFixed(1)}
    </p>
  );
}

export function ProfitCell({ getValue, row }) {
  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <p className="text-gray-800 dark:text-dark-100">
        ${getValue().toFixed(1)}
      </p>
      <Badge className="rounded-full" color="success" variant="soft">
        {((row.original.profit / row.original.total) * 100).toFixed(0)}%
      </Badge>
    </div>
  );
}

export function StatusCell({ getValue /* row, column, table */ }) {
  const val = getValue();

  const option = orderStatusOptions.find((item) => item.value === val);


  return (
    <Badge color={option.label === 'Inactive' ? "error" : "success"}>
    {option.label}
  </Badge>
  );
}

OrderIdCell.propTypes = {
  getValue: PropTypes.func,
};

DateCell.propTypes = {
  getValue: PropTypes.func,
};

TotalCell.propTypes = {
  getValue: PropTypes.func,
};

ProfitCell.propTypes = {
  getValue: PropTypes.func,
  row: PropTypes.object,
};


CustomerCell.propTypes = {
  row: PropTypes.object,
  column: PropTypes.object,
  table: PropTypes.object,
  getValue: PropTypes.func,
};
