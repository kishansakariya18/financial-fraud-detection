import { CustomModal } from 'components/custom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import BlogCategoryService from '../../../services/blog-category.services';
import { useEffect, useRef, useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { createBlogCategorySchema, editBlogCategorySchema } from './schema';
import PropTypes from 'prop-types';
import { Input, Checkbox, Button } from 'components/ui';
import { Controller } from 'react-hook-form';
import { Upload } from 'components/ui/Form/Upload';
import RenderImage from 'components/ui/custom/ImageRender';
import apiConfig from '../../../configs/api.config';

const BlogCategoryDialog = ({ show, onClose, isEdit = false, categoryId = null, onSuccess }) => {
  const { t } = useTranslation();

  const form = useForm({
    resolver: yupResolver(isEdit ? editBlogCategorySchema : createBlogCategorySchema),
    defaultValues: {
      name: '',
      isActive: 1
    }
  });

  const { register, handleSubmit, formState, control } = form;
  const { errors, isSubmitting } = formState;

  const { reset } = form;
  const uploadRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const clearFileInput = () => {
    if (uploadRef.current) {
      uploadRef.current.value = '';
    }
  };

  const resetMediaState = () => {
    setFile(null);
    setPreview(null);
    clearFileInput();
  };

  const buildImageUrl = (imageName) =>
    imageName ? `${apiConfig.baseURL.S3_URL}/blog-category/${imageName}` : null;

  // Fetch category details for edit mode
  useEffect(() => {
    if (show && isEdit && categoryId) {
      fetchCategoryDetails();
    } else if (show && !isEdit) {
      reset({ name: '', isActive: 1 });
      resetMediaState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, isEdit, categoryId]);

  const fetchCategoryDetails = async () => {
    BlogCategoryService.getBlogCategoryDetails(categoryId)
      .then(({ response }) => {
        const details = response.data;
        reset({
          name: details.Name || '',
          isActive: details.IsActive ?? 1
        });
        setPreview(buildImageUrl(details.ImageName));
        setFile(null);
        clearFileInput();
      })
      .catch((error) => {
        toast.error(error);
        onClose();
      });
  };

  const createBlogCategoryAPI = async (requestObject, selectedFile) => {
    await BlogCategoryService.createBlogCategory(requestObject, selectedFile)
      .then(({ response }) => {
        toast.success(response.message);
        reset({ name: '', isActive: 1 });
        resetMediaState();
        onClose();
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const editBlogCategoryAPI = async (requestObject, selectedFile) => {
    await BlogCategoryService.editBlogCategory(categoryId, requestObject, selectedFile)
      .then(({ response }) => {
        toast.success(response.message);
        resetMediaState();
        onClose();
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleClose = () => {
    reset({ name: '', isActive: 1 });
    resetMediaState();
    onClose();
  };

  const handleFormSubmit = async (data) => {
    if (isEdit) {
      await editBlogCategoryAPI(data, file);
    } else {
      await createBlogCategoryAPI(data, file);
    }
  };

  const handleReset = () => {
    reset({ name: '', isActive: 1 });
    resetMediaState();
  };

  const imagePreview = preview;

  return (
    <CustomModal
      show={show}
      title={isEdit ? t('edit') + ' ' + t('blog_category') : t('create') + ' ' + t('blog_category')}
      onClose={handleClose}
      sizeClass="max-w-lg">
      <div className="-mt-4">
        <form onSubmit={handleSubmit(handleFormSubmit)} autoComplete="off">
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-1">
              <Input
                {...register('name')}
                label={t('name')}
                error={errors?.name?.message}
                placeholder={t('enter') + ' ' + t('name')}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-1">
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
            </div>

            <div className="space-y-3">
              {imagePreview && (
                <RenderImage
                  preview={imagePreview}
                  id="blog-category-image-preview"
                  label={t('image')}
                  maxWidth="200px"
                  maxHeight="200px"
                />
              )}

              <Upload
                onChange={(newFile) => {
                  setFile(newFile);
                  if (!newFile) {
                    setPreview(null);
                  }
                }}
                ref={uploadRef}
                setPreview={setPreview}
                accept={'image/*'}>
                {({ onClick, disabled }) => (
                  <Button onClick={onClick} disabled={disabled} className="space-x-2" type="button">
                    <CloudArrowUpIcon className="size-5" />
                    <span>{t('choose_file')}</span>
                  </Button>
                )}
              </Upload>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
            {!isEdit && (
              <Button className="min-w-[7rem]" onClick={handleReset} disabled={isSubmitting}>
                {t('reset')}
              </Button>
            )}
            <Button type="submit" className="min-w-[7rem]" color="primary" disabled={isSubmitting}>
              {isEdit ? t('update') : t('create')}
            </Button>
          </div>
        </form>
      </div>
    </CustomModal>
  );
};

BlogCategoryDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSuccess: PropTypes.func,
  onReset: PropTypes.func
};

export default BlogCategoryDialog;
