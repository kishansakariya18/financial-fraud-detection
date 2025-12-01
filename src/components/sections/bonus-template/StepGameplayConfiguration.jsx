import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { Input } from 'components/ui/Form';
import { Button } from 'components/ui';
import { Combobox } from 'components/shared/form/Combobox';
import GamesListModal from './game-selection-modal/list';
import { useTranslation } from 'react-i18next';
import CategoryService from 'services/category.services';

const optionShape = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired
});

const normalizeItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (item === null || item === undefined) return null;
      if (typeof item === 'string' || typeof item === 'number') return String(item);
      if (typeof item === 'object') {
        if (item.value !== undefined && item.value !== null) return String(item.value);
        if (item.id !== undefined && item.id !== null) return String(item.id);
        if (item.name) return String(item.name);
      }
      return null;
    })
    .filter(Boolean);
};

const buildOptionMap = (options) => {
  const map = new Map();
  (options || []).forEach((option) => {
    if (!option) return;
    map.set(String(option.value), option);
  });
  return map;
};

const mergeOptions = (options = [], selected = []) => {
  const map = new Map();
  [...options, ...selected].forEach((option) => {
    if (!option) return;
    const key = String(option.value);
    if (!map.has(key)) {
      map.set(key, {
        value: key,
        label: option.label ?? key
      });
    }
  });
  return Array.from(map.values());
};

export function StepGameplayConfiguration({
  data,
  onChange,
  onSelectChange,
  providerOptions = [],
  categoryOptions: intialCategoryOptions = [],
  onGameOptionsCache,
  errors = {}
}) {
  const { t } = useTranslation();
  const [categoryOptions, setCategoryOptions] = useState(intialCategoryOptions);
  const debounceTimeoutRef = useRef(null);

  const handleToggleChange = (field) => (event) => {
    onChange(field, event.target.checked);
  };

  const checkGamesAreAvailableForCatAndPr = useCallback(
    (providerIds, categoryIds) => {
      const currentGames = data.allowedGames || [];
      if (currentGames.length > 0) {
        const gamesToKeep = currentGames.filter((game) => {
          const gameProviderId = String(game?.providerId);
          const gameCategoryId = String(game?.categoryId);
          const matchesProvider =
            providerIds.length === 0 ||
            providerIds.some((id) => Number(id) === Number(gameProviderId));
          const matchesCategory =
            categoryIds.length === 0 ||
            categoryIds.some((id) => Number(id) === Number(gameCategoryId));
          return matchesProvider && matchesCategory;
        });

        if (gamesToKeep.length !== currentGames.length) {
          onSelectChange('allowedGames', gamesToKeep);
        }
      }
    },
    [data.allowedGames, onSelectChange]
  );

  const fetchPrviderCategories = useCallback(
    async (providerIds) => {
      let categoriesption = [...intialCategoryOptions];
      if (providerIds?.length > 0) {
        try {
          const responce = await CategoryService.getCategoryByProviderIds(providerIds);
          if (responce?.response?.status === 200) {
            const categoriesIds = responce?.response?.data;
            categoriesption = categoriesption
              .map((category) => {
                if (categoriesIds.includes(category.value)) {
                  return category;
                }
                return null;
              })
              .filter(Boolean);
          }
        } catch (error) {
          console.log(error);
        }
      }

      // Filter selected categories to keep only those that are still available
      const currentCategories = data.allowedCategories || [];
      let categoriesToKeep = [...data.allowedCategories];
      if (currentCategories.length > 0) {
        // Extract available category values from the options
        const availableCategoryValues = categoriesption.map((cat) => String(cat.value));

        // Keep only selected categories that are in the available options
        categoriesToKeep = currentCategories.filter((categoryValue) =>
          availableCategoryValues.includes(String(categoryValue))
        );

        // Only update if the filtered list is different
        if (categoriesToKeep.length !== currentCategories.length) {
          onSelectChange('allowedCategories', categoriesToKeep);
        }
      }

      checkGamesAreAvailableForCatAndPr(providerIds, categoriesToKeep);
      setCategoryOptions(categoriesption);
    },
    [
      checkGamesAreAvailableForCatAndPr,
      data.allowedCategories,
      intialCategoryOptions,
      onSelectChange
    ]
  );

  // Debounced version of fetchPrviderCategories
  const debouncedFetchProviderCategories = useCallback(
    (providerIds) => {
      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout
      debounceTimeoutRef.current = setTimeout(() => {
        fetchPrviderCategories(providerIds);
      }, 500); // 500ms debounce delay
    },
    [fetchPrviderCategories]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectionChangeData = (field, value) => {
    if (field === 'allowedProviders') {
      debouncedFetchProviderCategories(value);
    }
    if (field === 'allowedCategories') {
      checkGamesAreAvailableForCatAndPr(data.allowedProviders, value);
    }
    onSelectChange(field, value);
  };

  const renderFilterSection = ({ title, items, placeholder, error, field, options }) => {
    const normalizedValues = normalizeItems(items);
    const optionMap = buildOptionMap(options);
    const draftSelected = normalizedValues.map((value) => ({
      value,
      label: optionMap.get(value)?.label ?? value
    }));
    const combinedOptions = mergeOptions(options, draftSelected);
    // const includeValue = data[includeField];

    const selectedValueSet = new Set(draftSelected.map((item) => item.value));
    const comboboxValue = combinedOptions.filter((option) => selectedValueSet.has(option.value));

    const handleRemove = (valueToRemove) => {
      const filtered = normalizedValues.filter((value) => value !== valueToRemove);
      handleSelectionChangeData(field, filtered);
    };

    const handleBackspace = (event) => {
      if (normalizedValues.length === 0 || event.key !== 'Backspace' || event.target.value !== '') {
        return;
      }
      event.preventDefault();
      handleRemove(normalizedValues[normalizedValues.length - 1]);
    };

    return (
      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-gray-800 dark:text-dark-50">{title}</p>
          {/* <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-dark-200">
            <span>{t('exclude')}</span>
            <Switch
              checked={includeValue !== false}
              onChange={handleToggleChange(includeField)}
              aria-label={`${title} include toggle`}
            />
            <span>{t('include')}</span>
          </div> */}
        </div>
        <Combobox
          multiple
          data={combinedOptions}
          value={comboboxValue}
          searchFields={['label']}
          onChange={(selectedItems) => {
            const next = Array.isArray(selectedItems)
              ? selectedItems.map((item) => String(item.value ?? item))
              : [];
            handleSelectionChangeData(field, next);
          }}
          placeholder={placeholder}
          error={error}
          classNames={{ root: 'space-y-1' }}
          showSelectAll
          selectAllLabel={t('select_all')}
          inputProps={{
            onKeyDown: handleBackspace
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-dark-100">
          {t('bet_restrictions')}
        </p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <Input
            label={t('minimum_bet')}
            type="number"
            value={data.minBet}
            onChange={(event) => onChange('minBet', event.target.value)}
            error={errors.minBet}
          />
          <Input
            label={t('maximum_bet')}
            type="number"
            value={data.maxBet}
            onChange={(event) => onChange('maxBet', event.target.value)}
            error={errors.maxBet}
          />
        </div>
      </div>

      {renderFilterSection({
        title: t('providers'),
        items: data.allowedProviders,
        includeField: 'providerIncluded',
        placeholder: t('type_provider_name_and_press_enter'),
        error: errors.allowedProviders,
        field: 'allowedProviders',
        options: providerOptions,
        t
      })}

      {renderFilterSection({
        title: t('categories'),
        items: data.allowedCategories,
        includeField: 'categoryIncluded',
        placeholder: t('type_category_name_and_press_enter'),
        error: errors.allowedCategories,
        field: 'allowedCategories',
        options: categoryOptions,
        t
      })}

      <GameSelectionSection
        data={data}
        onSelectChange={onSelectChange}
        onToggleChange={handleToggleChange}
        errors={errors}
        onGameOptionsCache={onGameOptionsCache}
        categoriesIds={data.allowedCategories}
        providersIds={data.allowedProviders}
      />
    </div>
  );
}

const GameSelectionSection = ({
  data,
  onSelectChange,
  // onToggleChange,
  errors,
  onGameOptionsCache
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedGames = useMemo(() => {
    return data.allowedGames.map((game) => ({ value: game.value, label: game.label }));
  }, [data.allowedGames]);

  useEffect(() => {
    onGameOptionsCache?.(selectedGames);
  }, [selectedGames, onGameOptionsCache]);

  const handleGamesChange = (nextGames) => {
    onSelectChange('allowedGames', nextGames);
    onGameOptionsCache?.(nextGames);
  };

  const handleModalSave = (nextSelection) => {
    handleGamesChange(nextSelection);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-gray-800 dark:text-dark-50">
          {t('games')}{' '}
          <span className="text-xs text-gray-600 dark:text-dark-200">
            {selectedGames.length} game{selectedGames.length === 1 ? '' : 's'} selected
          </span>
        </p>
        {/* <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-dark-200">
          <span>Exclude</span>
          <Switch
            checked={data.gameIncluded !== false}
            onChange={onToggleChange('gameIncluded')}
            aria-label="Game include toggle"
          />
          <span>Include</span>
        </div> */}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          color="primary"
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto">
          Select Games
        </Button>
      </div>

      {errors.allowedGames && (
        <p className="text-sm text-error dark:text-error-light">{errors.allowedGames}</p>
      )}

      {isModalOpen && (
        <GamesListModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectSubmit={handleModalSave}
          selectedItems={selectedGames}
          providerIds={data.allowedProviders}
          categoryIds={data.allowedCategories}
        />
      )}
    </div>
  );
};

GameSelectionSection.propTypes = {
  data: PropTypes.shape({
    games: PropTypes.array,
    gameIncluded: PropTypes.bool
  }).isRequired,
  onSelectChange: PropTypes.func.isRequired,
  onToggleChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
  onGameOptionsCache: PropTypes.func
};

StepGameplayConfiguration.propTypes = {
  data: PropTypes.shape({
    minBet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxBet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    providers: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    providerIncluded: PropTypes.bool,
    categories: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    categoryIncluded: PropTypes.bool,
    games: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    gameIncluded: PropTypes.bool
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  providerOptions: PropTypes.arrayOf(optionShape),
  categoryOptions: PropTypes.arrayOf(optionShape),
  onGameOptionsCache: PropTypes.func,
  errors: PropTypes.object
};

StepGameplayConfiguration.defaultProps = {
  providerOptions: [],
  categoryOptions: [],
  onGameOptionsCache: undefined,
  errors: {}
};
