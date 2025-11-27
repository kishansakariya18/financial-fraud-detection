import apiConfig from 'configs/api.config';
import moment from 'moment';

export const normalizeBonusTemplateStatus = (status) => {
  if (status === undefined || status === null) return 'unknown';

  if (typeof status === 'number') {
    if (status === 1) return 'active';
    if (status === 0) return 'inactive';
  }

  const normalized = String(status).toLowerCase();
  if (normalized === '1') return 'active';
  if (normalized === '0') return 'inactive';

  return normalized;
};

export const getTemplateStatusLabel = (status, t) => {
  switch (status) {
    case 'active':
      return t('active');
    case 'inactive':
      return t('inactive');
  }
};

export const getBonusTypeLabel = (type, t) => {
  switch (type) {
    case 'deposit_boost':
      return t('deposit_boost');
    case 'free_chip':
      return t('free_chip');
    case 'free_spins':
      return t('free_spins');
    default:
      return type;
  }
};
export const boostModeOptionsLabel = (type = '', t) => {
  switch (type) {
    case 'fixed':
      return t('fixed');
    case 'variable':
      return t('variable');
    default:
      return type;
  }
};
export const wageringModeOptionsLabel = (type = '', t) => {
  switch (type) {
    case 'deposit_boost':
      return t('deposit_boost');
    case 'free_chip':
      return t('free_chip');
    case 'free_spins':
      return t('free_spins');
    case 'multiplier':
      return t('multiplier');
    case 'none':
      return t('none');
    case 'fixed_amount':
      return t('fixed_amount');
    default:
      return type;
  }
};

export const wageringBaseOptionsLabel = (type, t) => {
  switch (type) {
    case 'deposit':
      return t('deposit');
    case 'boost':
      return t('boost');
    case 'deposit_plus_boost':
      return t('deposit_plus_boost');
    case 'chip_amount':
      return t('chip_amount');
    case 'winnings':
      return t('winnings');
    default:
      return type;
  }
};

export const paymentMethodOptionsLabel = (type = '', t) => {
  switch (type) {
    case 'all':
      return t('all_payment_methods');
    case 'credit_card':
      return t('credit_card');
    case 'crypto':
      return t('crypto');
    case 'wallet':
      return t('wallet');
    default:
      return type;
  }
};

const buildImageUrl = (imageName) =>
  imageName ? `${apiConfig.baseURL.S3_URL}/bonus-template/${imageName}` : null;

export const mapBonusTemplateListItem = (item, t) => {
  if (!item) return null;

  const status = normalizeBonusTemplateStatus(item?.Status ?? item?.status);
  return {
    id: String(item?.BonusTemplateID ?? ''),
    templateName: item?.TemplateName ?? '—',
    displayTitle: item?.DisplayTitle ?? '—',
    displayPriority: item?.DisplayPriority ?? 0,
    bonusType: getBonusTypeLabel(item?.BonusType, t) ?? '—',
    status,
    createdAt: item?.DateCreated ?? item?.dateCreated ?? item?.CreatedAt ?? item?.createdAt ?? null,
    updatedAt:
      item?.DateModified ??
      item?.dateModified ??
      item?.DateUpdated ??
      item?.updatedAt ??
      item?.UpdatedAt ??
      null
  };
};

const asBoolean = (value) => {
  if (value === true || value === false) return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0') return false;
  }
  if (typeof value === 'number') {
    return Number(value) === 1;
  }
  return Boolean(value);
};

export const normalizeBonusTemplateDetail = (payload) => {
  if (!payload) return null;

  const template = payload.data ?? payload;
  if (!template) return null;
  const templateInfo = {
    templateName: template.TemplateName,
    bonusType: template.BonusType,
    bonusTag: template.bonusTags?.map((tag) => tag.TagName) || [],
    bonusTagsSelectedData:
      template.bonusTags?.map((tag) => ({ id: tag.BonusTagID, value: tag.TagName })) || [],
    expiryAfterIssuanceDays: template.ExpiryAfterIssuanceDays
  };
  const bonusDetails = {
    displayTitle: template.DisplayTitle,
    notes: template.Notes,
    adminNotes: template.AdminNote,
    displayPriority: template.DisplayPriority,
    desktopImage: template.DesktopImageName,
    mobileImage: template.MobileImageName,
    desktopImageUrl: buildImageUrl(template.DesktopImageName),
    mobileImageUrl: buildImageUrl(template.MobileImageName)
  };

  const depositBoostConfig = template.depositBoostConfig;
  const freeChipConfig = template.freeChipConfig;
  const freeSpinsConfig = template.freeSpinsConfig;
  const rewardConfigurations = {
    // Deposit Boost
    boostMode: depositBoostConfig?.BoostMode ?? 'fixed',
    boostPercent: Number(depositBoostConfig?.BoostPercent) || null,
    minDepositAmount: Number(depositBoostConfig?.MinDepositAmount) || null,
    maxBonusAmount: Number(depositBoostConfig?.MaxBonusAmount) || null,
    variableRules: (depositBoostConfig?.variableRows || [])?.map((rule) => ({
      paymentMethod: rule.PaymentMethod ?? 'all',
      rangeFrom: Number(rule.RangeFrom) || 0,
      rangeTo: Number(rule.RangeTo) || 0,
      boostPercent: Number(rule.BoostPercent) || 0,
      wagering: Number(rule.Wagering) || 0,
      mco: Number(rule.Mco) || 0
    })),
    // Free Chip
    amount: Number(freeChipConfig?.Amount) || null,
    // Free Spins
    gameId: freeSpinsConfig?.GameID || null,
    gameName: freeSpinsConfig?.GameName || null, // temporary
    selectedGame: {
      value: freeSpinsConfig?.GameID || null,
      label: freeSpinsConfig?.GameName || null
    },
    spinsCount: Number(freeSpinsConfig?.SpinsCount) || null,
    denominationPerSpin: Number(freeSpinsConfig?.DenominationPerSpin) || null,
    maxFreeSpinWinnings: Number(freeSpinsConfig?.MaxFreeSpinWinnings) || null
  };

  const wageringConfig = {
    mode: template.WageringMode ?? template.wageringMode ?? 'none',
    base: template.WageringBase ?? template.wageringBase ?? null,
    wageringValue: Number(template.WageringValue) || null,
    daysToWager: Number(template.DaysToWager) || null
  };

  const maxCashoutConfig = {
    mode: template.McoMode ?? template.mcoMode ?? 'none',
    base: template.McoBase ?? template.mcoBase ?? null,
    cashoutValue: Number(template.CashoutValue) || null,
    stickyBonus: asBoolean(template.StickyBonus ?? template.stickyBonus),
    kycRequired: asBoolean(template.KycRequired ?? template.kycRequired)
  };

  const gameplay = {
    minBet: Number(template.MinBet) || null,
    maxBet: Number(template.MaxBet) || null,
    allowedProviders:
      template.bonusTemplateAllowedProviders?.map(({ ProviderID }) => ProviderID) || [],
    providerIncluded: asBoolean(template.GameProviderIncluded ?? template.providerIncluded ?? true),
    allowedCategories:
      template.bonusTemplateAllowedCategories?.map(({ CategoryID }) => CategoryID) || [],
    categoryIncluded: asBoolean(template.GameCategoryIncluded ?? template.categoryIncluded ?? true),
    allowedGames:
      template.bonusTemplateAllowedGames?.map((game) => ({
        value: game.GameID,
        label: game.GameName,
        providerId: game.ProviderID,
        categoryId: game.CategoryID
      })) || [],
    gameIncluded: asBoolean(template.GameIncluded ?? template.gameIncluded ?? true)
  };

  const statusRaw =
    template.Status ?? template.status ?? template.templateStatus ?? template.currentStatus;
  return {
    templateInfo,
    bonusDetails,
    rewardDetails: rewardConfigurations,
    wageringConfig,
    maxCashoutConfig,
    gameplay,
    // extra data
    status: normalizeBonusTemplateStatus(statusRaw),
    createdByAdmin: {
      id: template.CreatedByAdmin?.AdminID,
      name: template.CreatedByAdmin?.UserName
    },
    updatedByAdmin: {
      id: template.UpdatedByAdmin?.AdminID,
      name: template.UpdatedByAdmin?.UserName
    },
    createdAt: template.CreatedAt,
    updatedAt: template.UpdatedAt,
    rowData: template
  };
};

export const extractBonusTemplateSummary = (payload, totalRecords, mappedData) => {
  if (!payload) return null;

  const sourceSummary =
    payload.summary || payload.stats || payload.meta?.summary || payload.meta?.stats || null;

  if (sourceSummary) {
    return {
      totalTemplates:
        sourceSummary.totalTemplates ??
        sourceSummary.total ??
        sourceSummary.templates ??
        totalRecords ??
        0,
      activeTemplates:
        sourceSummary.activeTemplates ?? sourceSummary.active ?? sourceSummary.activeCount ?? 0,
      draftTemplates:
        sourceSummary.draftTemplates ?? sourceSummary.draft ?? sourceSummary.draftCount ?? 0
    };
  }

  if (!Array.isArray(mappedData) || mappedData.length === 0) {
    return null;
  }

  return mappedData.reduce(
    (acc, template) => {
      if (template.status === 'active') {
        acc.activeTemplates += 1;
      }
      if (template.status === 'draft') {
        acc.draftTemplates += 1;
      }
      return acc;
    },
    {
      totalTemplates: totalRecords ?? mappedData.length,
      activeTemplates: 0,
      draftTemplates: 0
    }
  );
};

export const bonusTemplateStatusOptions = [
  {
    key: 'active',
    value: 'active',
    label: 'Active',
    color: 'success'
  },
  {
    key: 'inactive',
    value: 'inactive',
    label: 'Inactive',
    color: 'error'
  }
];

export const bonusTemplateTypeOptions = [
  {
    key: 'deposit_boost',
    value: 'deposit_boost',
    label: 'Deposit Boost'
  },
  {
    key: 'free_chip',
    value: 'free_chip',
    label: 'Free Chip'
  },
  {
    key: 'free_spins',
    value: 'free_spins',
    label: 'Free Spins'
  }
];

export const toStatusFlag = (value) => {
  if (value === undefined || value === null) return 1;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    if (normalized === 'active' || normalized === '1') return 1;
    if (normalized === 'inactive' || normalized === '0') return 0;
  }
  return value ? 1 : 0;
};

export const buildBonusTemplateQueryParams = ({ pagination = {}, filters = {} } = {}) => {
  return {
    page: (pagination.pageIndex ?? 0) + 1,
    perPage: pagination.pageSize ?? 10,
    keyword: filters.keyword || undefined,
    status: filters.status === 'inactive' ? 0 : filters.status === 'active' ? 1 : undefined,
    bonusType: filters.bonusType || undefined,
    startDate: filters.startDate ? moment(+filters.startDate).startOf('day').toDate() : undefined,
    endDate: filters.endDate ? moment(+filters.endDate).endOf('day').toDate() : undefined
  };
};
