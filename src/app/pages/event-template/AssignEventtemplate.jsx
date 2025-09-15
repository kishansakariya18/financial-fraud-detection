import { useEffect, useState } from 'react';
// import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import EventTemplateService from '../../../services/event-template.services';

import { Controller, useForm } from 'react-hook-form';
import { Listbox } from 'components/shared/form/Listbox';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { Page } from 'components/shared/Page';
// import { Card } from 'components/ui';
import { toast } from 'sonner';

const AssignEventToGroup = () => {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [eventGroupList, setEventGroupList] = useState([]);
  const [eventTypeList, setEventTypeList] = useState({});
  const [response, setResponse] = useState(null);

  console.log('eventGroupList::', eventGroupList);
  console.log('error::', error);
  console.log('loading::', loading);
  console.log('eventTypeList::', eventTypeList);
  const {
    formState: { errors },
    control,
    watch,
    setValue
    // handleSubmit
    // reset
  } = useForm({
    defaultValues: {
      group: ''
    }
  });
  const getEventMasterList = async () => {
    setLoading(true);
    setError(null);
    const result = await EventTemplateService.getTemplateData();
    console.log('result:', result);
    if (result) {
      if (result.status === 200 || result.status === 201) {
        const channels =
          result?.response?.data?.channels.map((item) => ({
            key: item.ChannelID,
            value: item.ChannelID,
            label: item.ChannelCode
          })) || [];
        console.log('channels::', channels);

        const groupList = result.response.data?.groups || [];
        setEventGroupList(
          groupList?.map((item) => ({
            key: item.EventGroupID,
            value: item.EventGroupID,
            label: item.EventGroupCategory
          }))
        );
        setValue('group', groupList[0]?.EventGroupID);
        const eventTypes = groupList.reduce((acc, group) => {
          acc[`group_${group.EventGroupID}`] = group.eventType.map((type) => {
            // Map all group template with channel and event
            const templateMappedChannel = channels.map((channel) => {
              const templates = group.template
                .map((templateItem) => ({
                  key: templateItem.TemplateID,
                  value: templateItem.TemplateID,
                  label: templateItem.TemplateTitle,
                  channelID: templateItem.ChannelID,
                  eventTypeID: templateItem.EventTypeID
                }))
                .filter(
                  (templateItem) =>
                    templateItem.channelID === channel.key &&
                    type.EventTypeID === templateItem.eventTypeID
                );
              console.log('templates::', templates);
              // Set defalut value of template logic
              for (const assignObj of type.eventTypeChannels) {
                const assigned = templates.find(
                  (item) => +assignObj.AssignedTemplateID === +item.key
                );
                if (assigned) {
                  console.log(
                    'template event channel::',
                    `template${type.EventTypeID}${channel.key}`
                  );
                  setValue(
                    `template${type.EventTypeID}${channel.key}`,
                    assignObj.AssignedTemplateID
                  );
                }
                console.log('assigned::', assigned);
              }

              return {
                ...channel,
                templates: [
                  { key: 'defalut', value: 'default', label: 'Not selected' },
                  ...templates
                ]
              };
            });
            console.log('templateMappedChannel::', templateMappedChannel);

            // for (const assignObj of type.eventTypeChannels) {
            //   const assigned = templateMappedChannel.find(
            //     (item) => assignObj.AssignedTemplateID === item.key
            //   );
            //   console.log('assigned::', assigned);
            // }
            return {
              EventTypeID: type.EventTypeID,
              Name: type.EventCode,
              label: type.EventCode,
              value: type.EventTypeID,
              key: type.EventTypeID,
              channels: templateMappedChannel,
              assignedTemplates: type.eventTypeChannels
            };
          });

          return acc;
        }, {});
        // console.log('eventTypes:', eventTypes);

        // const initialGroupID = groupList[0]?.EventGroupID;
        // await mapTemplateData({ currencGroupID: initialGroupID, eventTypes });

        setEventTypeList(eventTypes);
      } else {
        setError(result.error);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    getEventMasterList();
  }, []);

  console.log('watch group::', watch('group'));

  const breadcrumbItem = [
    { title: t('eventTemplate'), path: '/event-template' },
    { title: t('assign') }
  ];
  const onAssign = async ({ channelID, templateID, eventTypeID }) => {
    setLoading(true);
    setError(null);
    console.log('Assigning:', { channelID, templateID, eventTypeID });

    const result = await EventTemplateService.assignEventTemplate({
      channelID,
      templateID: templateID !== 'default' ? templateID : 0,
      eventTypeID
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
  }
  return (
    <Page title={t('assign') + ' ' + t('eventTemplate')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('assign') + ' ' + t('eventTemplate') + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

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
                    //   if (val.value !== selectedGroup) {
                    //     setValue('eventType', null);
                    //   }
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
          </div>
          <div className="flex min-h-[500px] flex-1 flex-col rounded-lg bg-white p-6 shadow-sm dark:bg-dark-800">
            <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
              {t('assign') + ' ' + t('template')}
            </h3>
            <div className="flex flex-col space-y-6">
              {eventTypeList[`group_${watch('group')}`]?.map((eventType) => (
                <div
                  key={eventType.EventTypeID}
                  className="flex flex-col rounded-lg bg-gray-50 p-4 shadow-sm dark:bg-dark-800">
                  <div className="mb-4">
                    <label className="text-base font-semibold text-gray-800 dark:text-gray-200">
                      {eventType.Name}
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {eventType.channels.map((channel) => (
                      <div key={channel.key} className="flex flex-col space-y-2">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {channel.label}
                        </label>
                        <Controller
                          render={({ field }) => (
                            <select
                              {...field}
                              className="rounded-md border p-2 dark:border-dark-600 dark:bg-dark-700 dark:text-white"
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                onAssign({
                                  channelID: channel.key,
                                  templateID: e.target.value,
                                  eventTypeID: eventType.EventTypeID
                                });
                              }}>
                              {channel.templates.map((template) => (
                                <option key={template.key} value={template.value}>
                                  {template.label}
                                </option>
                              ))}
                            </select>
                          )}
                          control={control}
                          name={'template' + eventType.EventTypeID + channel.key}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="grid gap-4 sm:grid-cols-1">
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
            </div> */}

          {/* <div className="grid gap-4 sm:grid-cols-2">
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
            </div> */}
        </div>
      </div>
    </Page>
  );
};

export default AssignEventToGroup;
