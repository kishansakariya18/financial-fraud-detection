import PropTypes from 'prop-types';
import clsx from 'clsx';
import { t } from 'i18next';
import { Button, Input } from 'components/ui';
import { TableConfig } from 'components/ui/custom/TableConfig';
import { useBreakpointsContext } from 'app/contexts/breakpoint/context';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import AffiliatesService from 'services/affiliates.services';
import { TbUpload } from 'react-icons/tb';
import { useState } from 'react';
import { toast } from 'sonner';

export function Toolbar({
  keyword,
  setKeyword,
  searchParams,
  setSearchParams,
  pageTitle = '',
  table,
  affiliateId
}) {
  const { isXs } = useBreakpointsContext();
  const isFullScreenEnabled = table?.getState?.().tableSettings?.enableFullScreen ?? false;
  const [isExporting, setIsExporting] = useState(false);

  const breadcrumbItem = [
    { title: t('affiliates'), path: '/affiliates' },
    { title: t('campaign') + ' ' + t('list') }
  ];

  const handleExport = async () => {
    if (!affiliateId) return;
    try {
      setIsExporting(true);
      const res = await AffiliatesService.exportCampaignReport({ affiliateId });
      if (res.status === 200) {
        const blob = res.response;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ts = new Date()
          .toISOString()
          .replace(/[:.]/g, '-')
          .replace('T', '_')
          .replace('Z', '');
        a.download = `campaign-report-${affiliateId}-${ts}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        toast.error(res.error || 'Failed to export report');
      }
    } catch (e) {
      toast.error(e?.message || 'Unexpected error while exporting');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="table-toolbar">
      <div
        className={clsx(
          'transition-content flex items-center justify-between gap-4',
          isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x] pt-4'
        )}>
        <div>
          <div className="flex items-center space-x-3 py-5 lg:py-6 rtl:space-x-reverse">
            <h2 className="truncate text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
              {pageTitle}
            </h2>
            <div className="hidden self-stretch py-1 sm:flex">
              <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
            </div>
            <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
          </div>
        </div>
        <Button
          variant="outlined"
          className="h-8 space-x-2 rounded-md px-3 text-xs rtl:space-x-reverse"
          onClick={handleExport}
          disabled={isExporting || !affiliateId}
          title={`${t('export') + ' ' + t('report')}`}>
          <TbUpload className="size-4" />
          <span>{isExporting ? t('exporting') : t('export') + ' ' + t('report')}</span>
        </Button>
      </div>

      {isXs ? (
        <>
          <div
            className={clsx(
              'flex space-x-2 pt-4 rtl:space-x-reverse [&_.input-root]:flex-1',
              isFullScreenEnabled ? 'px-4 sm:px-5' : 'px-[--margin-x]'
            )}>
            <SearchInput
              keyword={keyword}
              setKeyword={setKeyword}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
            <TableConfig table={table} />
          </div>
          {/* No extra Filters for campaigns currently */}
        </>
      ) : (
        <div
          className={clsx(
            'custom-scrollbar transition-content flex justify-between space-x-4 overflow-x-auto pb-1 pt-4 rtl:space-x-reverse',
            isFullScreenEnabled ? 'px-[--margin-x]' : 'px-[--margin-x]'
          )}
          style={{
            '--margin-scroll': isFullScreenEnabled ? '1.25rem' : 'var(--margin-x)'
          }}>
          <div className="flex shrink-0 space-x-2 rtl:space-x-reverse">
            <SearchInput
              keyword={keyword}
              setKeyword={setKeyword}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </div>
          <TableConfig table={table} />
        </div>
      )}
    </div>
  );
}

function SearchInput({ keyword, setKeyword, searchParams, setSearchParams }) {
  return (
    <>
      <Input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setSearchParams(
              (prev) => ({
                ...Object.fromEntries(prev),
                keyword: keyword.trim(),
                pageIndex: 0
              }),
              { replace: true }
            );
          }
        }}
        classNames={{ input: 'h-8 text-xs ring-primary-500/50 focus:ring', root: 'shrink-0' }}
        placeholder={t('search') + ' ' + t('campaign_name') + ', ' + t('campaign_link') + '...'}
      />
      <Button
        onClick={() =>
          setSearchParams(
            (prev) => ({
              ...Object.fromEntries(prev),
              keyword: keyword.trim(),
              pageIndex: 0
            }),
            { replace: true }
          )
        }
        className="h-8 whitespace-nowrap px-2.5 text-xs">
        {t('search')}
      </Button>
      <Button
        onClick={() => {
          setKeyword('');
          setSearchParams(
            (prev) => {
              const next = { ...Object.fromEntries(prev), pageIndex: 0 };
              delete next.keyword;
              return next;
            },
            { replace: true }
          );
        }}
        className="h-8 whitespace-nowrap px-2.5 text-xs"
        disabled={!keyword && !(searchParams.get('keyword') || '')}>
        {t('reset') + ' ' + t('filter')}
      </Button>
    </>
  );
}

Toolbar.propTypes = {
  keyword: PropTypes.string.isRequired,
  setKeyword: PropTypes.func.isRequired,
  searchParams: PropTypes.object.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  pageTitle: PropTypes.string,
  table: PropTypes.object,
  affiliateId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
