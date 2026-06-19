import {
    CustomerType,
    FilterType,
    InvoiceType,
    ProductType,
    SupplierType,
    UserType
} from "../types/appTypes";

// Define a unified Union type for all supported entity items
export type AnyItemType = ProductType | InvoiceType | UserType | CustomerType | SupplierType;

export const handleFilterData = (filters: FilterType, itemsData: AnyItemType[]): AnyItemType[] => {
    let filteredResults: AnyItemType[] = [...itemsData];

    // Helper to securely parse dates whether they arrive as ISO strings or Date instances
    const getItemDate = (item: AnyItemType): Date => {
        return new Date(item.created_at);
    };

    // ==========================================
    // 1. FILTER BY STATUS (Stock, Party, or Invoice)
    // ==========================================
    if (filters.activeStatus) {
        filteredResults = filteredResults.filter(
            (item) => item.status.toLowerCase() === filters.activeStatus.toLowerCase()
        );
    }

    // ==========================================
    // 2. FILTER BY USER (Inspects creator name natively)
    // ==========================================
    if (filters.selectedUser && filters.selectedUser !== 'Select User') {
        filteredResults = filteredResults.filter((item) => {
            // Self-contained User entity checks its own profile name; others inspect created_by nested record
            const creatorName = ('user_id' in item) ? item.name : item.created_by?.name;

            if (!creatorName) return false;

            const cleanCreator = creatorName.replace(/\s*\(You\)/i, '').trim().toLowerCase();
            const cleanFilterUser = filters.selectedUser.replace(/\s*\(You\)/i, '').trim().toLowerCase();

            return cleanCreator === cleanFilterUser;
        });
    }

    // ==========================================
    // 3. FILTER BY DATE-TIME WINDOWS / CUSTOM DATES
    // ==========================================
    const now = new Date();

    // Normalize "today" to absolute midnight milestones for accurate time-window boundaries
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);

    if (filters.activeRange) {
        filteredResults = filteredResults.filter((item) => {
            const itemTime = getItemDate(item).getTime();

            switch (filters.activeRange) {
                case 'Today':
                    return itemTime >= todayStart.getTime();

                case 'This Week':
                    return itemTime >= weekStart.getTime();

                case 'This Month':
                    return itemTime >= monthStart.getTime();

                default:
                    return true;
            }
        });
    }
    // Fallback directly to Custom Date Pickers boundary range if explicit Range tags are empty
    else if (filters.fromDate || filters.toDate) {
        filteredResults = filteredResults.filter((item) => {
            const itemTime = getItemDate(item).getTime();
            let matches = true;

            if (filters.fromDate) {
                matches = matches && itemTime >= new Date(filters.fromDate).getTime();
            }
            if (filters.toDate) {
                // Extends to 23:59:59 of the target date boundary so current-day logs aren't accidentally cut off
                const endBoundary = new Date(filters.toDate);
                endBoundary.setHours(23, 59, 59, 999);
                matches = matches && itemTime <= endBoundary.getTime();
            }
            return matches;
        });
    }

    // ==========================================
    // 4. SORT ENGINE INTERFACES (Uses unix values)
    // ==========================================
    filteredResults.sort((a, b) => {
        const timeA = getItemDate(a).getTime();
        const timeB = getItemDate(b).getTime();

        if (filters.sortBy.includes('Newest First')) {
            return timeB - timeA; // High UNIX epoch time values (most recent dates) go up front
        } else {
            return timeA - timeB; // Oldest dates first
        }
    });

    return filteredResults;
};