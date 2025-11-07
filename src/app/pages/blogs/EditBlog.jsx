import { Page } from 'components/shared/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import BlogService from '../../../services/blog.services';
import BlogCategoryService from '../../../services/blog-category.services';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import { editBlogSchema } from './schema';
import BlogForm from './BlogForm';
import apiConfig from '../../../configs/api.config';

const EditBlog = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [initialImageUrl, setInitialImageUrl] = useState(null);
  const [blog, setBlog] = useState(null);

  const pageTitle = t('edit') + ' ' + t('blog');

  const breadcrumbItem = [
    { title: t('blogs'), path: '/content-management/blogs' },
    { title: t('edit') }
  ];

  const navigate = useNavigate();
  const form = useForm({
    resolver: yupResolver(editBlogSchema),
    defaultValues: async () => {
      if (slug) {
        const result = await fetchBlogDetails();
        if (result) {
          let tags = [];
          try {
            if (typeof result.Tags === 'string') {
              tags = JSON.parse(result.Tags);
            } else if (Array.isArray(result.Tags)) {
              tags = result.Tags;
            }
            setBlog(result);
          } catch {
            tags = [];
          }

          setInitialImageUrl(
            result.ImageName ? `${apiConfig.baseURL.S3_URL}/upload/blogs/${result.ImageName}` : null
          );
          console.log(result);
          return {
            title: result.Title || '',
            slug: result.Slug || '',
            content: result.Content || '',
            blogCategoryId: result.BlogCategoryID || null,
            shortDescription: result.ShortDescription || '',
            metaTitle: result.MetaTitle || '',
            metaDescription: result.MetaDescription || '',
            authorName: result.AuthorName || '',
            tags: tags,
            isFeatured: result.IsFeatured || 0,
            isActive: result.IsActive || 1
          };
        }
      }
    }
  });

  const fetchBlogDetails = async () => {
    return BlogService.getBlogDetails(slug)
      .then(({ response }) => {
        const details = response.data;
        return details;
      })
      .catch((error) => {
        toast.error(error);
        return null;
      });
  };

  const fetchCategoryList = () => {
    BlogCategoryService.getBlogCategoryList({
      pagination: { pageIndex: 0, pageSize: 100 },
      filters: { isActive: 1 }
    })
      .then(({ response }) => {
        setCategories(
          response.data.map((cat) => ({
            value: cat.BlogCategoryID,
            label: cat.Name
          }))
        );
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const editBlogAPI = async (requestObject, file) => {
    await BlogService.editBlog(blog.BlogID, requestObject, file)
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
  }, [slug]);

  const onSubmit = async (data, file) => {
    await editBlogAPI(data, file);
  };

  return (
    <Page title={pageTitle}>
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            {pageTitle + ' ' + t('form')}
          </h2>
          <div className="hidden self-stretch py-1 sm:flex">
            <div className="h-full w-px bg-gray-300 dark:bg-dark-600"></div>
          </div>
          <Breadcrumbs items={breadcrumbItem} className="max-sm:hidden" />
        </div>

        <BlogForm
          form={form}
          categories={categories}
          isEdit={true}
          initialImageUrl={initialImageUrl}
          onSubmit={onSubmit}
        />
      </div>
    </Page>
  );
};

export default EditBlog;
