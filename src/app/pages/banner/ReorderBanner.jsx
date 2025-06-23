import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import Table from 'components/custom/DragAndDrop';
import { Button, Card, Circlebar } from 'components/ui';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useNavigate } from 'react-router';
import BannerService from 'services/banner.services';
import { Page } from 'components/shared/Page';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

export default function ReorderBanner() {
  const [bannerList, setBannerList] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  const { t } = useTranslation();

  const columns = [
    { accessorKey: 'draggable', header: 'Drag' },
    { accessorKey: 'bannerId', header: 'Banner ID ' },
    { accessorKey: 'bannerName', header: 'Banner Name' }
  ];

  const breadcrumbItem = [
    { title: t('banner'), path: '/content-management/banner' },
    { title: t('reorder') }
  ];

  const fetchBannerList = async () => {
    console.log('fetchBannerList');

    const result = await BannerService.getBannerList({ isPaginationRequired: false, filters: {} });

    console.log('result: ', result);

    if (result && result.status === 200) {
      const apiData = result.response.data;

      const data = apiData.map((data) => {
        return {
          id: data.DisplayOrder,
          order: data.DisplayOrder,
          bannerId: data.BannerID,
          bannerName: data.BannerName
        };
      });
      setBannerList(data);
      return {
        status: 200,
        data: apiData,
        totalRecords: parseInt(result?.response?.totalRecords)
      };
    }
    return { status: result.status, error: result.error };
  };

  if (!submitLoading && !submitError && submitResponse) {
    toast.success(submitResponse);
    setSubmitResponse('');
    navigate('/content-management/banner');
  }
  if (!submitLoading && submitError) {
    toast.error(submitError);
    setSubmitError('');
  }

  const updateBannerReorder = async () => {
    try {
      setSubmitLoading(true);
      console.log('updatedData: ', updatedData);

      const result = await BannerService.reorderBanner(updatedData);

      if (result.status === 200) {
        setSubmitResponse(result.response.message);
      } else {
        setSubmitError(result.error);
      }
    } catch (error) {
      console.log('error::> ', error);
    }

    setSubmitLoading(false);
  };

  useEffect(() => {
    fetchBannerList();
  }, [submitResponse]);

  return (
    <Page title={t('reorder') + ' ' + t('banner')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('reorder') + ' ' + t('banner')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>
        <Card className={clsx('relative flex grow flex-col')}>
          <Table
            data={bannerList}
            setData={(oldData, active, over) => {
              const oldIndex = oldData.findIndex((row) => row.id === active.id);
              const newIndex = oldData.findIndex((row) => row.id === over.id);

              if (oldIndex !== -1 && newIndex !== -1) {
                const newData = arrayMove(oldData, oldIndex, newIndex);

                let order = 0;
                const updatedData = [];
                for (let data of newData) {
                  updatedData.push({
                    bannerId: data.bannerId,
                    orderNumber: order + 1
                  });
                  order++;
                }
                setBannerList(newData);

                setUpdatedData(updatedData);
              }
            }}
            columns={columns}
          />

          {!submitLoading && (
            <div className="flex justify-center">
              <Button
                type="button"
                className="ml-6 mt-4"
                color="primary"
                disabled={!updatedData || updatedData.length === 0}
                onClick={updateBannerReorder}>
                {t('submit')}
              </Button>
            </div>
          )}
          {submitLoading && (
            <div className="mt-4 flex justify-center">
              <Circlebar size={8} strokeWidth={8} color="primary" isIndeterminate />
            </div>
          )}
        </Card>
      </div>
    </Page>
  );
}
