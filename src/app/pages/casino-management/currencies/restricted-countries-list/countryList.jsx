import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Card, CardBody } from '@material-tailwind/react';
import { DataTable } from '../../../../components/table';
import { getRestrictedCountries } from '../../../../../store/currencies/action';
import { columns as countryColumns } from './columns';

const CountryList = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const { restrictedCountries, loading, total } = useSelector(
        (state) => ({
            restrictedCountries: state.currencies.restrictedCountries,
            loading: state.currencies.loading,
            total: state.currencies.total,
        }),
        shallowEqual
    );

    useEffect(() => {
        if (id) {
            dispatch(getRestrictedCountries(id, { page, limit }));
        }
    }, [id, page, limit]);

    const columns = useMemo(() of=> countryColumns, []);

    return (
        <Card>
            <CardBody className="px-0">
                <DataTable
                    columns={columns}
                    data={restrictedCountries}
                    loading={loading}
                    total={total}
                    page={page}
                    limit={limit}
                    setPage={setPage}
                    setLimit={setLimit}
                />
            </CardBody>
        </Card>
    );
};

export default CountryList;
