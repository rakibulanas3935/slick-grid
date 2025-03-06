// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { SlickgridReact, Aggregators, GroupTotalFormatters } from 'slickgrid-react';
import "./App.css"
import * as XLSX from 'xlsx'; // Import SheetJS for Excel export

const ShowingData = () => {
    const [data, setData] = useState([]);
    const [gridObj, setGridObj] = useState(null);

    const columnDefinitions = [
        { id: 'title', name: 'Title', field: 'title', sortable: true, minWidth: 100 },
        {
            id: 'duration',
            name: 'Duration (days)',
            field: 'duration',
            sortable: true,
            minWidth: 100,
            groupTotalsFormatter: GroupTotalFormatters.sumTotals,
            params: { groupFormatterPrefix: 'Total: ' }
        },
        {
            id: '%',
            name: '% Complete',
            field: 'percentComplete',
            sortable: true,
            minWidth: 100,
            groupTotalsFormatter: GroupTotalFormatters.avgTotalsFormatter,
            params: { groupFormatterPrefix: 'Avg: ' }
        },
        { id: 'start', name: 'Start', field: 'start', minWidth: 100 },
        { id: 'finish', name: 'Finish', field: 'finish', minWidth: 100 },
        { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true, minWidth: 100 },
        { id: 'gender', name: 'Gender', field: 'gender', sortable: true, minWidth: 100 }
    ];

    const gridOptions = {
        enableAutoResize: false,
        gridHeight: 400,
        gridWidth: "100%",
        enableGrouping: true,
    };

    const rowData = [
        { id: 1, title: 'Task 1', duration: 5, percentComplete: 20, start: '2024-11-01', finish: '2024-11-06', effortDriven: true, gender: 'Male' },
        { id: 2, title: 'Task 2', duration: 3, percentComplete: 60, start: '2024-11-03', finish: '2024-11-06', effortDriven: false, gender: 'Female' },
        { id: 3, title: 'Task 3', duration: 8, percentComplete: 40, start: '2024-11-01', finish: '2024-11-09', effortDriven: true, gender: 'Non-Binary' },
        { id: 4, title: 'Task 4', duration: 10, percentComplete: 80, start: '2024-11-04', finish: '2024-11-14', effortDriven: false, gender: 'Female' },
        { id: 5, title: 'Task 5', duration: 6, percentComplete: 50, start: '2024-11-06', finish: '2024-11-12', effortDriven: true, gender: 'Male' },
        { id: 6, title: 'Task 6', duration: 4, percentComplete: 30, start: '2024-11-07', finish: '2024-11-11', effortDriven: false, gender: 'Female' },
        { id: 7, title: 'Task 7', duration: 7, percentComplete: 90, start: '2024-11-01', finish: '2024-11-08', effortDriven: true, gender: 'Non-Binary' },
        { id: 8, title: 'Task 8', duration: 2, percentComplete: 70, start: '2024-11-05', finish: '2024-11-07', effortDriven: false, gender: 'Male' },
        { id: 9, title: 'Task 9', duration: 9, percentComplete: 60, start: '2024-11-02', finish: '2024-11-11', effortDriven: true, gender: 'Female' },
        { id: 10, title: 'Task 10', duration: 5, percentComplete: 25, start: '2024-11-03', finish: '2024-11-08', effortDriven: false, gender: 'Male' },
    ];


    const [groupField, setGroupField] = useState(''); // State for the dynamic grouping field

    const handleDynamicGrouping = () => {
        if (groupField.trim() && gridObj && gridObj.dataView) {
            gridObj.dataView.setGrouping({
                getter: groupField,
                formatter: (group) => `${groupField}: ${group.value} (${group.count} items)`,
                aggregators: [
                    new Aggregators.Sum('duration'),
                    new Aggregators.Avg('percentComplete'),
                ],
                aggregateCollapsed: true,
                lazyTotalsCalculation: true,
                collapsed: true, // Ensure groups are collapsed by default
            });
        } else {
            alert('Please enter a valid field to group by.');
        }
    };

    // Generate additional data
    for (let i = 11; i <= 1000; i++) {
        const randomDuration = Math.floor(Math.random() * 10) + 1;
        const randomPercentComplete = Math.floor(Math.random() * 101);
        const randomEffortDriven = Math.random() < 0.5;
        const randomGender = ['Male', 'Female', 'Non-Binary'][Math.floor(Math.random() * 3)];
        const startDate = new Date(2024, 10, Math.floor(Math.random() * 30) + 1); // Random November 2024 date
        const finishDate = new Date(startDate);
        finishDate.setDate(startDate.getDate() + randomDuration);

        rowData.push({
            id: i,
            title: `Task ${i}`,
            duration: randomDuration,
            percentComplete: randomPercentComplete,
            start: startDate.toISOString().split('T')[0],
            finish: finishDate.toISOString().split('T')[0],
            effortDriven: randomEffortDriven,
            gender: randomGender,
        });
    }



    useEffect(() => {
        setData(rowData);
    }, []);

    const setGrouping = (field) => {
        if (gridObj && gridObj.dataView) {
            gridObj.dataView.setGrouping({
                getter: field,
                formatter: (group) => `${field}: ${group.value} (${group.count} items)`,
                aggregators: [
                    new Aggregators.Sum('duration'),
                    new Aggregators.Avg('percentComplete'),
                ],
                aggregateCollapsed: true,
                collapsed: true,
                lazyTotalsCalculation: true,
            });
        }
    };


    const setGenderGrouping = () => {
        if (gridObj && gridObj.dataView) {
            gridObj.dataView.setGrouping({
                getter: 'gender',
                formatter: (group) => {
                    const gender = group.value;
                    const count = group.count;
                    return `${gender}: ${count} ${(count === 1 ? 'task' : 'tasks')}`;
                },
                aggregators: [],
                aggregateCollapsed: true,
                lazyTotalsCalculation: false,
                collapsed: true,
            });
        }
    };


    const setMultiGrouping = (fields) => {
        if (gridObj && gridObj.dataView) {
            const groupConfigs = fields.map((field) => ({
                getter: field,
                formatter: (group) => `${field.charAt(0).toUpperCase() + field.slice(1)}: ${group.value} (${group.count} items)`,
                aggregators: [
                    new Aggregators.Sum('duration'),
                    new Aggregators.Avg('percentComplete'),
                ],
                aggregateCollapsed: true,
                lazyTotalsCalculation: true,
                collapsed: true,
            }));

            gridObj.dataView.setGrouping(groupConfigs);
        }
    };

    const exportGroupedDataToExcel = () => {
        if (!gridObj || !gridObj.dataView) return;

        const processedData = [];


        const processGroups = (groups, level = 0) => {
            groups.forEach((group) => {
                if (group.__group) {
                    // Add group header
                    processedData.push({
                        Title: `${' '.repeat(level * 4)}Group: ${group.value} (${group.count} items)`,
                        Duration: '',
                        '% Complete': '',
                        Start: '',
                        Finish: '',
                        'Effort Driven': '',
                        Gender: '',
                    });

                    // Process child groups or rows
                    if (group.groups && group.groups.length > 0) {
                        processGroups(group.groups, level + 1);
                    } else if (group.rows && group.rows.length > 0) {
                        group.rows.forEach((row) => {
                            processedData.push({
                                Title: `${' '.repeat((level + 1) * 4)}${row.title}`,
                                Duration: row.duration,
                                '% Complete': row.percentComplete,
                                Start: row.start,
                                Finish: row.finish,
                                'Effort Driven': row.effortDriven,
                                Gender: row.gender,
                            });
                        });
                    }
                } else {
                    // Add flat rows
                    processedData.push({
                        Title: group.title,
                        Duration: group.duration,
                        '% Complete': group.percentComplete,
                        Start: group.start,
                        Finish: group.finish,
                        'Effort Driven': group.effortDriven,
                        Gender: group.gender,
                    });
                }
            });
        };


        const hierarchicalData = gridObj.dataView.getGroups();
        if (hierarchicalData && hierarchicalData.length > 0) {
            processGroups(hierarchicalData);
        } else {
            gridObj.dataView.getItems().forEach((row) => {
                processedData.push({
                    Title: row.title,
                    Duration: row.duration,
                    '% Complete': row.percentComplete,
                    Start: row.start,
                    Finish: row.finish,
                    'Effort Driven': row.effortDriven,
                    Gender: row.gender,
                });
            });
        }

        // Export to Excel
        const worksheet = XLSX.utils.json_to_sheet(processedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'GroupedData');
        XLSX.writeFile(workbook, 'GroupedGridData.xlsx');
    };


    const clearGrouping = () => {
        if (gridObj && gridObj.dataView) {
            gridObj.dataView.setGrouping([]);
        }
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'GridData');
        XLSX.writeFile(workbook, 'GridData.xlsx');
    };

    return (
        <div>
            <div style={{ marginBottom: '10px', marginTop: "30px" }}>

                <input
                    type="text"
                    value={groupField}
                    onChange={(e) => setGroupField(e.target.value)}
                    placeholder="Enter field to group by"
                    style={{ marginRight: '10px', padding: '5px' }}
                />
                <button
                    className="btn btn-primary"
                    onClick={handleDynamicGrouping}
                >
                    Group by Field
                </button>

                <button
                    className="btn btn-primary"
                    onClick={() => setGrouping('duration')}
                >
                    Group by Duration
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => setGrouping('effortDriven')}
                    style={{ marginLeft: '10px' }}
                >
                    Group by Effort Driven
                </button>
                <button
                    className="btn btn-warning"
                    onClick={() => setMultiGrouping(['gender', 'duration'])}
                    style={{ marginLeft: '10px' }}
                >
                    Group by Gender and Duration
                </button>
                <button
                    className="btn btn-warning"
                    onClick={() => setMultiGrouping(['gender', 'percentComplete'])}
                    style={{ marginLeft: '10px' }}
                >
                    Group by Gender and % Complete
                </button>
                <button
                    className="btn btn-success"
                    onClick={() => setGrouping('percentComplete')}
                    style={{ marginLeft: '10px' }}
                >
                    Group by % Complete
                </button>
                <button
                    className="btn btn-warning"
                    onClick={() => setGrouping('start')}
                    style={{ marginLeft: '10px' }}
                >
                    Group by Start Date
                </button>
                <button
                    className="btn btn-warning"
                    onClick={setGenderGrouping}
                    style={{ marginLeft: '10px' }}
                >
                    Group by Gender
                </button>
                <button
                    className="btn btn-danger"
                    onClick={clearGrouping}
                    style={{ marginLeft: '10px' }}
                >
                    Clear Grouping
                </button>
                <button
                    className="btn btn-info"
                    onClick={exportToExcel}
                    style={{ marginLeft: '10px' }}
                >
                    Export to Excel
                </button>
                <button
                    className="btn btn-info"
                    onClick={exportGroupedDataToExcel}
                    style={{ marginLeft: '10px' }}
                >
                    Export to with group data
                </button>
            </div>

            <SlickgridReact
                gridId="grid1"
                columnDefinitions={columnDefinitions}
                gridOptions={gridOptions}
                dataset={data}
                onReactGridCreated={(event) => setGridObj(event.detail)}
            />
        </div>
    );
};

export default ShowingData;
