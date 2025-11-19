import PropTypes from 'prop-types';

import { Input, Select } from 'components/ui/Form';
import { useTranslation } from 'react-i18next';
import { TagsInputNew } from 'components/shared/form/TagsInputNew';

export function StepTemplateInfo({
  data,
  onChange,
  onTagsChange,
  bonusTypeOptions,
  tagOptions,
  errors = {}
}) {
  const { t } = useTranslation();
  console.log('data', data, data.bonusTagsSelectedData);
  return (
    <div className="space-y-4">
      <Input
        label={t('template_name') + ` (${t('internal')})`}
        placeholder={t('enter_template_name_info')}
        value={data.templateName}
        onChange={(event) => onChange('templateName', event.target.value)}
        error={errors.templateName}
      />

      <Select
        label={t('bonus_type')}
        data={[{ label: t('select_type'), value: '' }, ...bonusTypeOptions]}
        value={data.bonusType}
        onChange={(event) => onChange('bonusType', event.target.value)}
        error={errors.bonusType}
      />

      <TagsInputNew
        label={t('bonus_tags')}
        placeholder={t('enter_tags_info')}
        value={data.bonusTagsSelectedData || []}
        options={tagOptions}
        onChange={(tags) => {
          onTagsChange(tags);
        }}
        error={errors.bonusTag}
      />

      <Input
        label={t('expiry_after_issuance_days')}
        type="number"
        placeholder={t('enter_number_of_days')}
        value={data.expiryAfterIssuanceDays}
        onChange={(event) => onChange('expiryAfterIssuanceDays', event.target.value)}
        error={errors.expiryAfterIssuanceDays}
      />
    </div>
  );
}

StepTemplateInfo.propTypes = {
  data: PropTypes.shape({
    templateName: PropTypes.string,
    bonusType: PropTypes.string,
    bonusTag: PropTypes.arrayOf(PropTypes.string),
    expiryAfterIssuanceDays: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onTagsChange: PropTypes.func.isRequired,
  bonusTypeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired,
  errors: PropTypes.object
};
