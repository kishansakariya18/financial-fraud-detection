import { Page } from 'components/shared/Page';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import BlogService from '../../../services/blog.services';
import { Button, Card, GhostSpinner, Skeleton } from 'components/ui';
import apiConfig from '../../../configs/api.config';

const ViewBlogDetails = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState(null);

  const pageTitle = t('blog') + ' ' + t('details');

  const breadcrumbItem = [
    { title: t('blogs'), path: '/content-management/blogs' },
    { title: t('details') }
  ];
  const imageUrl = useMemo(
    () => (blog?.ImageName ? `${apiConfig.baseURL.S3_URL}/blogs/${blog.ImageName}` : null),
    [blog]
  );
  const navigate = useNavigate();

  const fetchBlogDetails = async () => {
    setLoading(true);
    await BlogService.getBlogDetails(slug)
      .then(({ response }) => {
        setBlog(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error);
      });
  };

  useEffect(() => {
    if (slug) {
      fetchBlogDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="py-5 text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:py-6 lg:text-2xl">
            {pageTitle}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          <Card className="h-full p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h6 className="mt-4 border-b border-gray-200 pb-2 text-base font-semibold text-gray-700 dark:border-dark-500 dark:text-dark-200">
                {t('blog') + ' ' + t('information')}:
              </h6>
              {!loading && blog && (
                <Button
                  onClick={() => navigate(`/content-management/blogs/${blog.Slug}/edit`)}
                  className="space-x-2">
                  <DocumentTextIcon className="size-5" />
                  <span>{t('edit')}</span>
                </Button>
              )}
            </div>

            {loading && (
              <div className="mt-4 space-y-4">
                {[...Array(4)].map((_, index) => (
                  <Skeleton key={index} className="h-5" />
                ))}
              </div>
            )}

            {!loading && blog && (
              <div className="mt-4 space-y-6">
                {blog.ImageName && (
                  <div className="flex justify-center">
                    <img
                      src={imageUrl}
                      alt={blog.Title}
                      className="max-h-64 rounded-lg object-cover"
                    />
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('title')}:
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">{blog.Title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('slug')}:
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">{blog.Slug}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('status')}:
                    </p>
                    <p className="mt-1">
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          blog.IsActive === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                        {blog.IsActive === 1 ? t('active') : t('inactive')}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('category')}:
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">{blog.category?.Name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('author')}:
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">{blog.AuthorName}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('meta') + ' ' + t('title')}:
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">{blog.MetaTitle}</p>
                  </div>
                  {blog.MetaDescription && (
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                        {t('meta') + ' ' + t('description')}:
                      </p>
                      <p className="text-gray-900 dark:text-gray-100">{blog.MetaDescription}</p>
                    </div>
                  )}
                </div>

                {blog.ShortDescription && (
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                      {t('short') + ' ' + t('description')}:
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">{blog.ShortDescription}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-dark-100">
                    {t('content')}:
                  </p>
                  <div
                    className="mt-2 rounded border border-gray-200 p-4 dark:border-dark-500"
                    dangerouslySetInnerHTML={{ __html: blog.Content || '' }}
                  />
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-end space-x-3 rtl:space-x-reverse">
              {loading && <GhostSpinner className="size-4 border-2" />}
              {!loading && !blog && <p className="text-sm text-gray-500">{t('no_data_found')}</p>}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};

export default ViewBlogDetails;
