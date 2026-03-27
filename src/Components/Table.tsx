import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow
} from '@fluentui/react-components'
import { useState, useEffect } from 'react'
import type { CSSProperties } from 'react'
import { JointPoleIntentsService } from '../generated/services/JointPoleIntentsService'; 
import type { JointPoleIntentsBase } from '../generated/models/JointPoleIntentsModel'; 
//import intents from '../data/intents.json'

function MyTable() {


// const intents: { IntentNumber: string; Description: string; IntentLifecycleStage: string }[] = [
//     { "IntentNumber": "PG10000", "Description": "Install solar panels on the roof of the building", "IntentLifecycleStage": "Pre-Construction"},
//     { "IntentNumber": "PG100002", "Description": "Upgrade HVAC system to improve energy efficiency", "IntentLifecycleStage": "Post-Construction" },
//     { "IntentNumber": "PG100003", "Description": "Implement rainwater harvesting system", "IntentLifecycleStage": "Pre-Construction" },
//     { "IntentNumber": "PG100004", "Description": "Replace windows with double-glazed units", "IntentLifecycleStage": "Post-Construction" }
// ];

    const recordsPerPage = 100;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLifecycleStage, setSelectedLifecycleStage] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [intents, setIntents] = useState<JointPoleIntentsBase[]>([]);

    useEffect(() => {
        console.log("Loading records...");
        loadRecords();
    }, []);

    const loadRecords = async () => {
        try {
            const result = await JointPoleIntentsService.getAll();
            if (result.data) {
                console.log('Fetched Intents:', result.data);
                setIntents(result.data); // result.data is T[] 
            } else {
                console.log('No intents found or error occurred');
            }
        } catch (err) {
            console.error('Error fetching intents:', err);
        }
    };

    const columnWidths: Record<string, CSSProperties> = {
        IntentNumber: { width: '180px', minWidth: '180px' },
        Description: { width: '320px', minWidth: '320px' },
        IntentLifecycleStage: { width: '220px', minWidth: '220px' }
    };

    const rowBorderStyle: CSSProperties = {
        borderBottom: '1px solid #d1d1d1'
    };

    const leftAlignStyle: CSSProperties = {
        textAlign: 'left'
    };

    const cellPaddingStyle: CSSProperties = {
        padding: '10px 12px'
    };

    const normalize = (value?: string) => (value ?? '').trim().toLowerCase();

    const getLifecycleStageStyle = (stage?: string): CSSProperties => {
        const normalizedStage = normalize(stage);

        if (normalizedStage === 'post-construction' || normalizedStage === 'post-contruction') {
            return { backgroundColor: '#dcfce7', color: '#166534' };
        }

        if (normalizedStage === 'pre-construction') {
            return { backgroundColor: '#fef9c3', color: '#854d0e' };
        }

        return {};
    };

    const filteredIntents = intents.filter((intent) => {
        const normalizedSearchTerm = normalize(searchTerm);
        const intentStage = normalize(intent.IntentLifecycleStage);
        const intentNumber = normalize(intent.IntentNumber);
        const intentDescription = normalize(intent.Description);

        const matchesLifecycleStage =
            selectedLifecycleStage === 'all' || intentStage === selectedLifecycleStage;

        const matchesSearch =
            normalizedSearchTerm === '' ||
            intentNumber.includes(normalizedSearchTerm) ||
            intentDescription.includes(normalizedSearchTerm);

        return matchesLifecycleStage && matchesSearch;
    });

    const totalRecords = filteredIntents.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedIntents = filteredIntents.slice(startIndex, endIndex);

    const filterContainerStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px'
    };

    const filterLabelStyle: CSSProperties = {
        color: '#333',
        fontWeight: 600
    };

    const filterSelectStyle: CSSProperties = {
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        backgroundColor: '#fff',
        color: '#111827'
    };

    const searchInputStyle: CSSProperties = {
        padding: '8px 12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        backgroundColor: '#fff',
        color: '#111827',
        minWidth: '280px'
    };

    const paginationContainerStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginTop: '12px'
    };

    const pageInfoStyle: CSSProperties = {
        marginRight: '8px',
        color: '#555'
    };


    return (
        <>
            <div style={filterContainerStyle}>
                <label htmlFor="intent-search" style={filterLabelStyle}>Search</label>
                <input
                    id="intent-search"
                    type="text"
                    placeholder="Search intent number or description"
                    style={searchInputStyle}
                    value={searchTerm}
                    onChange={(event) => {
                        setSearchTerm(event.target.value);
                        setCurrentPage(1);
                    }}
                />

                <label htmlFor="lifecycle-stage-filter" style={filterLabelStyle}>Lifecycle Stage</label>
                <select
                    id="lifecycle-stage-filter"
                    style={filterSelectStyle}
                    value={selectedLifecycleStage}
                    onChange={(event) => {
                        setSelectedLifecycleStage(event.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="all">All</option>
                    <option value="pre-construction">Pre-Construction</option>
                    <option value="post-construction">Post-Construction</option>
                </select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell style={{ ...columnWidths.IntentNumber, ...leftAlignStyle, ...cellPaddingStyle }}>Intent Number</TableHeaderCell>
                        <TableHeaderCell style={{ ...columnWidths.Description, ...leftAlignStyle, ...cellPaddingStyle }}>Description</TableHeaderCell>
                        <TableHeaderCell style={{ ...columnWidths.IntentLifecycleStage, ...leftAlignStyle, ...cellPaddingStyle }}>Lifecycle Stage</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedIntents.map((intent) => (
                        <TableRow key={intent.IntentNumber}>
                            <TableCell style={{ ...columnWidths.IntentNumber, ...rowBorderStyle, ...leftAlignStyle, ...cellPaddingStyle }}>{intent.IntentNumber}</TableCell>
                            <TableCell style={{ ...columnWidths.Description, ...rowBorderStyle, ...leftAlignStyle, ...cellPaddingStyle }}>{intent.Description}</TableCell>
                            <TableCell style={{ ...columnWidths.IntentLifecycleStage, ...rowBorderStyle, ...leftAlignStyle, ...cellPaddingStyle, ...getLifecycleStageStyle(intent.IntentLifecycleStage) }}>{intent.IntentLifecycleStage}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div style={paginationContainerStyle}>
                <span style={pageInfoStyle}>
                    Showing {totalRecords === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, totalRecords)} of {totalRecords} records (Page {Math.min(currentPage, Math.max(totalPages, 1))} of {Math.max(totalPages, 1)})
                </span>
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1 || totalRecords === 0}>First</button>
                <button onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1 || totalRecords === 0}>Previous</button>
                <button onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages || totalRecords === 0}>Next</button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalRecords === 0}>Last</button>
            </div>
        </>
    );

}

export default MyTable;