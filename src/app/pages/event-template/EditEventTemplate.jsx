// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { EmailInput } from 'components/custom/EmailInput';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import EventTemplateService from 'services/event-template.services';
import { emailTemplateSchema } from './schema';
import { TextEditor } from 'components/shared/form/TextEditor';
import Quill, { Delta } from 'quill';
import { Listbox } from 'components/shared/form/Listbox';
import { emailTemplateOptions, emailTemplateStatusToAPP } from './helper';
import { htmlToDelta } from 'utils/quillUtils';

const defaultValue = new Delta();

const EditEmailTemplate = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [templateTextError, setTemplateError] = useState();
  const { t } = useTranslation();
  const { templateId } = useParams();
  const [eventChannelList, setEventChannelList] = useState([]);
  const [eventGroupList, setEventGroupList] = useState([]);
  const [eventTypeList, setEventTypeList] = useState([]);
  const [currentChannelCode, setCurrentChannelCode] = useState('');
  const [eventTypeReplacerKeywords, setEventTypeReplacerKeywords] = useState([]);
  const [templateData, setTemplateData] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(emailTemplateSchema),
    defaultValues: {
      to: [],
      cc: [],
      bcc: []
    }
  });
  // Watchers
  const selectedGroup = watch('group');
  const selectedEventType = watch('eventType');
  const breadcrumbItem = [
    { title: t('eventTemplate'), path: '/event-template/list' },
    { title: t('edit') }
  ];

  const navigate = useNavigate();

  const [content, setContent] = useState(defaultValue);
  const editorRef = useRef(null);
  const [cursorIndex, setCursorIndex] = useState(null);
  const subjectRef = useRef(null);
  const [subjectCursorIndex, setSubjectCursorIndex] = useState(null);
  const [lastActiveField, setLastActiveField] = useState('editor');

  console.log('cursorIndex: ', cursorIndex);

  const handleChange = (val) => {
    setContent(val);
    const quill = new Quill(document.createElement('div'));
    quill.setContents(val);
    const html = quill.root.innerHTML;
    setHtmlContent(html);
    const plainText = html.replace(/<(.|\n)*?>/g, '').trim();
    if (plainText) {
      setTemplateError('');
    }
  };

  const editEmailTemplateAPI = async (requestObject) => {
    // console.log('requestObject: ', requestObject);

    setLoading(true);
    setError(null);
    const result = await EventTemplateService.eventTemplateUpdate(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };
  const fetchEmailTemplateDetails = async () => {
    try {
      const result = await EventTemplateService.eventTemplateDetail(templateId);
      if (result) {
        if (result.status === 200 || result.status === 201) {
          return result.response.data;
        } else {
          setError(result.error);
        }
      }
    } catch (error) {
      console.log('err: ', error);
      setError(error.message);
    }
  };
  const getEventMasterData = async () => {
    setLoading(true);
    setError(null);
    const result = await EventTemplateService.getEventMasterData();
    if (result) {
      if (result.status === 200 || result.status === 201) {
        const channels =
          result.response.data?.channels.map((item) => ({
            key: item.ChannelID,
            value: item.ChannelID,
            label: item.ChannelCode
          })) || [];
        setEventChannelList(channels);
        const groupList = result.response.data?.eventGroups || [];
        setEventGroupList(
          groupList?.map((item) => ({
            key: item.EventGroupID,
            value: item.EventGroupID,
            label: item.EventGroupCategory
          }))
        );
        const eventTypeReplacerKeywordsMap = {};
        const eventTypes = groupList.reduce((acc, group) => {
          acc[`group_${group.EventGroupID}`] = group.eventTypes.map((type) => ({
            EventTypeID: type.EventTypeID,
            Name: type.Name,
            label: type.Name,
            value: type.EventTypeID
          }));
          for (const type of group.eventTypes) {
            eventTypeReplacerKeywordsMap[`event_type_${type.EventTypeID}`] = type.templateVariables;
          }
          return acc;
        }, {});

        setEventTypeReplacerKeywords(eventTypeReplacerKeywordsMap);
        setEventTypeList(eventTypes);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    if (templateId) {
      const fetchData = async () => {
        setLoading(true);
        const data = await fetchEmailTemplateDetails();
        if (data) {
          setTemplateData(data);
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [templateId]);
  useEffect(() => {
    getEventMasterData();
  }, []);
  useEffect(() => {
    if (templateData && eventGroupList.length && eventChannelList.length) {
      const mappedData = {
        title: templateData?.Title,
        slug: templateData?.Slug,
        heading: templateData?.Subject,
        cc: templateData?.CC || [],
        bcc: templateData?.BCC || [],
        group: templateData?.EventGroupID || null,
        eventType: templateData?.EventTypeID || null,
        channel: templateData?.ChannelID || null,
        to: templateData?.ToRecipients || [],
        status: emailTemplateStatusToAPP(templateData.IsActive)
      };
      setCurrentChannelCode(templateData.channel.ChannelCode);
      const delta = htmlToDelta(templateData?.Body);
      setHtmlContent(templateData?.Body || '');
      setContent(delta);

      reset(mappedData);
    }
  }, [templateData, eventGroupList, eventChannelList, reset]);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  if (!loading && !error && response) {
    toast.success(response.message);
    navigate('/event-template/list');
    setResponse(null);
    // fetchEmailTemplateDetails();
  }
  const eventTypesForSelectedGroup = selectedGroup
    ? eventTypeList[`group_${selectedGroup}`] || []
    : [];
  const keywordsForSelectedType =
    eventTypeReplacerKeywords[`event_type_${selectedEventType}`] || [];
  const handleReset = () => {
    // Reset the editor content
    setContent(defaultValue);
    setHtmlContent('');
    setTemplateError('');

    // Re-fetch the original template data
    if (templateId) {
      const mappedData = {
        title: templateData?.Title,
        slug: templateData?.Slug,
        heading: templateData?.Subject,
        cc: templateData?.CC || [],
        bcc: templateData?.BCC || [],
        group: templateData?.EventGroupID || null,
        eventType: templateData?.EventTypeID || null,
        channel: templateData?.ChannelID || null,
        to: templateData?.ToRecipients || [],
        status: emailTemplateStatusToAPP(templateData.IsActive)
      };

      const delta = htmlToDelta(templateData?.Body);
      setHtmlContent(templateData?.Body || '');
      setContent(delta);

      reset(mappedData);
    }
  };
  const insertKeyword = (keyword) => {
    const textToInsert = keyword.VariableCode + ' ';

    if (lastActiveField === 'subject' && subjectRef.current) {
      const input = subjectRef.current;
      const value = input.value || '';

      const basePos =
        typeof subjectCursorIndex === 'number'
          ? subjectCursorIndex
          : typeof input.selectionEnd === 'number'
            ? input.selectionEnd
            : value.length;

      const newValue = value.slice(0, basePos) + textToInsert + value.slice(basePos);

      setValue('heading', newValue, { shouldDirty: true });

      const caretPos = basePos + textToInsert.length;
      setSubjectCursorIndex(caretPos);
      requestAnimationFrame(() => {
        if (subjectRef.current) {
          subjectRef.current.focus();
          subjectRef.current.setSelectionRange(caretPos, caretPos);
        }
      });

      return;
    }

    const quillInstance = editorRef.current?.getQuillInstance();
    if (!quillInstance) return;

    const selection = quillInstance.getSelection();
    const index =
      selection && typeof selection.index === 'number'
        ? selection.index
        : typeof cursorIndex === 'number'
          ? cursorIndex
          : quillInstance.getLength();

    quillInstance.insertText(index, textToInsert, 'user');
    quillInstance.setSelection(index + textToInsert.length, 0, 'user');
  };
  const onSubmit = async (data) => {
    if (+content.ops.length === 0) {
      setTemplateError('Template content is required');
      return;
    }

    const requestData = {
      ...data,
      bcc: currentChannelCode === 'EMAIL' ? data.bcc : [],
      cc: currentChannelCode === 'EMAIL' ? data.cc : [],
      to: currentChannelCode === 'EMAIL' ? data.to : [],
      template: htmlContent,
      templateID: templateId
    };

    await editEmailTemplateAPI(requestData);
  };
  return (
    <Page title={t('edit') + ' ' + t('eventTemplate')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('edit') + ' ' + t('eventTemplate') + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    key={'group'}
                    data={eventGroupList}
                    value={eventGroupList.find((group) => group.value === field.value) || null}
                    onChange={(val) => {
                      field.onChange(val.value);
                      const delta = htmlToDelta('');
                      setHtmlContent('');
                      setContent(delta);
                      // Reset the eventType field when the group changes
                      if (val.value !== selectedGroup) {
                        setValue('eventType', null);
                      }
                    }}
                    name={field.name}
                    label={t('event') + ' ' + t('group')}
                    placeholder={t('select') + ' ' + t('event') + ' ' + t('group')}
                    displayField="label"
                    error={errors?.group?.message}
                  />
                )}
                control={control}
                name="group"
              />

              <Controller
                name="eventType"
                control={control}
                render={({ field }) => {
                  console.log(
                    'cond',
                    eventTypesForSelectedGroup.find((type) => type.EventTypeID === field.value)
                      ?.EventTypeID
                  );

                  return (
                    <Listbox
                      key="eventType"
                      data={eventTypesForSelectedGroup.map((item) => ({
                        value: item.EventTypeID,
                        label: item.Name,
                        key: item.EventTypeID
                      }))}
                      value={
                        eventTypesForSelectedGroup.find((type) => type.value === field.value) ||
                        null
                      }
                      onChange={(val) => field.onChange(val.value)}
                      name={field.name}
                      label={t('event') + ' ' + t('type')}
                      placeholder={t('select') + ' ' + t('event') + ' ' + t('type')}
                      displayField="label"
                      error={errors?.eventType?.message}
                      disabled={!selectedGroup} // Disable until group selected
                    />
                  );
                }}
              />

              <Controller
                render={({ field }) => (
                  <Listbox
                    key={'channel'}
                    data={eventChannelList}
                    value={
                      eventChannelList.find((channel) => channel.value === field.value) || null
                    }
                    onChange={(val) => {
                      field.onChange(val.value);
                      setCurrentChannelCode(val.label);
                    }}
                    name={field.name}
                    label={t('event') + ' ' + t('channel')}
                    placeholder={t('select') + ' ' + t('event') + ' ' + t('channel')}
                    displayField="label"
                    error={errors?.channel?.message}
                  />
                )}
                control={control}
                name="channel"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                key={'title'}
                {...register('title')}
                label={t('title')}
                error={errors?.title?.message}
                placeholder={t('enter') + ' ' + t('title')}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-1">
              <Controller
                name="heading"
                control={control}
                render={({ field }) => (
                  <Input
                    key={'heading'}
                    {...field}
                    ref={subjectRef}
                    label={t('subject')}
                    error={errors?.heading?.message}
                    placeholder={t('enter') + ' ' + t('subject')}
                    onFocus={(e) => {
                      setLastActiveField('subject');
                      field.onFocus && field.onFocus(e);
                    }}
                    onSelect={(e) => {
                      setSubjectCursorIndex(e.target.selectionStart);
                      setLastActiveField('subject');
                    }}
                    onClick={(e) => {
                      setSubjectCursorIndex(e.target.selectionStart ?? e.target.value.length);
                      setLastActiveField('subject');
                    }}
                    onChange={(e) => {
                      setSubjectCursorIndex(e.target.selectionStart ?? e.target.value.length);
                      setLastActiveField('subject');
                      field.onChange(e);
                    }}
                  />
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-1">
              <div className="mt-1 max-w-xl">
                {selectedEventType && keywordsForSelectedType.length > 0 && (
                  <div className="my-3 rounded-lg border border-gray-200 p-4 shadow-sm dark:border-dark-600 dark:bg-dark-700">
                    <h4 className="mb-3 font-semibold text-gray-700 dark:text-gray-200">
                      {t('availableKeywords')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {keywordsForSelectedType.map((keyword, idx) => (
                        <Button
                          key={idx}
                          type="button"
                          variant="outline"
                          className="bg-gray-100 text-gray-800 transition-colors hover:bg-primary-100 dark:hover:bg-primary-900"
                          size="sm"
                          onClick={() => insertKeyword(keyword)}>
                          {keyword.VariableCode}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                <TextEditor
                  key={'template'}
                  ref={editorRef}
                  value={content}
                  label={t('template')}
                  onChange={handleChange}
                  onSelectionChange={(range) => {
                    if (range) {
                      setCursorIndex(range.index);
                      setLastActiveField('editor');
                    }
                  }}
                  placeholder={
                    t('enter') + ' ' + t('your') + ' ' + t('content') + ' ' + t('here') + '...'
                  }
                  error={templateTextError ? templateTextError : undefined}
                />
              </div>
            </div>

            {currentChannelCode === 'EMAIL' && (
              <div className="grid gap-4 sm:grid-cols-1">
                <Controller
                  name="to"
                  control={control}
                  render={({ field }) => (
                    <EmailInput
                      value={field.value}
                      onChange={field.onChange}
                      label={t('to')}
                      error={errors?.to?.message}
                      placeholder={t('enter') + ' ' + t('to')}
                    />
                  )}
                />
                <Controller
                  name="cc"
                  control={control}
                  render={({ field }) => (
                    <EmailInput
                      value={field.value}
                      onChange={field.onChange}
                      label={'CC'}
                      error={errors?.cc?.message}
                      placeholder={t('enter') + ' ' + 'CC'}
                    />
                  )}
                />
                <Controller
                  name="bcc"
                  control={control}
                  render={({ field }) => (
                    <EmailInput
                      value={field.value}
                      onChange={field.onChange}
                      label={'BCC'}
                      error={errors?.bcc?.message}
                      placeholder={t('enter') + ' ' + 'BCC'}
                    />
                  )}
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                render={({ field }) => (
                  <Listbox
                    key={'status'}
                    data={emailTemplateOptions}
                    value={
                      emailTemplateOptions.find((status) => status.value === field.value) || null
                    }
                    onChange={(val) => field.onChange(val.value)}
                    name={field.name}
                    label={t('status')}
                    placeholder={t('select') + ' ' + t('status')}
                    displayField="label"
                    error={errors?.status?.message}
                  />
                )}
                control={control}
                name="status"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            <Button type="button" className="min-w-[7rem]" onClick={handleReset} disabled={loading}>
              {t('reset')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('update')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default EditEmailTemplate;
