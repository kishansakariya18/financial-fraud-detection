import { useRef } from 'react';
import PropTypes from 'prop-types';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Button } from 'components/ui';
import { Input, Textarea, Upload } from 'components/ui/Form';

export function StepBonusDetails({ data, onChange, onImageChange, errors = {} }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <Input
        label={t('bonus_name') + ` (${t('player_facing')})`}
        placeholder={t('enter_bonus_name_player_facing_info')}
        value={data.displayTitle}
        onChange={(event) => onChange('displayTitle', event.target.value)}
        error={errors.displayTitle}
      />

      <Textarea
        label={t('description') + ` (${t('player_facing')})`}
        rows={4}
        placeholder={t('enter_description_info')}
        value={data.notes}
        onChange={(event) => onChange('notes', event.target.value)}
        error={errors.notes}
      />
      <Textarea
        label={t('description') + ` (${t('internal')})`}
        rows={4}
        placeholder={t('enter_description_internal_info')}
        value={data.adminNotes}
        onChange={(event) => onChange('adminNotes', event.target.value)}
        error={errors.adminNotes}
      />

      <Input
        label={t('display_priority')}
        type="number"
        placeholder={t('enter_display_priority_info')}
        value={data.displayPriority}
        onChange={(event) => onChange('displayPriority', event.target.value)}
        error={errors.displayPriority}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <UploadField
          label={t('desktop_image_upload')}
          value={data.desktopImage}
          error={errors.desktopImage}
          onChange={(file) => onImageChange('desktopImage', file)}
        />

        <UploadField
          label={t('mobile_image_upload')}
          value={data.mobileImage}
          error={errors.mobileImage}
          onChange={(file) => onImageChange('mobileImage', file)}
        />
      </div>
    </div>
  );
}

const UploadField = ({ label, value, error, onChange }) => {
  const uploadRef = useRef();

  const fileName =
    typeof value === 'string' ? value : value?.name ? value.name : 'No file selected';

  return (
    <div className="space-y-2">
      <label className="input-label text-sm text-gray-600 dark:text-dark-100">{label}</label>
      <div className="flex flex-wrap items-center gap-2">
        <Upload
          ref={uploadRef}
          accept="image/*"
          onChange={(file) => {
            onChange(file);
          }}>
          {({ ...props }) => (
            <Button color="primary" type="button" className="space-x-2" {...props}>
              <CloudArrowUpIcon className="size-5" />
              <span>Choose File</span>
            </Button>
          )}
        </Upload>
        <Button
          type="button"
          variant="outlined"
          color="neutral"
          disabled={!value}
          onClick={() => {
            if (uploadRef.current) {
              uploadRef.current.value = '';
            }
            onChange(null);
          }}>
          Reset
        </Button>
      </div>
      <p className="text-sm text-gray-500 dark:text-dark-300">
        File name: <span className="font-medium">{fileName}</span>
      </p>
      <p className="text-xs text-gray-400 dark:text-dark-400">
        Required size: 1024x1024px (PNG/JPG)
      </p>
      {error && <p className="text-sm text-error dark:text-error-light">{error}</p>}
    </div>
  );
};

UploadField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onChange: PropTypes.func.isRequired
};

StepBonusDetails.propTypes = {
  data: PropTypes.shape({
    displayTitle: PropTypes.string,
    description: PropTypes.string,
    displayPriority: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    desktopImage: PropTypes.any,
    mobileImage: PropTypes.any
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onImageChange: PropTypes.func.isRequired,
  errors: PropTypes.object
};
