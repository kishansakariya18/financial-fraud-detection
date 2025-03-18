// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
    CustomerCell,
    DateCell,
    OrderIdCell,
    StatusCell,
} from "./rows";
import { CopyableCell } from "../../../../components/shared/table/CopyableCell";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.accessor((row) => row.id, {
        id: "id",
        label: "Admin ID",
        header: "Admin ID",
        cell: OrderIdCell,
        enableSorting: false,
    }),
    columnHelper.accessor((row) => row.username, {
        id: "username",
        label: "Username",
        header: "User Name",
        cell: CustomerCell,
        enableSorting: false,
    }),
    columnHelper.accessor((row) => row.firstname, {
        id: "firstname",
        label: "FirstName",
        header: "First Name",
        cell: CustomerCell,
        enableSorting: false
    }),
    columnHelper.accessor((row) => row.lastname, {
        id: "lastname",
        label: "LastName",
        header: "Last Name",
        cell: CustomerCell,
        enableSorting: false
    }),
    columnHelper.accessor((row) => row.email, {
        id: "email",
        header: "email",
        label: "Email",
        cell: CopyableCell,
        enableSorting: false,
      }),
      columnHelper.accessor((row) => row.mobile, {
        id: "mobile",
        header: "Phone",
        label: "Phone",
        cell: CopyableCell,
        enableSorting: false,
      }),
    columnHelper.accessor((row) => row.status, {
        id: "status",
        label: "Admin Status",
        header: "Status",
        cell: StatusCell,
        filterFn: "arrIncludesSome",
        enableSorting: false,
    }),
    columnHelper.accessor((row) => row.createdAt, {
        id: "createdAt",
        label: "Admin Date",
        header: "Created At",
        cell: DateCell,
        filterFn: "inNumberRange",
        enableSorting: false,
    }),
    columnHelper.accessor((row) => row.updatedAt, {
        id: "updatedAt",
        label: "Updated At",
        header: "Updated At",
        cell: DateCell,
        filterFn: "inNumberRange",
        enableSorting: false,
    }),
    columnHelper.display({
        id: "actions",
        label: "Row Actions",
        header: "Actions",
        cell: RowActions,
        enableSorting: false,
    }),
]
