import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import HomePageService from 'services/home-page.services';
import Table from 'components/custom/DragAndDrop';
import { Button, Card, Circlebar } from 'components/ui';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import clsx from 'clsx';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';

export default function ReOrderCategory() {
  const [categoryList, setCategoryList] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  const { t } = useTranslation();

  const pageTitle = t('reorder') + ' ' + t('category');

  const breadcrumbItems = [
    { title: t('homeCategory') + ' ' + t('list'), path: '/web/home-category' },
    { title: pageTitle }
  ];

  const columns = [
    { accessorKey: 'draggable', header: 'Drag' },
    { accessorKey: 'homeCategoryId', header: 'Home Category ID ' },
    { accessorKey: 'category', header: 'Category' }
  ];

  const fetchHomeCategoryList = async () => {
    const result = await HomePageService.getHomeCategories({
      filters: {
        status: 'active'
      },
      pagination: {
        pageIndex: 0,
        pageSize: 20
      }
    });

    if (result && result.status === 200) {
      const apiData = result.response.data;

      const data = apiData.map((data) => {
        return {
          id: data.OrderNumber,
          order: data.OrderNumber,
          homeCategoryId: data.HomePageCategoryID,
          category: data.category.Name
        };
      });
      setCategoryList(data);
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
    navigate('/web/home-category');
  }
  if (!submitLoading && submitError) {
    toast.error(submitError);
    setSubmitError('');
  }

  const updateHomeCategoryData = async () => {
    try {
      setSubmitLoading(true);
      const result = await HomePageService.reorderCategory({ updatedCategories: updatedData });

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
    fetchHomeCategoryList();
  }, [submitResponse]);

  return (
    <ContentWrapper pageTitle={pageTitle} title={pageTitle} enableFullScreen={false}>
      <Card className={clsx('relative flex grow flex-col')}>
        <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-4 pt-4">
          <div className="flex items-center space-x-4 lg:py-2 rtl:space-x-reverse">
            <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
              {pageTitle}
            </h2>
            <div className="hidden self-stretch py-1 sm:flex">
              <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
            </div>
            <Breadcrumbs items={breadcrumbItems} className="max-sm:hidden" />
          </div>
        </div>
        <Table
          data={categoryList}
          setData={(oldData, active, over) => {
            const oldIndex = oldData.findIndex((row) => row.id === active.id);
            const newIndex = oldData.findIndex((row) => row.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
              const newData = arrayMove(oldData, oldIndex, newIndex);

              let order = 0;
              const updatedData = [];
              for (let data of newData) {
                updatedData.push({
                  HomePageCategoryID: data.homeCategoryId,
                  OrderNumber: order + 1
                });
                order++;
              }
              setCategoryList(newData);

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
              onClick={updateHomeCategoryData}>
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
    </ContentWrapper>
  );
}
