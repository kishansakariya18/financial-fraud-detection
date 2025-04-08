// Import Dependencies
import clsx from 'clsx';

// Local Imports
import { Page } from 'components/shared/Page';

const ContentWrapper = ({
  pageTitle = '',
  enableFullScreen,
  children,
  isTable = true,
  title = ''
}) => {
  return (
    <>
      {isTable ? (
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
      ) : (
        <Page title={pageTitle}>
          <div className="transition-content w-full pb-5">
            <div
              className={clsx(
                'flex h-full w-full flex-col',
                enableFullScreen && 'fixed inset-0 z-[61] bg-white pt-3 dark:bg-dark-900'
              )}>
              <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
                <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
                  <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
                    {title}
                  </h2>
                </div>
                {children}
              </div>
            </div>
          </div>
        </Page>
      )}
    </>
  );
};

export default ContentWrapper;
