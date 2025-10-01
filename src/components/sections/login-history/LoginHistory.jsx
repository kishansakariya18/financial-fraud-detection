import { useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useParams, useSearchParams } from 'react-router';
import { useLockScrollbar } from 'hooks';
import PropTypes from 'prop-types';

import { columns } from './LoginHistoryColumns';
import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { loginHistoryResponseMapper } from 'app/pages/users/admin/helper';
import { getQueryParams } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { LoginHistoryToolbar } from './LoginHistoryToolbar';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import AdminService from 'services/admin.services';
import SupervisorService from 'services/supervisor.services';

const LoginHistory = ({
  paramKey = 'adminId', // adminId, supervisorUID, agentUID
  breadcrumbConfig = { title: 'admin', path: '/users/admin' }
}) => {
  const { t } = useTranslation();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('login') + ' ' + t('history');

  // Get the UID from params using the provided paramKey
  const userUID = params[paramKey];

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchLoginHistory = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;
    let result;

    if (paramKey === 'agentUID') {
      result = SupervisorService.getCallingAgentLoginHistory({
        pagination: { pageIndex, pageSize },
        callingAgentUID: userUID
      });
    } else {
      result = AdminService.getAdminLoginHistory({
        pagination: { pageIndex, pageSize },
        adminUID: userUID
      });
    }

    return result
      .then(({ response }) => {
        return {
          status: 200,
          data: loginHistoryResponseMapper(response.data),
          totalRecords: parseInt(response.totalRecords) || DEFAULT_PER_PAGE_RECORD
        };
      })
      .catch((error) => {
        return { status: 500, error: error || 'Failed to fetch login history' };
      });

    // console.log(result.status, '652653465346');

    // if (result.status === 200) {
    //   return {
    //     status: 200,
    //     data: loginHistoryResponseMapper(result.response.data),
    //     totalRecords: parseInt(result?.response?.totalRecords) || DEFAULT_PER_PAGE_RECORD
    //   };
    // }
    // return { status: 500, error: result.error || 'Failed to fetch login history' };
  };

  const { table, isLoading, error, setError, tableSettings } = useTable({
    columns,
    fetchData: fetchLoginHistory,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: { enableFullScreen: false, enableRowDense: false },
      columnVisibility: { id: false }
    }
  });

  useEffect(() => {
    if (!isLoading && error) {
      toast.error(error);
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useLockScrollbar(tableSettings.enableFullScreen);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <LoginHistoryToolbar
        table={table}
        pageTitle={pageTitle}
        breadcrumbConfig={breadcrumbConfig}
      />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
};

LoginHistory.propTypes = {
  paramKey: PropTypes.string,
  breadcrumbConfig: PropTypes.shape({
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
  })
};

export default LoginHistory;
