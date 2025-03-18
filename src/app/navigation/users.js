// Import Dependencies
import { UserIcon, UsersIcon } from "@heroicons/react/24/outline";

// Local Imports
import SettingIcon from "assets/dualicons/setting.svg?react";
import { NAV_TYPE_ITEM } from "constants/app.constant";


export const users = {
    id: 'users',
    type: NAV_TYPE_ITEM,
    path: '/users',
    title: 'Users',
    transKey: 'nav.users.users',
    Icon: SettingIcon,
    childs: [
        {
            id: 'admin',
            type: NAV_TYPE_ITEM,
            path: '/admin',
            title: 'General',
            transKey: 'nav.users.admin',
            Icon: UserIcon,
        },
        {
            id: 'players',
            type: NAV_TYPE_ITEM,
            path: '/players',
            title: 'Players',
            transKey: 'nav.users.players',
            Icon: UsersIcon,
        }
    ]
}