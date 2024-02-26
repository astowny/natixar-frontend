import { FunctionComponent, memo } from 'react';

import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { EmissionsByClusterProps } from './types';
import { DataPoint } from 'data/store/features/coordinates/Types';
import { Box, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { formatEmissionAmount } from 'utils/formatAmounts';
import { CategoryLabel } from 'components/categories/CategoriesLegend';
import _ from 'lodash';

const tableLayout = {
    "CONTRIBUTOR": "company",
    "DATA SOURCE": "company",
    "EMISSIONS": (amount: number) => formatEmissionAmount(amount),
    "TYPE OF EMISSIONS": "category"
}

const VirtuosoTableComponents: TableComponents<DataPoint> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer component={Box} {...props} ref={ref} />
    )),
    Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref} />
    )),
};


const fixedHeaderContent = () => (
    <TableRow>
        {Object.keys(tableLayout).map(columnName =>
            <TableCell key={columnName} align={columnName === 'EMISSIONS' ? 'right' : 'left'}>{columnName}</TableCell>
        )}
    </TableRow>
)

function rowContent(_index: number, row: DataPoint) {
    const columns = Object.values(tableLayout)
    return (
        <>
            <TableCell key="company"><Link href="#">{row.company}</Link></TableCell>
            <TableCell key="data-source">ERP</TableCell>
            <TableCell key="emissionAmount" align='right'>{formatEmissionAmount(row.emission_amount)}</TableCell>
            <TableCell key="category"><CategoryLabel name={_.capitalize(row.category)} /></TableCell>
        </>
    );
}

const EmissionsByClusterTable: FunctionComponent<EmissionsByClusterProps> = ({ cluster }) => {
    const data = [...cluster.dataPoints]
    const sortedEmissions = data.sort((a, b) => b.emission_amount - a.emission_amount)

    return (<TableVirtuoso
        data={sortedEmissions}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
    />)
}

export default memo(EmissionsByClusterTable)