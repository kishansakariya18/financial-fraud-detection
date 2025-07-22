// Import Dependencies
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'components/ui';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// import { useParams } from 'react-router';
import { Listbox } from 'components/shared/form/Listbox';
import SegmentationService from 'services/segmentation.services';
import GameService from 'services/game.services';

const AddEditSegmentation = ({ onClose, gameId }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const [segmentationOptions, setSegmentationOptions] = useState([]);
  const [gameSegmentation, setGameSegmentation] = useState([]);
  const [initialSegmentation, setInitialSegmentation] = useState([]);

  const { t } = useTranslation();
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      segmentation: []
    }
  });

  const addSegmentation = async (data) => {
    setLoading(true);
    setError(null);
    console.log('Submitting segmentation: ', data.segmentation);

    const result = await GameService.addGameSegmnetation(gameId, data.segmentation);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const fetchSegmentations = async () => {
    setLoading(true);
    setError(null);
    const result = await SegmentationService.getAllSegmentationList();

    if (result) {
      if (result.status === 200 || result.status === 201) {
        const apiData = result.response.data;

        const segmentationOptions = apiData.map((data) => {
          return {
            value: data.UserSegmentID,
            label: data.Name
          };
        });

        setSegmentationOptions(segmentationOptions);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const fetchGameSegmentation = async () => {
    setLoading(true);
    setError(null);
    const result = await GameService.getGameSegmnetation(gameId);

    console.log('fetchGameSegmentation result:', result);

    if (result) {
      if (result.status === 200 || result.status === 201) {
        const apiData = result.response.data;
        const segments = apiData.segments || [];
        setGameSegmentation(segments);
        setInitialSegmentation([...segments]); // Store initial state
        setValue('segmentation', segments);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  useEffect(() => {
    fetchGameSegmentation();
    fetchSegmentations();
  }, []);

  if (!loading && !error && response) {
    toast.success(response.message);
    setResponse(null);
    onClose();
    reset();
  }

  const onSubmit = async (data) => {
    await addSegmentation(data);
  };

  const handleReset = () => {
    // Reset to initial state
    setGameSegmentation([...initialSegmentation]);
    reset({ segmentation: [...initialSegmentation] });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
      <div className="mt-2 space-y-4">
        <div className="max-w-xl">
          <Controller
            render={({ field }) => (
              <Listbox
                data={segmentationOptions}
                value={
                  segmentationOptions.filter((status) => gameSegmentation.includes(status.value)) ||
                  null
                }
                onChange={(val) => {
                  console.log(val);
                  setGameSegmentation(val.map((option) => option.value));
                }}
                name={field.name}
                multiple={true}
                label={t('segmentation')}
                placeholder={t('select') + ' ' + t('segmentation')}
                displayField="label"
                error={errors?.segmentation?.message}
              />
            )}
            control={control}
            name="segmentation"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
        <Button className="min-w-[7rem]" onClick={handleReset} disabled={loading}>
          {t('reset')}
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
          {t('add')}
        </Button>
      </div>
    </form>
  );
};

export default AddEditSegmentation;
