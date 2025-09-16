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

  const resolveDefaultCurrency = (list) => {
    if (!Array.isArray(list) || list.length === 0) {
      return { code: null, symbol: '', decimalPlaces: 2 };
    }
    const def = list.find((c) => c?.IsDefault || c?.is_default);
    const picked = def || list[0];
    return {
      code: picked?.Code || picked?.code || null,
      symbol: picked?.Symbol || picked?.symbol || '',
      decimalPlaces: Number(picked?.DecimalPlaces ?? picked?.decimal_places ?? 2)
    };
  };

  const fetchAndSetCurrency = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch currency list and derive default currency solely from it
      const listRes = await CurrencyService.getCurrencyList({
        pagination: { pageIndex: 0, pageSize: 500 }
      });
      const list = Array.isArray(listRes?.response?.data)
        ? listRes.response.data
        : Array.isArray(listRes?.data)
          ? listRes.data
          : [];
      const { code: resolvedCode, symbol: sym, decimalPlaces: dp } = resolveDefaultCurrency(list);

      setCode(resolvedCode || null);
      setSymbol(sym || '');
      setDecimalPlaces(dp || 2);

      // Store for quick reuse
      try {
        localStorage.setItem(
          'BaseCurrency',
          JSON.stringify({ code: resolvedCode, symbol: sym, decimalPlaces: dp })
        );
      } catch {
        // ignore storage failure
      }
    } catch (err) {
      setError(err?.message || 'Failed to load base currency');
    } finally {
      setLoading(false);
    }
  }, []);

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
      refreshBaseCurrency: fetchAndSetCurrency
    };
  }, [code, symbol, decimalPlaces, loading, error, fetchAndSetCurrency]);

  return <CurrencyContext value={value}>{children}</CurrencyContext>;
};
