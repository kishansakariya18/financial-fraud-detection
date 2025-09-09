// Import Dependencies
import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input } from 'components/ui';
import { EmailInput } from 'components/custom/EmailInput';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import EventTemplateService from 'services/event-template.services';
import { emailTemplateSchema } from './schema';
import { TextEditor } from 'components/shared/form/TextEditor';
import Quill, { Delta } from 'quill';
import { Listbox } from 'components/shared/form/Listbox';
import { emailTemplateOptions } from './helper';
import { stringToSlug } from 'utils/stringToSlug';
const defaultValue = new Delta();

const CreateEventTemplate = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [templateTextError, setTemplateError] = useState();
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('eventTemplate'), path: '/event-template' },
    { title: t('create') }
  ];

  const navigate = useNavigate();
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
  const channelType = watch('channel');

  const [content, setContent] = useState(defaultValue);
  const [eventChannelList, setEventChannelList] = useState([]);
  const [eventGroupList, setEventGroupList] = useState([]);
  const [eventTypeList, setEventTypeList] = useState([]);
  const [eventTypeReplacerKeywords, setEventTypeReplacerKeywords] = useState([]);
  const title = watch('title');
  console.log('eventGroupList::', eventGroupList);
  console.log('eventChannelList::', eventChannelList);
  console.log('eventTypeList::', eventTypeList);
  console.log('eventTypeReplacerKeywords::', eventTypeReplacerKeywords);

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

  const createEventTemplateAPI = async (requestObject) => {
    console.log('requestObject:::::', requestObject);

    setLoading(true);
    setError(null);
    const result = await EventTemplateService.eventTemplateSubmit(requestObject);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        setResponse(result.response);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
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
        console.log('eventTypes:', eventTypes);

        setEventTypeReplacerKeywords(eventTypeReplacerKeywordsMap);
        setEventTypeList(eventTypes);
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
    getEventMasterData();
  }, []);
  console.log('!loading && !error && response', loading, error, response);

  if (!loading && !error && response) {
    toast.success(response.message);
    setTimeout(() => {
      navigate('/event-template');
    }, 0);

    setResponse(null);
  }
  const eventTypesForSelectedGroup = selectedGroup
    ? eventTypeList[`group_${selectedGroup}`] || []
    : [];
  const keywordsForSelectedType =
    eventTypeReplacerKeywords[`event_type_${selectedEventType}`] || [];
  const insertKeyword = (keyword) => {
    // Use a temporary Quill instance to get the new Delta
    const tempQuill = new Quill(document.createElement('div'));
    tempQuill.setContents(content);

    // Get the length of the current content
    const length = tempQuill.getLength();

    // Insert the keyword at the end of the content
    // The 'user' source is recommended for this type of programmatic change
    tempQuill.insertText(length - 1, ' ' + keyword.VariableCode + ' ');

    // Get the new Delta from the temporary Quill instance
    const newDelta = tempQuill.getContents();

    // Update the state
    setContent(newDelta);
    setHtmlContent(tempQuill.root.innerHTML);
  };

  const handleReset = () => {
    reset({
      to: [],
      cc: [],
      bcc: [],
      title: '',
      heading: '',
      status: '',
      eventType: '',
      group: '',
      channel: ''
    });
    setContent(defaultValue);
    setHtmlContent('');
    setTemplateError('');
  };

  console.log('selectedGroup:', selectedGroup);
  console.log('channelType:', channelType);
  console.log('eventTypesForSelectedGroup:', eventTypesForSelectedGroup);
  const onSubmit = async (data) => {
    const contentHTML = htmlContent?.replace(/<(.|\n)*?>/g, '').trim(); // Strip HTML tags

    if (!contentHTML) {
      setTemplateError('Template content is required');
      return;
    }

    // Send arrays directly to backend
    const requestData = {
      ...data,
      slug: stringToSlug(title),
      template: htmlContent
    };

    await createEventTemplateAPI(requestData);
  };
  console.log('selectedEventType', selectedEventType);
  console.log('keywordsForSelectedType', keywordsForSelectedType);

  return (
    <Page title={t('create') + ' ' + t('eventTemplate')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('eventTemplate') + ' ' + t('form')}
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
                    onChange={(val) => field.onChange(val.value)}
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
              <Input
                key={'heading'}
                {...register('heading')}
                label={t('heading')}
                error={errors?.heading?.message}
                placeholder={t('enter') + ' ' + t('heading')}
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
                  value={content}
                  label={t('template')}
                  onChange={handleChange}
                  placeholder={
                    t('enter') + ' ' + t('your') + ' ' + t('content') + ' ' + t('here') + '...'
                  }
                  error={templateTextError && templateTextError}
                  className="[&_.ql-editor]:max-h-80 [&_.ql-editor]:min-h-[12rem]"
                />
              </div>
            </div>

            {channelType === 1 && (
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
            <Button className="min-w-[7rem]" onClick={() => handleReset()} disabled={loading}>
              {t('reset')}
            </Button>
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={loading}>
              {t('create')}
            </Button>
          </div>
        </form>
      </div>
    </Page>
  );
};

export default CreateEventTemplate;
