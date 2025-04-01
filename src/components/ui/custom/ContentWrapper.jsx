// Import Dependencies
import clsx from 'clsx';

// Local Imports
import { Page } from 'components/shared/Page';

const ContentWrapper = ({ pageTitle = '', enableFullScreen, children }) => {
  return (
    <Page title={pageTitle}>
      <div className="transition-content w-full pb-5">
        <div
          className={clsx(
            'flex h-full w-full flex-col',
            enableFullScreen && 'fixed inset-0 z-[61] bg-white pt-3 dark:bg-dark-900'
          )}>
          {children}
        </div>
      </div>
    </Page>
  );
};

export default ContentWrapper;
