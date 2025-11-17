import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import BlogService from '../../../services/blog.services';
import BlogCategoryService from '../../../services/blog-category.services';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { createBlogSchema } from './schema';
import BlogForm from './BlogForm';

const CreateBlog = () => {
  const [categories, setCategories] = useState([]);
  const { t } = useTranslation();

  const breadcrumbItem = [
    { title: t('blogs'), path: '/content-management/blogs' },
    { title: t('create') }
  ];

  const navigate = useNavigate();
  const form = useForm({
    resolver: yupResolver(createBlogSchema),
    defaultValues: {
      isFeatured: 0,
      isActive: 1,
      blogCategoryIds: [],
      tags: []
    }
  });
  const fetchCategoryList = async () => {
    await BlogCategoryService.getBlogCategoryList({
      pagination: { pageIndex: 0, pageSize: 100 },
      filters: { isActive: 1 }
    })
      .then(({ response }) => {
        setCategories(
          response.data.map((cat) => ({
            value: Number(cat.BlogCategoryID),
            label: cat.Name
          }))
        );
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const createBlogAPI = async (requestObject, file) => {
    await BlogService.createBlog(requestObject, file)
      .then(({ response }) => {
        toast.success(response.message);
        setTimeout(() => {
          navigate('/content-management/blogs');
        }, 0);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const onSubmit = async (data, file) => {
    await createBlogAPI(data, file);
  };

  return (
    <Page title={t('create') + ' ' + t('blog')}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {t('create') + ' ' + t('blog') + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <BlogForm form={form} categories={categories} isEdit={false} onSubmit={onSubmit} />
      </div>
    </Page>
  );
};

export default CreateBlog;
