import React from 'react';
import './reactTable.css';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';

const ReactTable = ({ columns, data }) => {
    const table = useMaterialReactTable({
        columns,
        data,
        enableFullScreenToggle: false,
        enableColumnFilters: false,
        enableColumnActions: false,
        enableSorting: false,
    });

    return (
        <div className='data_table'>
            <MaterialReactTable table={table} />
        </div>
    );
};

export default ReactTable;
