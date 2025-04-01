// Import Dependencies
import { FlagIcon } from "@heroicons/react/24/outline";

// Local Imports
import SettingIcon from "assets/dualicons/setting.svg?react";
import { NAV_TYPE_ITEM } from "constants/app.constant";


export const country = {
    id: 'country',
    type: NAV_TYPE_ITEM,
    path: '/country',
    title: 'Country',
    transKey: 'country',
    Icon: SettingIcon,
    childs: [
        {
            id: 'country',
            type: NAV_TYPE_ITEM,
            path: '/country',
            title: 'Country',
            transKey: 'country',
            Icon: FlagIcon,
        }
    ]
}