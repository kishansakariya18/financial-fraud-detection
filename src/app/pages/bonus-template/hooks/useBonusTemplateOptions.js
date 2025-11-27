import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import ProviderService from 'services/provider.services';
import CategoryService from 'services/category.services';
import BonusTemplateService from 'services/bonus-template.services';

const getArray = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const mapOptions = (items, valueKeys, labelKeys) => {
  if (!Array.isArray(items)) return [];
  const optionMap = new Map();

  items.forEach((item) => {
    if (!item) return;

    const valueKey = valueKeys.find(
      (key) => item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== ''
    );
    if (!valueKey) return;

    const labelKey = labelKeys.find(
      (key) => item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== ''
    );

    const rawValue = item[valueKey];
    const rawLabel = labelKey ? item[labelKey] : undefined;

    const value = String(rawValue);
    const label = String(rawLabel || rawValue);

    if (!optionMap.has(value)) {
      optionMap.set(value, { value, label });
    }
  });

  return Array.from(optionMap.values());
};

const useBonusTemplateOptions = () => {
  const [providerOptions, setProviderOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [gameOptions, setGameOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  const loadTagOptions = async () => {
    const filters = {
      keyword: '',
      page: 1,
      perPage: 1000
    };
    BonusTemplateService.getTagList(filters)
      .then(({ response }) => {
        setTagOptions(
          response?.data?.map((item) => ({ id: item.BonusTagID, value: item.TagName }))
        );
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  useEffect(() => {
    const loadGameplayOptions = async () => {
      try {
        const [providersResult, categoriesResult] = await Promise.all([
          ProviderService.getProviderList({
            filters: { status: 1 },
            isPaginationRequired: false
          }),
          CategoryService.getAllActiveCategories({
            isPaginationRequired: false,
            filters: { status: 1 }
          })
        ]);

        if (providersResult?.status === 200) {
          const providerData = getArray(providersResult.response?.data);
          setProviderOptions(mapOptions(providerData, ['ProviderID'], ['Name']));
        } else if (providersResult?.error) {
          toast.error(providersResult.error);
        }

        if (categoriesResult?.status === 200) {
          const categoryData = getArray(categoriesResult.response?.data);
          setCategoryOptions(mapOptions(categoryData, ['CategoryID'], ['Name']));
        } else if (categoriesResult?.error) {
          toast.error(categoriesResult.error);
        }
      } catch {
        toast.error('Unable to load gameplay configuration options');
      }
    };

    loadGameplayOptions();
    loadTagOptions();
  }, []);

  const handleGameOptionsCache = useCallback((options = []) => {
    setGameOptions((prev) => {
      const map = new Map(prev.map((option) => [String(option.value), option]));
      options.forEach((option) => {
        if (!option || option.value === undefined || option.value === null) return;
        const key = String(option.value);
        map.set(key, {
          value: key,
          label: option.label ?? key
        });
      });
      return Array.from(map.values());
    });
  }, []);

  return {
    providerOptions,
    categoryOptions,
    gameOptions,
    handleGameOptionsCache,
    tagOptions
  };
};

export default useBonusTemplateOptions;
