import React, { useEffect, useState } from 'react';
import { SlickgridReact } from 'slickgrid-react';
import { ExcelExportService } from '@slickgrid-universal/excel-export';
import { GroupTotalFormatters } from '@slickgrid-universal/common';

const ShowingData = () => {
    const [gridObj, setGridObj] = useState(null);

    const columnDefinitions = [
        { id: 'title', name: 'Title', field: 'title', sortable: true },
        {
            id: 'duration',
            name: 'Duration (days)',
            field: 'duration',
            sortable: true,
            groupTotalsFormatter: GroupTotalFormatters.sumTotals,
        },
        {
            id: 'percentComplete',
            name: '% Complete',
            field: 'percentComplete',
            sortable: true,
            groupTotalsFormatter: GroupTotalFormatters.avgTotalsFormatter,
        },
        { id: 'start', name: 'Start Date', field: 'start' },
        { id: 'finish', name: 'Finish Date', field: 'finish' },
        { id: 'gender', name: 'Gender', field: 'gender' },
    ];

    const gridOptions = {
        enableExcelExport: true, // Enable Excel Export
        excelExportOptions: {
            exportWithFormatter: true,
            filename: 'ExportedData.xlsx',
            sheetName: 'Grid Data',
        },
        externalResources: [new ExcelExportService()], // Add ExcelExportService
    };

    const rowData = [
        { id: 1, title: 'Task 1', duration: 5, percentComplete: 20, start: '2024-11-01', finish: '2024-11-06', gender: 'Male' },
        { id: 2, title: 'Task 2', duration: 3, percentComplete: 60, start: '2024-11-03', finish: '2024-11-06', gender: 'Female' },
        // Add more rows...
    ];

    useEffect(() => {
        if (gridObj && gridObj.externalResources && gridObj.externalResources.length > 0) {
            console.log('Excel Export Service initialized.');
        } else {
            console.error('Excel Export Service not initialized.');
        }
    }, [gridObj]);

    const handleExportToExcel = () => {
        if (gridObj && gridObj.externalResources && gridObj.externalResources.length > 0) {
            const excelExportService = gridObj.externalResources[0];
            excelExportService.exportToExcel({
                columnDefinitions,
                dataset: rowData,
                options: gridOptions.excelExportOptions,
            });
        } else {
            console.error('Excel Export Service not initialized.');
        }
    };

    return (
        <div>
            <button onClick={handleExportToExcel} className="btn btn-primary">Export to Excel</button>
            <SlickgridReact
                gridId="grid1"
                columnDefinitions={columnDefinitions}
                gridOptions={gridOptions}
                dataset={rowData}
                onReactGridCreated={(event) => setGridObj(event.detail)}
            />
        </div>
    );
};

export default ShowingData;
