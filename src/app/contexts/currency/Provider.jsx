import { useCallback, useEffect, useMemo, useState } from 'react';
import { CurrencyContext } from './context';
import { useSelector } from 'react-redux';
import CurrencyService from 'services/currency.services';

export const CurrencyProvider = ({ children }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [code, setCode] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAndSetCurrency = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      CurrencyService.getDefaultCurrency()
        .then((res) => {
          const { Code = null, Symbol = '', DecimalPlaces = 2 } = res.response.data;
          const decimalPlaces = DecimalPlaces === 0 ? 0 : DecimalPlaces || 2;
          setCode(Code || null);
          setSymbol(Symbol || '');
          setDecimalPlaces(decimalPlaces);

          localStorage.setItem(
            'BaseCurrency',
            JSON.stringify({
              code: Code || null,
              symbol: Symbol || '',
              decimalPlaces: decimalPlaces
            })
          );
        })
        .catch((err) => {
          setError(err?.message || err || 'Failed to load base currency');
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setError(err?.message || 'Failed to load base currency');
    } finally {
      setLoading(false);
    }
  }, []);

  const formatCurrency = useCallback(
    (amount) => {
      if (code === null) return amount;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: code || 'USD',
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
      }).format(amount);
    },
    [code, decimalPlaces]
  );

  // Load on login success and once on mount (if settings already present)
  useEffect(() => {
    if (isLoggedIn) {
      fetchAndSetCurrency();
    } else {
      // On logout, clear in-memory state but keep localStorage for now
      setCode(null);
      setSymbol('');
      setDecimalPlaces(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // Also attempt initial load (useful for page refresh when already logged in)
  useEffect(() => {
    if (!isLoggedIn) return;
    const cached = (() => {
      try {
        const raw = localStorage.getItem('BaseCurrency');
        return raw ? JSON.parse(raw) : null;
      } catch {
        // ignore parsing errors
        return null;
      }
    })();
    if (cached?.code && cached?.symbol) {
      setCode(cached.code);
      setSymbol(cached.symbol);
      setDecimalPlaces(Number(cached.decimalPlaces ?? 2));
    } else {
      fetchAndSetCurrency();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => {
    return {
      code,
      symbol,
      decimalPlaces,
      loading,
      error,
      refreshBaseCurrency: fetchAndSetCurrency,
      formatCurrency
    };
  }, [code, symbol, decimalPlaces, loading, error, fetchAndSetCurrency, formatCurrency]);

  return <CurrencyContext value={value}>{children}</CurrencyContext>;
};
