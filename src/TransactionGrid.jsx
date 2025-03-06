// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { SlickgridReact, Aggregators } from "slickgrid-react";
import * as XLSX from "xlsx"; // Import for Excel export
import "./App.css";

const TransactionGrid = () => {
    const [data, setData] = useState([]);
    const [gridObj, setGridObj] = useState(null);
    const [selectedGroupField, setSelectedGroupField] = useState(""); // For dropdown selection

    // Column Definitions
    const columnDefinitions = [
        { id: "transactionType", name: "Transaction Type", field: "transactionType", sortable: true, minWidth: 150 },
        { id: "transactionRefCode", name: "Transaction Ref Code", field: "transactionRefCode", sortable: true, minWidth: 150 },
        { id: "actionDatetime", name: "Action Datetime", field: "actionDatetime", sortable: true, minWidth: 200 },
        { id: "actionByName", name: "Action By", field: "actionByName", sortable: true, minWidth: 150 },
        { id: "deleteReason", name: "Delete Reason", field: "deleteReason", sortable: true, minWidth: 150 },
    ];

    // Grid Options
    const gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        enableGrouping: true,
        enableAutoResize: true,
        gridHeight: 400,
        gridWidth: "100%",
    };

    // Sample Data
    useEffect(() => {
        const transactionData = [
            { id: 1, transactionType: "Sales Delivery", transactionRefCode: "SD123", actionDatetime: "2024-02-27T15:15:26.123", actionByName: "John Doe", deleteReason: null },
            { id: 2, transactionType: "Purchase Order", transactionRefCode: "PO456", actionDatetime: "2024-02-26T12:30:45.456", actionByName: "Jane Smith", deleteReason: "Duplicate entry" },
            { id: 3, transactionType: "Sales Delivery", transactionRefCode: "SD789", actionDatetime: "2024-02-25T10:00:12.789", actionByName: "Alice Johnson", deleteReason: null },
            { id: 4, transactionType: "Purchase Order", transactionRefCode: "PO321", actionDatetime: "2024-02-24T08:45:33.321", actionByName: "John Doe", deleteReason: "Canceled" },
        ];
        setData(transactionData);
    }, []);
    

    // Handle Dynamic Grouping
    const handleGrouping = () => {
        if (selectedGroupField && gridObj && gridObj.dataView) {
            gridObj.dataView.setGrouping({
                getter: selectedGroupField,
                formatter: (group) => `${selectedGroupField}: ${group.value} (${group.count} items)`,
                aggregators: [
                    new Aggregators.Sum("transactionType"),
                ],
                aggregateCollapsed: true,
                lazyTotalsCalculation: true,
                collapsed: true,
            });
        } else {
            alert("Please select a field to group by.");
        }
    };

    // Clear Grouping
    const clearGrouping = () => {
        if (gridObj && gridObj.dataView) {
            gridObj.dataView.setGrouping([]);
        }
    };

    // Export to Excel
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction Data");
        XLSX.writeFile(workbook, "TransactionData.xlsx");
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <h2>Transaction Grid with Grouping & Export</h2>

            {/* Dropdown for Grouping */}
            <select value={selectedGroupField} onChange={(e) => setSelectedGroupField(e.target.value)} style={{ marginRight: "10px", padding: "5px" }}>
                <option value="">Select Group Field</option>
                <option value="transactionType">Transaction Type</option>
                <option value="actionByName">Action By</option>
                <option value="deleteReason">Delete Reason</option>
            </select>

            {/* Grouping and Export Buttons */}
            <button className="btn btn-primary" onClick={handleGrouping}>Group by Selected Field</button>
            <button className="btn btn-danger" onClick={clearGrouping} style={{ marginLeft: "10px" }}>Clear Grouping</button>
            <button className="btn btn-info" onClick={exportToExcel} style={{ marginLeft: "10px" }}>Export to Excel</button>

            {/* SlickGrid Component */}
            <SlickgridReact gridId="grid1" columnDefinitions={columnDefinitions} gridOptions={gridOptions} dataset={data} onReactGridCreated={(event) => setGridObj(event.detail)} />
        </div>
    );
};

export default TransactionGrid;
