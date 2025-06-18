import { Card } from 'components/ui';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';

function ChartCard({ data, title }) {
  if (!data) return null;

  return (
    <Card className="">
      <div className="mt-3 flex flex-col justify-between gap-2 px-4 sm:flex-row sm:items-center sm:px-5">
        <div className="flex flex-1 items-center justify-between space-x-2 sm:flex-initial rtl:space-x-reverse">
          <h2 className="text-sm+ font-medium uppercase tracking-wide text-gray-800 dark:text-dark-100">
            {title}
          </h2>
        </div>
      </div>
      <div className="ax-transparent-gridline pr-2">
        <div className="rounded-md p-2">
          <ReactApexChart
            options={data.options}
            series={data.series}
            type={data.type}
            height={data.height || 300}
          />
        </div>
      </div>
    </Card>
  );
}

ChartCard.propTypes = {
  data: PropTypes.shape({
    options: PropTypes.object.isRequired,
    series: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    height: PropTypes.number
  }).isRequired,
  title: PropTypes.string.isRequired
};

export { ChartCard as Chart };
