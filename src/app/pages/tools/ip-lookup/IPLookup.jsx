import { useState } from 'react';
import { Button, Card, Input } from 'components/ui';
import { toast } from 'sonner';
import { Page } from 'components/shared/Page';
import ToolsService from 'services/tools.services';
import { Skeleton } from 'components/ui/Skeleton';

const IPLookup = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [ipData, setIpData] = useState(null);
  const [error, setError] = useState('');

  const isValidIP = (val) => {
    const ipv4 = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
    const ipv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4.test(val) || ipv6.test(val);
  };

  const handleSearch = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const requiredMessage = 'Please enter an IP address';
    const trimmed = ipAddress.trim();
    if (!trimmed) {
      setError(requiredMessage);
      toast.error(requiredMessage);
      return;
    }
    if (!isValidIP(trimmed)) {
      const invalidMsg = 'Invalid IP address format';
      setError(invalidMsg);
      toast.error(invalidMsg);
      return;
    }

    setLoading(true);
    setError('');
    setIpData(null);
    try {
      const result = await ToolsService.getToolDetail(trimmed);
      if (result?.status === 200 || result?.status === 201) {
        const data = result.response?.data ?? result.response;
        setIpData(data);
      } else {
        const message = result?.error || 'Failed to fetch IP details';
        toast.error(message);
      }
    } catch (err) {
      const message = err || 'Failed to fetch IP details';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="IP Lookup">
      <div className="transition-content grid w-full grid-rows-[auto_1fr] px-[--margin-x] pb-8">
        <div className="flex items-center space-x-4 py-5 lg:py-6 rtl:space-x-reverse">
          <h2 className="text-xl font-medium tracking-wide text-gray-800 dark:text-dark-50 lg:text-2xl">
            IP Lookup
          </h2>
        </div>
        <div className="col-span-12 sm:col-span-8 lg:col-span-9">
          <Card className="-mt-2">
            <form onSubmit={handleSearch} noValidate autoComplete="off">
              <Card className="p-4">
                <div className="mt-2 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="IP Address"
                      placeholder="Enter IP address (e.g., 8.8.8.8)"
                      value={ipAddress}
                      onChange={(e) => {
                        setIpAddress(e.target.value);
                        if (error) setError('');
                      }}
                      onBlur={() => {
                        const v = ipAddress.trim();
                        if (v && !isValidIP(v)) {
                          setError('Invalid IP address format');
                        }
                      }}
                      error={error && !ipData ? error : ''}
                    />
                  </div>
                  <div className="mt-4 flex justify-end space-x-3 rtl:space-x-reverse">
                    <Button
                      type="submit"
                      className="min-w-[7rem]"
                      color="primary"
                      disabled={loading}
                      loading={loading}>
                      Send
                    </Button>
                  </div>
                </div>
              </Card>
            </form>
          </Card>
          {loading && !ipData && (
            <Card className="mt-2 p-4">
              <div className="p-4">
                <h3 className="mb-4 text-lg font-semibold">IP Details</h3>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            </Card>
          )}

          {ipData && (
            <Card className="mt-3 p-4">
              <div className="p-4">
                <h3 className="mb-4 text-lg font-semibold">IP Details</h3>
                <pre className="overflow-auto rounded-md bg-gray-50 p-4 dark:bg-gray-800">
                  {JSON.stringify(ipData, null, 2)}
                </pre>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
};

export default IPLookup;
