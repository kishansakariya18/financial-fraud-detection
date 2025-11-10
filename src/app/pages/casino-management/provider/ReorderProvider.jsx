import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import Table from 'components/custom/DragAndDrop';
import { Button, Circlebar } from 'components/ui';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import ProviderService from 'services/provider.services';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

const columns = [
  { accessorKey: 'draggable', header: '' },
  { accessorKey: 'providerId', header: 'Provider ID' },
  { accessorKey: 'oldOrder', header: 'Old Order Number' },
  {
    accessorKey: 'order',
    header: 'New Order Number',
    cell: ({ getValue }) => (
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-dark-600 dark:text-dark-100">
        {getValue()}
      </span>
    )
  },
  {
    accessorKey: 'providerName',
    header: 'Provider Name',
    cell: ({ getValue }) => (
      <span className="text-sm font-medium text-gray-800 dark:text-dark-50">{getValue()}</span>
    )
  }
];

export default function ReorderProvider() {
  const [providerList, setProviderList] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('casino_provider'), path: '/casino/provider/list' },
    { title: t('reorder') }
  ];

  const mapProviders = (apiData) => {
    if (!Array.isArray(apiData)) return [];

    return apiData
      .map((item, index) => {
        const providerId = item?.ProviderID ?? item?.providerId ?? index + 1;
        const displayOrder =
          item?.DisplayOrder ?? item?.OrderNumber ?? item?.orderNumber ?? index + 1;

        return {
          id: providerId,
          providerId,
          providerName: item?.Name ?? item?.providerName ?? '',
          oldOrder: item?.DisplayOrder ?? '-',
          order: typeof displayOrder === 'number' ? displayOrder : index + 1
        };
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item, index) => ({
        ...item,
        order: index + 1,
        providerName: item?.Name || item?.providerName || `${t('casino_provider')} ${index + 1}`
      }));
  };

  const fetchProviderList = async () => {
    try {
      const result = await ProviderService.getAllProviders();

      if (result?.status === 200) {
        const apiData = result?.response?.data ?? [];
        const mapped = mapProviders(apiData);
        setProviderList(mapped);
        setUpdatedData([]);
      } else if (result?.error) {
        setSubmitError(result.error);
      }
    } catch (error) {
      setSubmitError(error?.message || String(error));
    }
  };

  useEffect(() => {
    fetchProviderList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (submitResponse) {
      fetchProviderList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitResponse]);

  useEffect(() => {
    if (!submitLoading && submitError) {
      toast.error(submitError);
      setSubmitError(null);
    }
  }, [submitLoading, submitError]);

  useEffect(() => {
    if (!submitLoading && submitResponse) {
      toast.success(submitResponse);
      setSubmitResponse(null);
      navigate('/casino/provider/list');
    }
  }, [submitLoading, submitResponse, navigate]);

  const handleSaveOrder = async () => {
    if (!updatedData.length) return;

    try {
      setSubmitLoading(true);
      const result = await ProviderService.reorderProviders(updatedData);

      if (result?.status === 200) {
        setSubmitResponse(result?.response?.message || 'Order updated successfully');
      } else {
        setSubmitError(result?.error || 'Something went wrong');
      }
    } catch (error) {
      setSubmitError(error?.message || String(error));
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <ContentWrapper
      pageTitle={t('reorder') + ' ' + t('casino_provider')}
      title={t('reorder') + ' ' + t('casino_provider')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('reorder') + ' ' + t('casino_provider')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <div className="flex grow flex-col">
          <Table
            className="mx-auto w-full max-w-full"
            data={providerList}
            setData={(oldData, active, over) => {
              const oldIndex = oldData.findIndex((row) => row.id === active.id);
              const newIndex = oldData.findIndex((row) => row.id === over.id);

              if (oldIndex !== -1 && newIndex !== -1) {
                const reordered = arrayMove(oldData, oldIndex, newIndex);

                const normalized = reordered.map((item, index) => ({
                  ...item,
                  order: index + 1
                }));

                const nextOrder = normalized.map((item, index) => ({
                  providerId: item.providerId,
                  orderNumber: index + 1
                }));

                setProviderList(normalized);
                setUpdatedData(nextOrder);
              }
            }}
            columns={columns}
          />
        </div>

        <div className="pointer-events-none sticky bottom-4 z-30 flex justify-center px-[--margin-x]">
          <div className="pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur dark:border-dark-600 dark:bg-dark-800/95">
            <div className="text-xs text-gray-500 dark:text-dark-200">
              {updatedData.length > 0 && !submitLoading
                ? t('unsaved_changes_notice')
                : t('drag_to_reorder_hint')}
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                color="secondary"
                size="sm"
                disabled={submitLoading || updatedData.length === 0}
                onClick={() => fetchProviderList()}>
                {t('reset')}
              </Button>
              <Button
                type="button"
                color="primary"
                disabled={submitLoading || updatedData.length === 0}
                onClick={handleSaveOrder}>
                {submitLoading ? (
                  <span className="flex items-center gap-2">
                    <Circlebar size={6} strokeWidth={6} color="primary" isIndeterminate />
                    {t('saving') || 'Saving...'}
                  </span>
                ) : (
                  t('save') + ' ' + t('changes')
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
