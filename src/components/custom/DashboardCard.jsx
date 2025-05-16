// Import Dependencies
import PropTypes from 'prop-types';
import clsx from 'clsx';

// ----------------------------------------------------------------------

function DashboardCard({
  label,
  value,
  gradientFrom,
  gradientTo,
  textColor,
  maskShape = 'is-reuleaux-triangle',
  className,
  ...rest
}) {
  return (
    <div
      className={clsx(
        'relative flex flex-col overflow-hidden rounded-lg bg-gradient-to-br p-3.5',
        gradientFrom,
        gradientTo,
        className
      )}
      {...rest}>
      <p className={clsx('text-xs uppercase', textColor)}>{label}</p>

      <div className="flex items-end justify-between space-x-2 rtl:space-x-reverse">
        <p className="mt-4 text-2xl font-medium text-white">{value}</p>
      </div>

      <div className={clsx('mask absolute right-0 top-0 -m-3 size-16 bg-white/20', maskShape)} />
    </div>
  );
}

DashboardCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  linkText: PropTypes.string,
  linkHref: PropTypes.string,
  gradientFrom: PropTypes.string.isRequired,
  gradientTo: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  maskShape: PropTypes.string,
  className: PropTypes.string
};

export { DashboardCard };
