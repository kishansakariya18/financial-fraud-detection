// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {
    // AddressCell,
    CustomerCell,
    DateCell,
    OrderIdCell,
    OrderStatusCell,
    // ProfitCell,
    // TotalCell,
} from "./rows";
import { CopyableCell } from "../../../../components/shared/table/CopyableCell";
// import { CopyableCell } from "components/shared/table/CopyableCell";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        label: "Row Selection",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => row.id, {
        id: "id",
        label: "Admin ID",
        header: "Admin ID",
        cell: OrderIdCell,
    }),
    columnHelper.accessor((row) => row.createdAt, {
        id: "createdAt",
        label: "Admin Date",
        header: "Date",
        cell: DateCell,
        filterFn: "inNumberRange",
    }),
    columnHelper.accessor((row) => row.username, {
        id: "username",
        label: "Name",
        header: "Name",
        cell: CustomerCell,
    }),
    columnHelper.accessor((row) => row.email, {
        id: "email",
        header: "email",
        label: "Email",
        cell: CopyableCell
      }),
      columnHelper.accessor((row) => row.mobile, {
        id: "mobile",
        header: "Phone",
        label: "Phone",
        cell: CopyableCell,
      }),
    // columnHelper.accessor((row) => row.total, {
    //     id: "total",
    //     label: "Total",
    //     header: "Total",
    //     cell: TotalCell,
    //     filterFn: "inNumberRange",
    // }),
    // columnHelper.accessor((row) => row.profit, {
    //     id: "profit",
    //     label: "Profit",
    //     header: "Profit",
    //     cell: ProfitCell,
    //     filterFn: "inNumberRange",
    // }),
    columnHelper.accessor((row) => row.status, {
        id: "status",
        label: "Admin Status",
        header: "Status",
        cell: OrderStatusCell,
        filterFn: "arrIncludesSome",
    }),
    // columnHelper.accessor(
    //     (row) =>
    //         `${row.shipping_address?.street}, ${row.shipping_address?.line}`,
    //     {
    //         id: "address",
    //         label: "Address",
    //         header: "Address",
    //         cell: AddressCell,
    //     }
    // ),
    columnHelper.display({
        id: "actions",
        label: "Row Actions",
        header: "Actions",
        cell: RowActions
    }),
]
