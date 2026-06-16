import PaddingWrapper from '@/src/components/common/PaddingWrapper'
import QuickCard from '@/src/components/dashboard/QuickCard'
import SectionHeader from '@/src/components/dashboard/SectionHeader'
import ScreenWrapper from '@/src/components/layout/ScreenWrapper'
import { ICONS } from '@/src/constants/icons'
import React from 'react'
import { View } from 'react-native'


const ExportReportScreen = () => {

    return (
        <ScreenWrapper
            title='Export Report'
            leftIcon='back'
            rightIcons='none'
            isBottomNavIncluded={false}
            isMenuIncluded={false}
        >
            <PaddingWrapper>

                <SectionHeader title="SALES AND INVOICE DATA" marginTop={0} hasViewMore={false} />
                <View className="flex-row gap-4 flex-wrap justify-between">
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.DASHBOARD.totalSales} label="Total Sales" />
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.EXPORT.unpaidInvoice} label="Unpaid Invoices" />
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.DASHBOARD.pendingDues} label="Pending Invoices" />
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.DASHBOARD.profitLoss} label="Profit & Loss" />
                </View>

                <SectionHeader title="STOCK / INVENTORY DATA" hasViewMore={false} />
                <View className="flex-row gap-4 flex-wrap justify-between">
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.DASHBOARD.totalStock} label="Current Stock" />
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.DASHBOARD.topProducts} label="Top Products" />
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.DASHBOARD.lowStock} label="Low Stock" />
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.EXPORT.outOfStock} label="Out of Stock" />
                </View>

                <SectionHeader title="CUSTOMER, SUPPLIER AND EMPLOYEE DATA" hasViewMore={false} />
                <View className="flex-row gap-4 flex-wrap justify-between">
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.EXPORT.allCustomers} label="All Customers" />
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.EXPORT.topCustomer} label="Top Customers" />
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.EXPORT.customerPending} label="Cust. Pending Dues" />
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.EXPORT.allSuppliers} label="All Suppliers" />
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.EXPORT.supplierActivity} label="Supplier Activity" />
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.EXPORT.employeeList} label="Employees List" />
                    <QuickCard minWidth='min-w-[30%]' icon={ICONS.EXPORT.employeeActivity} label="Employee Activity" />
                </View>

                <View className='h-5' />

            </PaddingWrapper>
        </ScreenWrapper>
    )
}

export default ExportReportScreen