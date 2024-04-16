import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ColumnDef, HeaderGroup, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import MainCard from "components/MainCard";
import ScrollX from "components/ScrollX";
import { CellEditable } from "components/third-party/react-table";
import { CodeMapping } from "data/store/features/codemappings/Types";

interface ReactTableProps {
    columns: ColumnDef<CodeMapping>[];
    data: CodeMapping[];
    setData: any;
}

function ReactTable({ columns, data, setData }: ReactTableProps) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData: (rowIndex, columnId, value) => {
                setData((old: CodeMapping[]) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex]!,
                                [columnId]: value
                            };
                        }
                        return row;
                    })
                );
            }
        },
        debugTable: true
    });

    /*
    let headers: LabelKeyObject[] = [];
    table.getAllColumns().map(
        (columns) =>
            // @ts-ignore
            columns.columnDef.accessorKey &&
            headers.push({
                label: typeof columns.columnDef.header === 'string' ? columns.columnDef.header : '#',
                // @ts-ignore
                key: columns.columnDef.accessorKey
            })
    );*/

    return (
        <MainCard
            content={false}
            title="Editable Cell"
        /*secondary={
            <CSVExport {...{ data: table.getRowModel().flatRows.map((row) => row.original), headers, filename: 'editable-cell.csv' }} />
        }*/
        >
            <ScrollX>
                <TableContainer>
                    <Table>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup: HeaderGroup<any>) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableCell key={header.id} {...header.column.columnDef.meta}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} {...cell.column.columnDef.meta}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ScrollX>
        </MainCard>
    );
}

export default ReactTable