import { Page } from 'components/shared/Page';
import { FolderIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import BlogCategoryService from '../../../services/blog-category.services';
import { Button, Skeleton } from 'components/ui';
import apiConfig from '../../../configs/api.config';

const ViewBlogCategoryDetails = () => {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);

  const pageTitle = t('blog_category') + ' ' + t('details');

  const breadcrumbItem = [
    { title: t('blog_categories'), path: '/content-management/blog-category' },
    { title: t('details') }
  ];

  const navigate = useNavigate();

  const fetchCategoryDetails = async () => {
    setLoading(true);
    BlogCategoryService.getBlogCategoryDetails(categoryId)
      .then(({ response }) => {
        setCategory(response.data);
      })
      .catch((error) => {
        setError(error);
        toast.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (categoryId) {
      fetchCategoryDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  if (!loading && error) {
    toast.error(error);
    setError('');
  }

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {pageTitle}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        {loading && [...Array(3)].map((_, i) => <Skeleton className="mb-4" key={i} />)}
        {!loading && category && (
          <div className="mt-6 space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => navigate(`/content-management/blog-category/${categoryId}/edit`)}
                className="space-x-2">
                <FolderIcon className="size-5" />
                <span>{t('edit')}</span>
              </Button>
            </div>

            {category.ImageName && (
              <div>
                <img
                  src={`${apiConfig.baseURL.S3_URL}/upload/blog-category/${category.ImageName}`}
                  alt={category.Name}
                  className="max-w-xs rounded-lg object-cover"
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('name')}
                </label>
                <p className="mt-1 text-gray-900 dark:text-gray-100">{category.Name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('status')}
                </label>
                <p className="mt-1">
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      category.IsActive === 1
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {category.IsActive === 1 ? t('active') : t('inactive')}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex justify-start">
              <Button
                onClick={() => navigate('/content-management/blog-category')}
                className="space-x-2">
                <ArrowLeftIcon className="size-5" />
                <span>{t('back') + ' ' + t('to') + ' ' + t('list')}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

export default ViewBlogCategoryDetails;
