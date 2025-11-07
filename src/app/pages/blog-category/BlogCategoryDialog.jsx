import { CustomModal } from 'components/custom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import BlogCategoryService from '../../../services/blog-category.services';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { createBlogCategorySchema, editBlogCategorySchema } from './schema';
import PropTypes from 'prop-types';
import { Input, Checkbox } from 'components/ui';
import { Controller } from 'react-hook-form';
import { Button } from 'components/ui';

const BlogCategoryDialog = ({ show, onClose, isEdit = false, categoryId = null, onSuccess }) => {
  const { t } = useTranslation();

  const form = useForm({
    resolver: yupResolver(isEdit ? editBlogCategorySchema : createBlogCategorySchema),
    defaultValues: {
      isActive: 1
    }
  });

  const { register, handleSubmit, formState, control } = form;
  const { errors, isSubmitting } = formState;

  const { reset } = form;

  // Fetch category details for edit mode
  useEffect(() => {
    if (show && isEdit && categoryId) {
      fetchCategoryDetails();
    } else if (show && !isEdit) {
      reset({ isActive: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, isEdit, categoryId]);

  const fetchCategoryDetails = async () => {
    BlogCategoryService.getBlogCategoryDetails(categoryId)
      .then(({ response }) => {
        const details = response.data;
        reset({
          name: details.Name || '',
          isActive: details.IsActive || 1
        });
      })
      .catch((error) => {
        toast.error(error);
        onClose();
      });
  };

  const createBlogCategoryAPI = async (requestObject) => {
    BlogCategoryService.createBlogCategory(requestObject)
      .then(({ response }) => {
        toast.success(response.message);
        reset();
        onClose();
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const editBlogCategoryAPI = async (requestObject) => {
    BlogCategoryService.editBlogCategory(categoryId, requestObject)
      .then(({ response }) => {
        toast.success(response.message);
        onClose();
        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data) => {
    if (isEdit) {
      await editBlogCategoryAPI(data);
    } else {
      await createBlogCategoryAPI(data);
    }
  };

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
          </div>
          <div className="mt-8 flex justify-end space-x-3 rtl:space-x-reverse">
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
