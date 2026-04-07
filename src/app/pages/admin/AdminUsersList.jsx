import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { EyeIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

import { Button, Spinner, Badge } from 'components/ui';
import { CustomModal } from 'components/custom/CustomModal';
import AdminDashboardService from 'services/adminDashboard.service';

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-gray-100 py-2 last:border-0 dark:border-dark-600">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-dark-400">
        {label}
      </dt>
      <dd className="text-sm text-gray-900 dark:text-dark-100">{value ?? '—'}</dd>
    </div>
  );
}

export default function AdminUsersList() {
  const [listLoading, setListLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const loadList = useCallback(async () => {
    setListLoading(true);
    try {
      const res = await AdminDashboardService.getUsers({ page, limit });
      if (res.status !== 200) {
        toast.error(
          res.error || res.response?.message || res.response?.error || 'Failed to load users'
        );
        setUsers([]);
        return;
      }
      const body = res.response;
      setUsers(Array.isArray(body?.data) ? body.data : []);
      const p = body?.pagination || {};
      setPagination({
        total: p.total ?? 0,
        totalPages: p.totalPages ?? 1,
        page: p.page ?? page,
        limit: p.limit ?? limit
      });
    } catch (e) {
      console.error(e);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setListLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const openDetails = async (userId) => {
    setDetailOpen(true);
    setDetailUser(null);
    setDetailError('');
    setDetailLoading(true);
    try {
      const res = await AdminDashboardService.getUserById(userId);
      if (res.status !== 200) {
        setDetailError(
          res.error || res.response?.message || res.response?.error || 'Failed to load user'
        );
        return;
      }
      setDetailUser(res.response?.user || null);
    } catch (e) {
      console.error(e);
      setDetailError('Failed to load user');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setDetailOpen(false);
    setDetailUser(null);
    setDetailError('');
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-50">Users</h2>
          <p className="text-sm text-gray-500 dark:text-dark-400">
            {pagination.total} user{pagination.total !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button color="primary" variant="outlined" onClick={loadList} disabled={listLoading}>
          Refresh
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-dark-600 dark:bg-dark-800">
        {listLoading ? (
          <div className="flex justify-center py-20">
            <Spinner className="size-10 border-2" />
          </div>
        ) : users.length === 0 ? (
          <p className="p-8 text-center text-gray-500 dark:text-dark-400">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 dark:border-dark-600 dark:bg-dark-700/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-700 dark:text-dark-200">Name</th>
                  <th className="px-4 py-3 font-medium text-gray-700 dark:text-dark-200">Email</th>
                  <th className="px-4 py-3 font-medium text-gray-700 dark:text-dark-200">Role</th>
                  <th className="px-4 py-3 font-medium text-gray-700 dark:text-dark-200">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-700 dark:text-dark-200">
                    Created
                  </th>
                  <th className="w-14 px-4 py-3 text-center font-medium text-gray-700 dark:text-dark-200">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-600">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/80 dark:hover:bg-dark-700/30">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-dark-100">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-dark-200">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="soft"
                        color={String(u.role).toUpperCase() === 'ADMIN' ? 'warning' : 'neutral'}
                        className="text-xs">
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="soft"
                        color={u.isActive ? 'success' : 'neutral'}
                        className="text-xs">
                        {u.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-dark-300">
                      {u.createdAt ? dayjs(u.createdAt).format('MMM D, YYYY HH:mm') : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="flat"
                        isIcon
                        className="size-9 rounded-lg"
                        title="View details"
                        onClick={() => openDetails(u._id)}>
                        <EyeIcon className="size-5 text-primary-600 dark:text-primary-400" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500 dark:text-dark-400">
            Page {page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              disabled={page <= 1 || listLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
            </Button>
            <Button
              variant="outlined"
              disabled={page >= pagination.totalPages || listLoading}
              onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <CustomModal
        show={detailOpen}
        onClose={closeDetails}
        title="User details"
        description=""
        sizeClass="max-w-lg"
        modalFooter={
          <Button variant="outlined" onClick={closeDetails}>
            Close
          </Button>
        }>
        {detailLoading ? (
          <div className="flex justify-center py-10">
            <Spinner className="size-8 border-2" />
          </div>
        ) : detailError ? (
          <p className="text-sm text-red-600 dark:text-red-400">{detailError}</p>
        ) : detailUser ? (
          <dl>
            <DetailRow label="Name" value={detailUser.name} />
            <DetailRow label="Email" value={detailUser.email} />
            <DetailRow label="Role" value={detailUser.role} />
            <DetailRow label="User ID" value={detailUser._id} />
            <DetailRow label="Active" value={detailUser.isActive ? 'Yes' : 'No'} />
            <DetailRow label="Deleted" value={detailUser.isDeleted ? 'Yes' : 'No'} />
            <DetailRow
              label="Created"
              value={
                detailUser.createdAt
                  ? dayjs(detailUser.createdAt).format('MMM D, YYYY HH:mm:ss')
                  : '—'
              }
            />
            <DetailRow
              label="Updated"
              value={
                detailUser.updatedAt
                  ? dayjs(detailUser.updatedAt).format('MMM D, YYYY HH:mm:ss')
                  : '—'
              }
            />
          </dl>
        ) : (
          <p className="text-sm text-gray-500">No data.</p>
        )}
      </CustomModal>
    </main>
  );
}
