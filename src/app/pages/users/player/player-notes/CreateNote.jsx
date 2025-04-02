// Import Dependencies
import { useForm } from 'react-hook-form';
import { Button, Checkbox } from 'components/ui';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import PlayerService from 'services/player.services';
import Quill from 'quill'; // Ensure Quill is imported

import { useParams } from 'react-router';
import { Delta, TextEditor } from 'components/shared/form/TextEditor';
const defaultValue = new Delta();

const CreateNote = ({ onClose = () => {} }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');

  const { playerId } = useParams();
  const { t } = useTranslation();

  console.log('open: ', open);
  console.log('close: ', close);

  const { handleSubmit, reset, register } = useForm({});
  const [content, setContent] = useState(defaultValue);

  const handleChange = (val) => {
    setContent(val);
    const quill = new Quill(document.createElement('div')); // Temporary Quill instance
    quill.setContents(val);
    setHtmlContent(quill.root.innerHTML);
  };

  const createNoteAPI = async (requestObject) => {
    setLoading(true);
    setError(null);
    const result = await PlayerService.addPlayerNote({
      ...requestObject,
      playerId
    });
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
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

  if (!loading && !error && response) {
    console.log('use effect called');
    toast.success(response.message);
    setResponse(null);
    setContent(defaultValue);
    onClose();
    reset();
  }

  const onSubmit = async (data) => {
    await createNoteAPI({ ...data, note: htmlContent });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
      <div className="mt-2 space-y-4">
        <div className="max-w-xl">
          <TextEditor
            label={t('enter') + ' ' + t('note') + ' ' + t('here') + '...'}
            value={content}
            onChange={handleChange}
            placeholder={
              t('enter') + ' ' + t('your') + ' ' + t('content') + ' ' + t('here') + '...'
            }
          />
          <div className="border bg-gray-100 p-2"></div>
        </div>

        <Checkbox label={t('pin') + ' ' + t('note')} {...register('isPinned')} />
      </div>

      <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
        <Button className="min-w-[7rem]" onClick={() => reset()} disabled={loading}>
          {t('reset')}
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
          {t('add')}
        </Button>
      </div>
    </form>
  );
};

export default CreateNote;
