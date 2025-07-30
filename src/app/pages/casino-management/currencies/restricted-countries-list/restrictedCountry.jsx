import { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardHeader, Select } from '@material-tailwind/react';
import { addRestrictedCountry } from '../../../../../store/currencies/action';
import { getCountries } from '../../../../../store/countries/action';

const RestrictedCountry = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [country, setCountry] = useState('');

    const { countries, loading, countriesLoading } = useSelector(
        (state) => ({
            countries: state.countries.countries,
            loading: state.currencies.loading,
            countriesLoading: state.countries.loading,
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getCountries());
    }, []);

    const handleSubmit = () => {
        if (country) {
            dispatch(addRestrictedCountry(id, { country }));
        }
    };

    return (
        <Card>
            <CardHeader
                floated={false}
                shadow={false}
                className="rounded-none"
            >
                <h5 className="text-xl font-bold">Add Restricted Country</h5>
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Select
                        label="Country"
                        name="country"
                        options={countries?.map((c) => ({ value: c._id, label: c.name }))}
                        value={country}
                        onChange={(e) => setCountry(e)}
                        isLoading={countriesLoading}
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Adding...' : 'Add Country'}
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default RestrictedCountry;
