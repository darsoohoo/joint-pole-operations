import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow
} from '@fluentui/react-components'
import { useState } from 'react'
import type { CSSProperties } from 'react'
//import intents from '../data/intents.json'

function MyTable() {

const intents: { intentNumber: string; description: string; intentLifecycleStage: string }[] = [
    { "intentNumber": "PG10000", description: "Install solar panels on the roof of the building", intentLifecycleStage: "Pre-Construction"},
    { "intentNumber": "PG100002", description: "Upgrade HVAC system to improve energy efficiency", intentLifecycleStage: "Post-Construction" },
    { "intentNumber": "PG100003", description: "Implement rainwater harvesting system", intentLifecycleStage: "Pre-Construction" },
    { "intentNumber": "PG100004", description: "Replace windows with double-glazed units", intentLifecycleStage: "Post-Construction" }
];

    const recordsPerPage = 100;
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLifecycleStage, setSelectedLifecycleStage] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const columnWidths: Record<string, CSSProperties> = {
        intentNumber: { width: '180px', minWidth: '180px' },
        description: { width: '320px', minWidth: '320px' },
        lifecycleStage: { width: '220px', minWidth: '220px' }
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

    const getLifecycleStageStyle = (stage: string): CSSProperties => {
        const normalizedStage = stage.trim().toLowerCase();

        if (normalizedStage === 'post-construction' || normalizedStage === 'post-contruction') {
            return { backgroundColor: '#dcfce7', color: '#166534' };
        }

        if (normalizedStage === 'pre-construction') {
            return { backgroundColor: '#fef9c3', color: '#854d0e' };
        }

        return {};
    };

    const filteredIntents = intents.filter((intent) => {
        const normalizedSearchTerm = searchTerm.trim().toLowerCase();
        const matchesLifecycleStage = selectedLifecycleStage === 'all'
            || intent.intentLifecycleStage.trim().toLowerCase() === selectedLifecycleStage;
        const matchesSearch = normalizedSearchTerm === ''
            || intent.intentNumber.toLowerCase().includes(normalizedSearchTerm)
            || intent.description.toLowerCase().includes(normalizedSearchTerm);

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
                        <TableHeaderCell style={{ ...columnWidths.intentNumber, ...leftAlignStyle, ...cellPaddingStyle }}>Intent Number</TableHeaderCell>
                        <TableHeaderCell style={{ ...columnWidths.description, ...leftAlignStyle, ...cellPaddingStyle }}>Description</TableHeaderCell>
                        <TableHeaderCell style={{ ...columnWidths.lifecycleStage, ...leftAlignStyle, ...cellPaddingStyle }}>Lifecycle Stage</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedIntents.map((intent) => (
                        <TableRow key={intent.intentNumber}>
                            <TableCell style={{ ...columnWidths.intentNumber, ...rowBorderStyle, ...leftAlignStyle, ...cellPaddingStyle }}>{intent.intentNumber}</TableCell>
                            <TableCell style={{ ...columnWidths.description, ...rowBorderStyle, ...leftAlignStyle, ...cellPaddingStyle }}>{intent.description}</TableCell>
                            <TableCell style={{ ...columnWidths.lifecycleStage, ...rowBorderStyle, ...leftAlignStyle, ...cellPaddingStyle, ...getLifecycleStageStyle(intent.intentLifecycleStage) }}>{intent.intentLifecycleStage}</TableCell>
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