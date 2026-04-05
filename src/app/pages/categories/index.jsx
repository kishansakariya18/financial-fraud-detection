import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { toast } from 'sonner';
import {
  PencilSquareIcon,
  PlusIcon,
  RectangleStackIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';

import ContentWrapper from 'components/ui/custom/ContentWrapper';
import { CustomModal } from 'components/custom/CustomModal';
import { Button, Input, Badge, Spinner } from 'components/ui';
import { Listbox } from 'components/shared/form/Listbox';
import { Breadcrumbs } from 'components/shared/Breadcrumbs';
import { useTranslation } from 'react-i18next';
import CategoryService from 'services/categories.services';

function categoryId(item) {
  if (item == null) return null;
  return item._id ?? item.id ?? null;
}

function isSystemCategory(item) {
  if (item == null) return false;
  if (item.isSystem === true || item.isDefault === true) return true;
  const scope = String(item.scope ?? item.source ?? '').toLowerCase();
  return scope === 'system' || scope === 'default';
}

function extractListFromResult(result) {
  if (!result || result.status !== 200) return [];
  const body = result.response;
  const raw = body?.data !== undefined ? body.data : body;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.categories)) return raw.categories;
  return [];
}

function dedupeById(items) {
  const seen = new Set();
  return items.filter((c) => {
    const id = categoryId(c);
    if (id == null || id === '') return true;
    const key = String(id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeType(type) {
  const u = String(type || '').toUpperCase();
  if (u === 'INCOME' || u === 'EXPENSE') return u;
  if (u === 'IN') return 'INCOME';
  return 'EXPENSE';
}

/** POST /categories expects title case in your API (e.g. "Expense"). */
function typeForCreateApi(internalType) {
  return normalizeType(internalType) === 'INCOME' ? 'Income' : 'Expense';
}

function CategoryCard({ item, onEdit, readOnly }) {
  const { t } = useTranslation();
  const type = normalizeType(item.type);
  const id = categoryId(item);

  return (
    <div
      className={clsx(
        'flex flex-col gap-3 rounded-lg border p-4 transition-colors',
        'border-gray-200 bg-white dark:border-dark-500 dark:bg-dark-800'
      )}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400">
            <TagIcon className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-gray-900 dark:text-dark-50">{item.name}</p>
            {item.icon ? (
              <p className="truncate text-xs text-gray-500 dark:text-dark-300">{item.icon}</p>
            ) : null}
          </div>
        </div>
        {!readOnly && id != null && (
          <Button
            variant="flat"
            isIcon
            className="size-8 shrink-0 rounded-md"
            onClick={() => onEdit(item)}
            title={t('edit')}>
            <PencilSquareIcon className="size-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge color={type === 'INCOME' ? 'success' : 'warning'} className="text-xs" variant="soft">
          {type === 'INCOME' ? t('category_type_income') : t('category_type_expense')}
        </Badge>
        {readOnly ? (
          <Badge color="neutral" variant="soft" className="text-xs">
            {t('system_category_badge')}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { t } = useTranslation();
  const pageTitle = t('nav.dashboards.categories');

  const [loading, setLoading] = useState(true);
  const [userCategories, setUserCategories] = useState([]);
  const [systemCategories, setSystemCategories] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState('EXPENSE');
  const [formIcon, setFormIcon] = useState('');

  const typeOptions = useMemo(
    () => [
      { label: t('category_type_income'), value: 'INCOME' },
      { label: t('category_type_expense'), value: 'EXPENSE' }
    ],
    [t]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const mainRes = await CategoryService.getCategories();
      if (mainRes.status !== 200) {
        toast.error(mainRes.error || mainRes.response?.message || t('category_load_error'));
        setUserCategories([]);
        setSystemCategories([]);
        return;
      }

      const body = mainRes.response;
      const raw = body?.data !== undefined ? body.data : body;
      let user = [];
      let system = [];

      if (
        raw &&
        typeof raw === 'object' &&
        !Array.isArray(raw) &&
        (raw.userCategories || raw.systemCategories)
      ) {
        user = Array.isArray(raw.userCategories) ? raw.userCategories : [];
        system = Array.isArray(raw.systemCategories) ? raw.systemCategories : [];
      } else {
        const list = extractListFromResult(mainRes);
        user = list.filter((c) => !isSystemCategory(c));
        system = list.filter((c) => isSystemCategory(c));
      }

      if (system.length === 0) {
        const sysRes = await CategoryService.getSystemCategories();
        if (sysRes.status === 200) {
          const extra = extractListFromResult(sysRes);
          system = dedupeById([...system, ...extra]);
        }
      }

      setUserCategories(dedupeById(user));
      setSystemCategories(dedupeById(system));
    } catch (e) {
      console.error(e);
      toast.error(t('category_load_error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditing(null);
    setFormName('');
    setFormType('EXPENSE');
    setFormIcon('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setFormName(item.name || '');
    setFormType(normalizeType(item.type));
    setFormIcon(item.icon || '');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) setModalOpen(false);
  };

  const handleSave = async () => {
    const name = formName.trim();
    if (!name) {
      toast.error(t('category_name_required'));
      return;
    }

    setSaving(true);
    try {
      let res;
      if (editing) {
        const id = categoryId(editing);
        if (id == null) {
          toast.error(t('category_missing_id'));
          return;
        }
        const updatePayload = {
          name,
          type: normalizeType(formType),
          icon: formIcon.trim() || ''
        };
        res = await CategoryService.updateCategory(id, updatePayload);
      } else {
        const createPayload = {
          name,
          type: typeForCreateApi(formType),
          icon: formIcon.trim() || ''
        };
        res = await CategoryService.createCategory(createPayload);
      }

      if (res.status === 200 || res.status === 201) {
        toast.success(editing ? t('category_updated_success') : t('category_created_success'));
        setModalOpen(false);
        await loadData();
      } else {
        toast.error(
          res.error ||
            res.response?.message ||
            (typeof res.response === 'string' ? res.response : t('category_save_error'))
        );
      }
    } catch (e) {
      console.error(e);
      toast.error(t('category_save_error'));
    } finally {
      setSaving(false);
    }
  };

  const selectedTypeOption =
    typeOptions.find((o) => o.value === formType) || typeOptions[1] || null;

  const breadcrumbItem = [{ title: pageTitle }];

  const renderGrid = (items, readOnly) => {
    if (items.length === 0) {
      return (
        <div className="rounded-lg border border-dashed border-gray-200 px-6 py-16 text-center dark:border-dark-500">
          <RectangleStackIcon className="mx-auto size-12 text-gray-300 dark:text-dark-400" />
          <p className="mt-3 text-sm text-gray-600 dark:text-dark-200">
            {readOnly ? t('category_empty_system') : t('category_empty_my')}
          </p>
          {!readOnly ? (
            <Button color="primary" className="mt-4" onClick={openCreate}>
              <PlusIcon className="size-4" />
              <span>{t('add_category')}</span>
            </Button>
          ) : null}
        </div>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <CategoryCard
            key={String(categoryId(item) ?? item.name)}
            item={item}
            readOnly={readOnly}
            onEdit={openEdit}
          />
        ))}
      </div>
    );
  };

  return (
    <ContentWrapper pageTitle={pageTitle} enableFullScreen={false}>
      <div className="transition-content px-[--margin-x] pb-8 pt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50">
              {pageTitle}
            </h2>
            <Breadcrumbs items={breadcrumbItem} className="mt-1 text-sm" />
          </div>
        </div>

        <div className="mt-6">
          <TabGroup>
            <div className="hide-scrollbar overflow-x-auto">
              <div className="w-max min-w-full border-b border-gray-200 dark:border-dark-500">
                <TabList className="-mb-px flex gap-1">
                  <Tab
                    className={({ selected }) =>
                      clsx(
                        'shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium outline-none transition-colors',
                        selected
                          ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100'
                      )
                    }>
                    {t('my_categories')}
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      clsx(
                        'shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium outline-none transition-colors',
                        selected
                          ? 'border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-dark-300 dark:hover:text-dark-100'
                      )
                    }>
                    {t('system_categories')}
                  </Tab>
                </TabList>
              </div>
            </div>

            <TabPanels className="mt-6">
              <TabPanel>
                <div className="mb-4 flex justify-end">
                  <Button color="primary" className="gap-1.5" onClick={openCreate}>
                    <PlusIcon className="size-4" />
                    <span>{t('add_category')}</span>
                  </Button>
                </div>
                {loading ? (
                  <div className="flex justify-center py-20">
                    <Spinner className="size-10 border-2" />
                  </div>
                ) : (
                  renderGrid(userCategories, false)
                )}
              </TabPanel>
              <TabPanel>
                <p className="mb-4 text-sm text-gray-500 dark:text-dark-300">
                  {t('system_categories_hint')}
                </p>
                {loading ? (
                  <div className="flex justify-center py-20">
                    <Spinner className="size-10 border-2" />
                  </div>
                ) : (
                  renderGrid(systemCategories, true)
                )}
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </div>

      <CustomModal
        show={modalOpen}
        onClose={closeModal}
        title={editing ? t('edit_category') : t('add_category')}
        description=""
        sizeClass="max-w-lg"
        modalFooter={
          <>
            <Button variant="outlined" onClick={closeModal} disabled={saving}>
              {t('cancel')}
            </Button>
            <Button color="primary" onClick={handleSave} disabled={saving}>
              {saving ? <Spinner className="size-4 border-2" /> : null}
              <span className={saving ? 'ml-2' : ''}>{t('save')}</span>
            </Button>
          </>
        }>
        <div className="space-y-4">
          <Input
            label={t('name')}
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder={t('category_name_placeholder')}
          />
          <Listbox
            data={typeOptions}
            value={selectedTypeOption}
            onChange={(val) => setFormType(val.value)}
            label={t('type')}
            placeholder={t('select') + ' ' + t('type')}
            displayField="label"
          />
          <Input
            label={t('icon')}
            value={formIcon}
            onChange={(e) => setFormIcon(e.target.value)}
            placeholder={t('category_icon_placeholder')}
          />
        </div>
      </CustomModal>
    </ContentWrapper>
  );
}
