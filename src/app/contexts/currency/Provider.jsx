import { useCallback, useEffect, useMemo, useState } from 'react';
import { CurrencyContext } from './context';
import { useSelector } from 'react-redux';

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

      setCode('USD');
      setSymbol('');
      setDecimalPlaces(2);
    } catch (err) {
      setError(err?.message || err || 'Failed to load base currency');
    } finally {
      setLoading(false);
    }
  }, []);

  const formatCurrency = useCallback(
    (amount, currencyCode = null) => {
      // 1. Handle cases where no code is provided or amount is invalid
      if (!code || isNaN(Number(amount))) {
        return amount;
      }

      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currencyCode || code, // Use the dynamic code directly
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces
        }).format(amount);
      } catch (error) {
        console.warn('Error formatting currency:', error);
        // if (e instanceof RangeError) {
        //   return amount; // Return the raw amount if the code is unsupported
        // }
        return [symbol, amount].filter(Boolean).join(' ');
      }
    },
    [code, decimalPlaces, symbol]
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
      setCode(cached?.code);
      setSymbol(cached?.symbol);
      setDecimalPlaces(Number(cached?.decimalPlaces ?? 2));
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
