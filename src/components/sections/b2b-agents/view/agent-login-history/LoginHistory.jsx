import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import PropTypes from 'prop-types';

import TableCard from 'components/ui/custom/TableCard';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { loginHistoryResponseMapper } from 'app/pages/users/admin/helper';
import { getQueryParams } from 'utils/custom.utilities';
import { useTranslation } from 'react-i18next';
import useTable from 'components/ui/useTable';
import { LoginHistoryToolbar } from './LoginHistoryToolbar';
import { DEFAULT_PAGE_INDEX, DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { loginHistoryColumns } from './LoginHistoryColumns.jsx';
import B2BAgentService from 'services/b2b-agent/b2b-agent.services';

const AgentLoginHistory = ({
  agentUID, // adminId, supervisorUID, agentUID
  breadcrumbItem
}) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageTitle = t('login') + ' ' + t('history');

  const queryParams = useMemo(() => getQueryParams(searchParams), [searchParams]);

  const fetchLoginHistory = async () => {
    const pageIndex = isNaN(queryParams.pageIndex) ? DEFAULT_PAGE_INDEX : +queryParams.pageIndex;
    const pageSize = isNaN(queryParams.pageSize) ? DEFAULT_PER_PAGE_RECORD : +queryParams.pageSize;

    return B2BAgentService.getAgentLoginHistory({
      pagination: { pageIndex, pageSize },
      agentUID
    })
      .then((res) => {
        return {
          status: 200,
          data: loginHistoryResponseMapper(res.response.data),
          totalRecords: parseInt(res?.response?.totalRecords) || DEFAULT_PER_PAGE_RECORD
        };
      })
      .catch((err) => {
        console.error(err);
        return { status: 500, error: err.response.data.message };
      });
  };

  const { table, isLoading, tableSettings } = useTable({
    columns: loginHistoryColumns,
    fetchData: fetchLoginHistory,
    queryParams,
    setSearchParams,
    initialSettings: {
      columnPinning: { left: ['id'], right: ['actions'] },
      tableSettings: { enableFullScreen: false, enableRowDense: false },
      columnVisibility: { id: false }
    }
  });

  // useEffect(() => {
  //   if (agentUID) {
  //     initialFetch();
  //   }
  // }, [agentUID]);

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={tableSettings.enableFullScreen}>
      <LoginHistoryToolbar table={table} pageTitle={pageTitle} breadcrumbItem={breadcrumbItem} />
      <TableCard tableSettings={tableSettings} table={table} loading={isLoading} />
    </ContentWrapper>
  );
};

AgentLoginHistory.propTypes = {
  paramKey: PropTypes.string,
  breadcrumbConfig: PropTypes.shape({
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
  })
};

export default AgentLoginHistory;
