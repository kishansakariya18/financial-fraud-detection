import { Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import {
  ArrowPathIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteCurrency, updateCurrency } from '../../../../../store/currencies/action';

const RowActions = ({ id, item }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteCurrency(id));
  };

  const handleStatusChange = () => {
    dispatch(updateCurrency(id, { is_active: !item.is_active }));
  };

  return (
    <Menu>
      <MenuHandler>
        <EllipsisVerticalIcon className="h-5 w-5 cursor-pointer" />
      </MenuHandler>
      <MenuList>
        <MenuItem>
          <Link to={`/casino-management/currencies/edit/${id}`} className="flex items-center">
            <PencilSquareIcon className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </MenuItem>
        <MenuItem className="flex items-center" onClick={handleStatusChange}>
          <ArrowPathIcon className="mr-2 h-4 w-4" />
          {item.is_active ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <MenuItem className="flex items-center" onClick={handleDelete}>
          <TrashIcon className="mr-2 h-4 w-4" />
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default RowActions;
