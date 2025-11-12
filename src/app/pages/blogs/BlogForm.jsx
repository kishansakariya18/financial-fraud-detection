import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Controller } from 'react-hook-form';
import { Combobox } from 'components/shared/form/Combobox';
import { Button, Input, Checkbox } from 'components/ui';
import { TextEditor } from 'components/shared/form/TextEditor';
import Quill, { Delta } from 'quill';
import { Upload } from 'components/ui/Form/Upload';
import RenderImage from 'components/ui/custom/ImageRender';
import { Textarea } from 'components/ui/Form/Textarea';
import { htmlToDelta } from 'utils/quillUtils';
import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import TagInput from 'components/shared/form/TagsInput';

const BlogForm = ({ form, categories = [], isEdit = false, initialImageUrl = null, onSubmit }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, formState, control, setValue, reset } = form;
  const { errors, isSubmitting } = formState;
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialImageUrl);
  const [content, setContent] = useState(new Delta([{ insert: '' }]));
  const [htmlContent, setHtmlContent] = useState('');
  const uploadRef = useRef();

  const handleChange = (val) => {
    setContent(val);
    const quill = new Quill(document.createElement('div'));
    quill.setContents(val);
    setHtmlContent(quill.root.innerHTML);
    setValue('content', quill.root.innerHTML);
  };

  // Initialize content for edit mode
  useEffect(() => {
    console.log(form.formState.defaultValues);
    if (isEdit && form.formState.defaultValues?.content) {
      const delta = htmlToDelta(form.formState.defaultValues.content);
      setContent(delta);
      setHtmlContent(form.formState.defaultValues.content);
    }
  }, [isEdit, form.formState.defaultValues]);

  const handleFormSubmit = async (data) => {
    await onSubmit(
      {
        ...data,
        content: htmlContent,
        blogCategoryIds: Array.isArray(data.blogCategoryIds)
          ? data.blogCategoryIds.filter((value) => value !== null && value !== undefined)
          : [],
        tags: data.tags || []
      },
      file
    );
  };

  const imageUrl = preview || (file ? URL.createObjectURL(file) : null);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} autoComplete="off">
      <div className="lg:col-span-12">
        <div className="flex flex-wrap gap-4">
          <Controller
            render={({ field }) => (
              <Checkbox
                label={t('active')}
                checked={field.value === 1}
                onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
              />
            )}
            control={control}
            name="isActive"
          />
          <Controller
            render={({ field }) => (
              <Checkbox
                label={t('featured')}
                checked={field.value === 1}
                onChange={(e) => field.onChange(e.target.checked ? 1 : 0)}
              />
            )}
            control={control}
            name="isFeatured"
          />
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Input
            {...register('title')}
            label={t('title')}
            error={errors?.title?.message}
            placeholder={t('enter') + ' ' + t('title')}
          />
        </div>

        {/* <div className="lg:col-span-6">
          <Input
            {...register('slug')}
            prefix={<DocumentTextIcon className="size-5" />}
            label={t('slug')}
            error={errors?.slug?.message}
            placeholder={t('slug_auto_generate_info')}
            description={t('slug_auto_generate_info_description')}
            onChange={(e) => {
              setIsSlugManuallyEdited(true);
              setValue('slug', e.target.value, { shouldValidate: true });
            }}
          />{' '}
        </div> */}

        <div className="lg:col-span-6">
          <Controller
            control={control}
            name="blogCategoryIds"
            render={({ field }) => {
              const normalizedValues = Array.isArray(field.value)
                ? field.value.map((value) => {
                    const parsed = Number(value);
                    return Number.isNaN(parsed) ? value : parsed;
                  })
                : [];

              const selectedCategories = categories.filter((option) =>
                normalizedValues.includes(option.value)
              );

              return (
                <Combobox
                  multiple
                  data={categories}
                  value={selectedCategories}
                  onChange={(selected) =>
                    field.onChange(
                      Array.isArray(selected)
                        ? selected
                            .map((option) => option?.value)
                            .map((value) => {
                              const parsed = Number(value);
                              return Number.isNaN(parsed) ? value : parsed;
                            })
                            .filter((value) => value !== null && value !== undefined)
                        : []
                    )
                  }
                  name={field.name}
                  label={t('category')}
                  placeholder={t('select') + ' ' + t('category')}
                  displayField="label"
                  searchFields={['label']}
                  error={errors?.blogCategoryIds?.message}
                />
              );
            }}
          />
        </div>

        <div className="lg:col-span-6">
          <Controller
            render={({ field }) => (
              <TagInput
                label={t('tags')}
                placeholder={t('enter_tags_info')}
                error={errors?.tags?.message}
                value={field.value || []}
                onChange={field.onChange}
              />
            )}
            control={control}
            name="tags"
          />
        </div>
        <div className="lg:col-span-6">
          <Input
            {...register('metaTitle')}
            label={t('meta') + ' ' + t('title')}
            error={errors?.metaTitle?.message}
            placeholder={t('enter') + ' ' + t('meta') + ' ' + t('title')}
          />
        </div>

        <div className="lg:col-span-12">
          <Textarea
            {...register('metaDescription')}
            label={t('meta') + ' ' + t('description')}
            error={errors?.metaDescription?.message}
            placeholder={t('enter') + ' ' + t('meta') + ' ' + t('description')}
            rows={2}
          />
        </div>
        <div className="lg:col-span-12">
          <Textarea
            {...register('shortDescription')}
            label={t('short') + ' ' + t('description')}
            error={errors?.shortDescription?.message}
            placeholder={t('enter') + ' ' + t('short') + ' ' + t('description')}
            rows={3}
          />
        </div>
        <div className="lg:col-span-12">
          <Controller
            control={control}
            name="content"
            rules={{ required: t('content') + ' ' + t('is_required') }}
            render={() => (
              <TextEditor
                value={content}
                label={t('content')}
                onChange={(val) => {
                  handleChange(val);
                }}
                placeholder={`${t('enter')} ${t('your')} ${t('content')} ${t('here')}...`}
                className="[&_.ql-editor]:max-h-96 [&_.ql-editor]:min-h-[12rem]"
                error={errors?.content?.message}
              />
            )}
          />
        </div>

        <div className="space-y-3 lg:col-span-6">
          {imageUrl && (
            <RenderImage
              preview={imageUrl}
              id={'blogImage'}
              label=""
              maxWidth="300px"
              maxHeight="300px"
            />
          )}
          <Upload
            onChange={(newFile) => {
              setFile(newFile);
              if (newFile) {
                setPreview(URL.createObjectURL(newFile));
              }
            }}
            ref={uploadRef}
            setPreview={setPreview}
            accept={'.png, .jpg, .jpeg'}>
            {({ ...props }) => (
              <Button color="primary" {...props} className="space-x-2" type="button">
                <CloudArrowUpIcon className="size-5" />
                <span>{t('choose_file')}</span>
              </Button>
            )}
          </Upload>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 rtl:space-x-reverse">
        {!isEdit && (
          <Button className="min-w-[7rem]" onClick={() => reset()} disabled={isSubmitting}>
            {t('reset')}
          </Button>
        )}
        <Button type="submit" className="min-w-[7rem]" color="primary" disabled={isSubmitting}>
          {isEdit ? t('update') : t('create')}
        </Button>
      </div>
    </form>
  );
};

BlogForm.propTypes = {
  form: PropTypes.object.isRequired,
  categories: PropTypes.array,
  loading: PropTypes.bool,
  isEdit: PropTypes.bool,
  initialImageUrl: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func
};

export default BlogForm;
