import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/outline";

// export const orderStatusOptions = [
//     {
//         value: 'shipping',
//         label: 'Shipping',
//         color: 'info',
//         icon: TruckIcon
//     },
//     {
//         value: 'pending',
//         label: 'Pending',
//         color: 'warning',
//         icon: ClockIcon
//     },
//     {
//         value: 'completed',
//         label: 'Completed',
//         color: 'success',
//         icon: CheckBadgeIcon
//     },
//     {
//         value: 'processing',
//         label: 'Processing',
//         color: 'primary',
//         icon: ArrowPathIcon
//     },
//     {
//         value: 'cancelled',
//         label: 'Cancelled',
//         color: 'error',
//         icon: XCircleIcon
//     }
// ]

export const orderStatusOptions = [
    // {
    //     value: 'active',
    //     label: 'Shipping',
    //     color: 'info',
    //     icon: TruckIcon
    // },
    {
        value: 'active',
        label: 'Active',
        color: 'success',
        icon: CheckBadgeIcon
    },
    {
        value: 'inactive',
        label: 'Inactive',
        color: 'error',
        icon: XCircleIcon
    }
]