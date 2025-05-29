import { DEFAULT_PER_PAGE_RECORD } from 'constants/app.constant';
import { arrayMove } from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import HomePageService from 'services/home-page.services';
import Table from 'components/custom/DragAndDrop';
import { Button, Card, Circlebar } from 'components/ui';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import ContentWrapper from 'components/ui/custom/ContentWrapper';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router';

export default function ReOrderGames() {
  const [gameList, setGameList] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const navigate = useNavigate();

  const { t } = useTranslation();

  const { homeCategoryId } = useParams();

  const columns = [
    { accessorKey: 'draggable', header: 'Drag' },
    { accessorKey: 'homeGameId', header: 'Home Game ID ' },
    { accessorKey: 'gameName', header: 'Game Name' }
  ];

  const fetchHomeGameList = async () => {
    const result = await HomePageService.getHomeGames({
      homeCategoryId,
      filters: {},
      pagination: {
        pageIndex: 0,
        pageSize: 20
      }
    });

    if (result && result.status === 200) {
      const apiData = result.response.data;

      const data = apiData.map((data) => {
        return {
          id: data.homeGame.OrderNumber,
          order: data.homeGame.OrderNumber,
          homeGameId: data.homeGame.HomePageGameID,
          gameName: data.Name
        };
      });
      setGameList(data);
      return {
        status: 200,
        data: apiData,
        totalRecords: parseInt(result?.response?.totalRecords) || DEFAULT_PER_PAGE_RECORD
      };
    }
    return { status: result.status, error: result.error };
  };

  if (!submitLoading && !submitError && submitResponse) {
    toast.success(submitResponse);

    setTimeout(() => {
      setSubmitResponse('');
      navigate(`/home-games/${homeCategoryId}/list`);
    }, 0);
  }
  if (!submitLoading && submitError) {
    toast.error(submitError);
    setSubmitError('');
  }

  const updateHomeCategoryData = async () => {
    try {
      setSubmitLoading(true);
      const result = await HomePageService.reorderGames({ updatedGames: updatedData });

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
    fetchHomeGameList();
  }, [submitResponse]);

  return (
    <ContentWrapper
      pageTitle={t('reorder') + ' ' + t('games')}
      title={t('reorder') + ' ' + t('games')}
      enableFullScreen={false}>
      <Card className={clsx('relative flex grow flex-col')}>
        <Table
          data={gameList}
          setData={(oldData, active, over) => {
            const oldIndex = oldData.findIndex((row) => row.id === active.id);
            const newIndex = oldData.findIndex((row) => row.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
              const newData = arrayMove(oldData, oldIndex, newIndex);

              let order = 0;
              const updatedData = [];
              for (let data of newData) {
                updatedData.push({
                  homeGameId: data.homeGameId,
                  orderNumber: order + 1
                });
                order++;
              }

              setTimeout(() => {
                setGameList(newData);
                setUpdatedData(updatedData);
              }, 0);
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
