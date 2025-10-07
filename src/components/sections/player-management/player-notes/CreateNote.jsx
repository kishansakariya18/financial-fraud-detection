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

  const { handleSubmit, reset, register } = useForm({});
  const [content, setContent] = useState(defaultValue);
  const [textError, setTextError] = useState('');
  const [initialValues] = useState({
    isPinned: false
  });

  const handleReset = () => {
    reset(initialValues);
    setContent(defaultValue);
    setHtmlContent('');
    setTextError('');
    setError('');
  };

  const handleChange = (val) => {
    setContent(val);
    const quill = new Quill(document.createElement('div')); // Temporary Quill instance
    quill.setContents(val);
    const html = quill.root.innerHTML;
    setHtmlContent(html);
    const plainText = html.replace(/<(.|\n)*?>/g, '').trim();
    if (plainText) {
      setTextError('');
    }
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
    toast.success(response.message);
    setResponse(null);
    handleReset();
    onClose();
  }

  const onSubmit = async (data) => {
    const contentHTML = htmlContent?.replace(/<(.|\n)*?>/g, '').trim(); // Strip HTML tags

    if (!contentHTML) {
      setTextError('Note Content is required');
      return;
    }
    await createNoteAPI({ ...data, note: htmlContent });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
      <div className="mt-2 space-y-4">
        <div className="max-w-xl">
          <TextEditor
            value={content}
            onChange={handleChange}
            placeholder={
              t('enter') + ' ' + t('your') + ' ' + t('content') + ' ' + t('here') + '...'
            }
            error={textError && textError}
          />
          <div className="border bg-gray-100 p-2"></div>
        </div>

        <Checkbox label={t('pin') + ' ' + t('note')} {...register('isPinned')} />
      </div>

      <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
        <Button type="button" className="min-w-[7rem]" onClick={handleReset} disabled={loading}>
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
