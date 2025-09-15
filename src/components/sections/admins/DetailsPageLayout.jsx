import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import PropTypes from 'prop-types';

const DetailsPageLayout = ({ pageTitle, breadcrumbItems, children }) => {
  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {pageTitle}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItems} className="max-sm:hidden" />
        </div>
        <div className="col-span-12 sm:col-span-8 lg:col-span-9">{children}</div>
      </div>
    </Page>
  );
};

DetailsPageLayout.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  breadcrumbItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string
    })
  ).isRequired,
  children: PropTypes.node.isRequired
};

export default DetailsPageLayout;
