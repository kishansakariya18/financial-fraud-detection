export const exchangeHistoryListResponseMapper = (response) => {
  if (!response || !response.data) {
    return { list: [], totalRecords: 0, totalPages: 1 };
  }

  console.log('response', response);
  const mappedData = response.data.map((d) => ({
    id: d.ExchangeRateID,
    base_currency: d.BaseCurrency,
    quote_currency: d.QuoteCurrency,
    rate: d.Rate,
    source: d.Source,
    effective_at: d.EffectiveAt,
    date_created: d.DateCreated
    // exchangeRate: d.ExchangeRate
  }));

  return {
    list: mappedData,
    totalRecords: response.total_records || response.data.length,
    totalPages: response.total_pages || 1
  };
};
