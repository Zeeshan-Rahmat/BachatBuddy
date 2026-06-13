// Auth Defaults Icons
import dashboard from '@assets/icons/auth/default/dashboard.png';
import dropdown from '@assets/icons/auth/default/dropdown.png';
import email from '@assets/icons/auth/default/email.png';
import fingerprint from '@assets/icons/auth/default/fingerprint.png';
import hide from '@assets/icons/auth/default/hide.png';
import largeFingerprint from '@assets/icons/auth/default/largeFingerprint.png';
import largeVerified from '@assets/icons/auth/default/largeVerified.png';
import otp from '@assets/icons/auth/default/otp.png';
import password from "@assets/icons/auth/default/password.png";
import role from "@assets/icons/auth/default/role.png";
import show from '@assets/icons/auth/default/show.png';
import user from '@assets/icons/auth/default/user.png';

// Auth Active Icons
import activeDropdown from '@assets/icons/auth/active/activeDropdown.png';
import activeEmail from '@assets/icons/auth/active/activeEmail.png';
import activeHide from '@assets/icons/auth/active/activeHide.png';
import activeOTP from '@assets/icons/auth/active/activeOTP.png';
import activePassword from "@assets/icons/auth/active/activePassword.png";
import activeRole from "@assets/icons/auth/active/activeRole.png";
import activeShow from '@assets/icons/auth/active/activeShow.png';
import activeUser from '@assets/icons/auth/active/activeUser.png';

// Top Bar Icons
import menu from '@assets/icons/top-bar/menu.png';
import notificationOutline from '@assets/icons/top-bar/notificationOutline.png';

// Bottom Navigation Icons
// Filled
import homeFilled from "@assets/icons/bottom-nav/homeFilled.png";
import partiesFilled from "@assets/icons/bottom-nav/partiesFilled.png";
import reportsFilled from "@assets/icons/bottom-nav/reportsFilled.png";
import salesFilled from "@assets/icons/bottom-nav/salesFilled.png";
import stockFilled from "@assets/icons/bottom-nav/stockFilled.png";

// Outlined
import homeOutline from "@assets/icons/bottom-nav/homeOutline.png";
import partiesOutline from "@assets/icons/bottom-nav/partiesOutline.png";
import reportsOutline from "@assets/icons/bottom-nav/reportsOutline.png";
import salesOutline from "@assets/icons/bottom-nav/salesOutline.png";
import stockOutline from "@assets/icons/bottom-nav/stockOutline.png";


// Dashboard Icons
// Summary Cards
import loans from "@assets/icons/dashboard/summary-card/loans.png";
import topRightArrow from "@assets/icons/dashboard/summary-card/topRightArrow.png";
import totalCardSales from "@assets/icons/dashboard/summary-card/totalCardSales.png";
import totalProducts from "@assets/icons/dashboard/summary-card/totalProducts.png";
import usersActive from "@assets/icons/dashboard/summary-card/usersActive.png";

// Quick Action
import addProduct from "@assets/icons/dashboard/quick-actions/addProduct.png";
import invoice from "@assets/icons/dashboard/quick-actions/invoice.png";
import ledger from "@assets/icons/dashboard/quick-actions/ledger.png";
import newSale from "@assets/icons/dashboard/quick-actions/newSale.png";

// Quick Reports
import invoiceSum from "@assets/icons/dashboard/quick-reports/invoicesSum.png";
import ledgerSum from "@assets/icons/dashboard/quick-reports/ledgerSum.png";
import lowStock from "@assets/icons/dashboard/quick-reports/lowStock.png";
import pendingDues from "@assets/icons/dashboard/quick-reports/pendingDues.png";
import profitLoss from "@assets/icons/dashboard/quick-reports/profitLoss.png";
import topProducts from "@assets/icons/dashboard/quick-reports/topProducts.png";
import totalSales from "@assets/icons/dashboard/quick-reports/totalSales.png";
import totalStock from "@assets/icons/dashboard/quick-reports/totalStock.png";

// Common
import activeSearch from "@assets/icons/common/activeSearch.png";
import customer from "@assets/icons/common/customer.png";
import filter from "@assets/icons/common/filter.png";
import plus from "@assets/icons/common/plus.png";
import product from "@assets/icons/common/product.png";
import sale from "@assets/icons/common/sale.png";
import search from "@assets/icons/common/search.png";

// Menu
import addfriend from "@assets/icons/menu/addFriend.png";
import backupRestore from "@assets/icons/menu/backupRestore.png";
import businessDetail from "@assets/icons/menu/businessDetail.png";
import changePassword from "@assets/icons/menu/changePassword.png";
import customizeInvoice from "@assets/icons/menu/customizeInvoice.png";
import defaultDashboard from "@assets/icons/menu/defaultDashboard.png";
import edit from "@assets/icons/menu/edit.png";
import exportIcon from "@assets/icons/menu/export.png";
import logout from "@assets/icons/menu/logout.png";
import notificationFilled from "@assets/icons/menu/notificationFilled.png";
import touchID from "@assets/icons/menu/touchID.png";


export const ICONS = {
    AUTH: {
        // Defaults Icons
        user,
        role,
        password,
        dropdown,
        show,
        hide,
        fingerprint,
        largeFingerprint,
        email,
        otp,
        largeVerified,
        dashboard,

        // Active Icons
        activeUser,
        activeRole,
        activePassword,
        activeDropdown,
        activeShow,
        activeHide,
        activeEmail,
        activeOTP
    },
    TOP_BAR: {
        menu,
        notificationOutline
    },
    BOTTOM_NAV: {
        // Filled
        homeFilled,
        stockFilled,
        salesFilled,
        reportsFilled,
        partiesFilled,

        // Ouline
        homeOutline,
        stockOutline,
        salesOutline,
        reportsOutline,
        partiesOutline,
    },
    DASHBOARD: {
        // Summary 
        totalCardSales,
        totalProducts,
        usersActive,
        loans,
        topRightArrow,

        // Action
        newSale,
        addProduct,
        ledger,
        invoice,

        // Reports
        invoiceSum,
        ledgerSum,
        lowStock,
        pendingDues,
        profitLoss,
        topProducts,
        totalSales,
        totalStock,
    },
    COMMON: {
        search,
        activeSearch,
        filter,
        plus,
        sale,
        product,
        customer,
    },
    MENU: {
        addfriend,
        backupRestore,
        businessDetail,
        changePassword,
        customizeInvoice,
        defaultDashboard,
        touchID,
        edit,
        exportIcon,
        logout,
        notificationFilled,
    }
} as const;

export type IconKey = keyof typeof ICONS;