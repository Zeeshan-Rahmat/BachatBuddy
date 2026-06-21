import FilterModal from '@/src/components/modal/FilterModal';
import { AnyStatusFilterType, DateRangeFilterType } from '@/src/types/appTypes';
import React, { useState } from 'react';

interface FilterInvoiceModalProps {
    visible: boolean;
    onApplyFilters: (filters: any) => void;
    onClose: () => void;
}

export default function FilterInvoiceModal({ visible, onApplyFilters, onClose }: FilterInvoiceModalProps) {

    // 1. Core State Hooks matching the visual design options
    const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
    const [toDate, setToDate] = useState<Date | undefined>(undefined);
    const [activeRange, setActiveRange] = useState<DateRangeFilterType>('');
    const [activeStatus, setActiveStatus] = useState<AnyStatusFilterType>('');
    const [selectedUser, setSelectedUser] = useState('');
    const [sortBy, setSortBy] = useState('');

    // 2. Global Clear/Reset Handler Action
    const handleResetAll = () => {
        setFromDate(undefined);
        setToDate(undefined);
        setActiveRange('');
        setActiveStatus('');
        setSelectedUser('');
        setSortBy('');

        onApplyFilters({
            fromDate: undefined,
            toDate: undefined,
            activeRange: '',
            activeStatus: '',
            selectedUser: '',
            sortBy: '',
        });
    };

    const handleApply = () => {
        onApplyFilters({
            fromDate,
            toDate,
            activeRange,
            activeStatus,
            selectedUser,
            sortBy,
        });
    };

    return (
        <FilterModal
            visible={visible}

            fromDate={fromDate}
            toDate={toDate}
            activeRange={activeRange}
            activeStatus={activeStatus}
            selectedUser={selectedUser}
            sortBy={sortBy}

            statusValues='invoiceStatus'

            handleResetAll={handleResetAll}
            handleApply={handleApply}

            setFromDate={setFromDate}
            setToDate={setToDate}
            setSelectedUser={setSelectedUser}
            setSortBy={setSortBy}

            setActiveRange={setActiveRange}
            setActiveStatus={setActiveStatus}
        />
    );
}