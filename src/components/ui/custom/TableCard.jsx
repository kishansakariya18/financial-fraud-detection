// Local Imports
import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';

import { useThemeContext } from 'app/contexts/theme/context';
import { Table, Card, THead, TBody, Th, Tr, Td, Skeleton } from 'components/ui';
import { TableSortIcon } from 'components/shared/table/TableSortIcon';
import { PaginationSection } from 'components/shared/table/PaginationSection';

const TableCard = (props) => {
  const { cardSkin } = useThemeContext();
  const { tableSettings, table, loading, paginationEnabled = true } = props; // Added loading prop

  return (
    <div
      className={clsx(
        'transition-content flex flex-col pt-3',
        tableSettings.enableFullScreen ? 'overflow-hidden' : 'px-[--margin-x]'
      )}>
      <Card
        className={clsx(
          'relative flex grow flex-col',
          tableSettings.enableFullScreen && 'overflow-hidden'
        )}>
        <div className="table-wrapper min-w-full grow overflow-x-auto">
          <Table
            hoverable
            dense={tableSettings.enableRowDense}
            sticky={tableSettings.enableFullScreen}
            className="w-full text-left rtl:text-right">
            <THead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                      key={header.id}
                      className={clsx(
                        'bg-gray-200 font-semibold uppercase text-gray-800 dark:bg-dark-800 dark:text-dark-100 ltr:first:rounded-tl-lg ltr:last:rounded-tr-lg rtl:first:rounded-tr-lg rtl:last:rounded-tl-lg',
                        header.column.getCanPin() && [
                          header.column.getIsPinned() === 'left' &&
                            'sticky z-2 ltr:left-0 rtl:right-0',
                          header.column.getIsPinned() === 'right' &&
                            'sticky z-2 ltr:right-0 rtl:left-0'
                        ]
                      )}>
                      {header.column.getCanSort() ? (
                        <div
                          className="flex cursor-pointer select-none items-center space-x-3 rtl:space-x-reverse"
                          onClick={header.column.getToggleSortingHandler()}>
                          <span className="flex-1">
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          <TableSortIcon sorted={header.column.getIsSorted()} />
                        </div>
                      ) : header.isPlaceholder ? null : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </Th>
                  ))}
                </Tr>
              ))}
            </THead>

            <TBody>
              {loading ? (
                [...Array(10)].map((_, i) => (
                  <Tr key={i} className="animate-pulse border-b border-gray-200">
                    {table.getAllColumns().map((column, index) => (
                      <Td key={index} className="p-4">
                        <Skeleton className="h-10 w-full" />
                      </Td>
                    ))}
                  </Tr>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <Tr
                    key={row.id}
                    className={clsx(
                      'relative border-y border-transparent border-b-gray-200 dark:border-b-dark-500',
                      row.getIsSelected() &&
                        'row-selected after:pointer-events-none after:absolute after:inset-0 after:z-2 after:h-full after:w-full after:border-3 after:border-transparent after:bg-primary-500/10 ltr:after:border-l-primary-500 rtl:after:border-r-primary-500'
                    )}>
                    {row.getVisibleCells().map((cell) => (
                      <Td
                        key={cell.id}
                        className={clsx(
                          'relative bg-white',
                          cardSkin === 'shadow' ? 'dark:bg-dark-700' : 'dark:bg-dark-900',
                          cell.column.getCanPin() && [
                            cell.column.getIsPinned() === 'left' &&
                              'sticky z-2 ltr:left-0 rtl:right-0',
                            cell.column.getIsPinned() === 'right' &&
                              'sticky z-2 ltr:right-0 rtl:left-0'
                          ]
                        )}>
                        {cell.column.getIsPinned() && (
                          <div
                            className={clsx(
                              'pointer-events-none absolute inset-0 border-gray-200 dark:border-dark-500',
                              cell.column.getIsPinned() === 'left'
                                ? 'ltr:border-r rtl:border-l'
                                : 'ltr:border-l rtl:border-r'
                            )}></div>
                        )}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td
                    colSpan={table.getAllColumns().length}
                    className="h-20 text-center text-gray-500 dark:text-gray-400">
                    No data available
                  </Td>
                </Tr>
              )}
            </TBody>
          </Table>
        </div>

        {!loading && paginationEnabled && table.getCoreRowModel().rows.length > 0 && (
          <div
            className={clsx(
              'px-4 pb-4 sm:px-5 sm:pt-4',
              tableSettings.enableFullScreen && 'bg-gray-50 dark:bg-dark-800',
              !(table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) && 'pt-4'
            )}>
            <PaginationSection table={table} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default TableCard;
