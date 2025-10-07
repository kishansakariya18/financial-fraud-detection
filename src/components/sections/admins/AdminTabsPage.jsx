import { randomId } from 'utils/randomId';
import { useTranslation } from 'react-i18next';
import TabsPage from 'components/custom/TabsPage';
import PropTypes from 'prop-types';

const AdminTabsPage = ({ userUID, basePath, tabsConfig = [] }) => {
  const { t } = useTranslation();

  const tabs = tabsConfig.map((tabConfig) => ({
    id: randomId(),
    title: Array.isArray(tabConfig.titleKeys)
      ? tabConfig.titleKeys.map((key) => t(key)).join(' ')
      : t(tabConfig.titleKey),
    path: `${basePath}/${userUID}/tab/${tabConfig.path}`,
    icon: tabConfig.icon
  }));

  return <TabsPage tabs={tabs} />;
};

AdminTabsPage.propTypes = {
  userUID: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
  tabsConfig: PropTypes.arrayOf(
    PropTypes.shape({
      titleKey: PropTypes.string,
      titleKeys: PropTypes.arrayOf(PropTypes.string),
      path: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired
    })
  ).isRequired
};

export default AdminTabsPage;
