import { CheckBadgeIcon, XCircleIcon } from "@heroicons/react/24/outline";

export const statusOptions = [
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