import { useState, useEffect, useRef } from 'react';
import AuthService from 'services/auth.services';
import CurrencyService from 'services/currency.services';
import AffiliatesService from 'services/affiliates.services';
import PlayerService from 'services/users.services';

// Global cache to share data across all hook instances
const cache = {
  countries: null,
  currencies: null,
  affiliates: null,
  countryMap: null,
  currencyMap: null,
  affiliateMap: null,
  players: {} // Store players by ID
};

// Flags to track ongoing fetches
const fetchStatus = {
  countries: { loading: false, error: null },
  currencies: { loading: false, error: null },
  affiliates: { loading: false, error: null },
  players: { loading: false, error: null }
};

// Subscribers for updates
const subscribers = new Set();

const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

/**
 * Custom hook to fetch and cache country, currency, affiliate, and player data
 * This prevents multiple API calls across different components
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.fetchCountries - Whether to fetch countries (default: false)
 * @param {boolean} options.fetchCurrencies - Whether to fetch currencies (default: false)
 * @param {boolean} options.fetchAffiliates - Whether to fetch affiliates (default: false)
 * @param {Array<string|number>} options.playerIds - Player IDs to fetch (for edit mode)
 * @returns {Object} - Contains options arrays, maps, and loading states
 */
export const useSegmentationMappings = ({
  fetchCountries = false,
  fetchCurrencies = false,
  fetchAffiliates = false,
  playerIds = []
} = {}) => {
  const [, forceUpdate] = useState({});
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Subscribe to cache updates
    const updateHandler = () => {
      if (isMounted.current) {
        forceUpdate({});
      }
    };
    subscribers.add(updateHandler);
    return () => {
      subscribers.delete(updateHandler);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch countries if requested and not already cached/loading
      if (fetchCountries && !cache.countries && !fetchStatus.countries.loading) {
        fetchStatus.countries.loading = true;
        fetchStatus.countries.error = null;

        try {
          const { response } = await AuthService.getCountries();
          if (response?.data) {
            // Store options for Combobox/Listbox
            cache.countries = response.data.map((country) => ({
              value: country.CountryID,
              label: country.CountryName
            }));

            // Store map for quick lookups (ID -> Name)
            cache.countryMap = {};
            response.data.forEach((country) => {
              cache.countryMap[country.CountryID] = country.CountryName;
            });

            notifySubscribers();
          }
        } catch (error) {
          console.error('Error fetching countries:', error);
          fetchStatus.countries.error = error;
        } finally {
          fetchStatus.countries.loading = false;
        }
      }

      // Fetch currencies if requested and not already cached/loading
      if (fetchCurrencies && !cache.currencies && !fetchStatus.currencies.loading) {
        fetchStatus.currencies.loading = true;
        fetchStatus.currencies.error = null;

        try {
          const { response } = await CurrencyService.getPlatformCurrancyCodes();
          if (response?.data) {
            // Store options for Combobox/Listbox
            cache.currencies = response.data.map((currency) => ({
              value: currency.CurrencyID,
              label: currency.Code
            }));

            // Store map for quick lookups (ID -> Code)
            cache.currencyMap = {};
            response.data.forEach((currency) => {
              cache.currencyMap[currency.CurrencyID] = currency.Code;
            });

            notifySubscribers();
          }
        } catch (error) {
          console.error('Error fetching currencies:', error);
          fetchStatus.currencies.error = error;
        } finally {
          fetchStatus.currencies.loading = false;
        }
      }

      // Fetch affiliates if requested and not already cached/loading
      if (fetchAffiliates && !cache.affiliates && !fetchStatus.affiliates.loading) {
        fetchStatus.affiliates.loading = true;
        fetchStatus.affiliates.error = null;

        try {
          const { response } = await AffiliatesService.getAffiliateDropDown();
          if (response?.data) {
            cache.affiliates = response.data.map((affiliate) => ({
              value: affiliate.AffiliateID,
              label: affiliate.Username || ''
            }));

            // Store map for quick lookups (ID -> Username)
            cache.affiliateMap = {};
            response.data.forEach((affiliate) => {
              cache.affiliateMap[affiliate.AffiliateID] = affiliate.Username || '';
            });

            notifySubscribers();
          }
        } catch (error) {
          console.error('Error fetching affiliates:', error);
          fetchStatus.affiliates.error = error;
        } finally {
          fetchStatus.affiliates.loading = false;
        }
      }

      // Fetch specific players by IDs (for edit mode)
      if (playerIds && playerIds.length > 0 && !fetchStatus.players.loading) {
        // Check which players we need to fetch
        const missingPlayerIds = playerIds.filter((id) => !cache.players[String(id)]);

        if (missingPlayerIds.length > 0) {
          fetchStatus.players.loading = true;
          fetchStatus.players.error = null;

          try {
            const { response } = await PlayerService.getReferrersList({
              playesIds: missingPlayerIds
            });
            if (response?.data) {
              // Store each player in cache
              response.data.forEach((player) => {
                const playerId = String(player.UserID);
                cache.players[playerId] = {
                  value: playerId,
                  label: player.Username || `Player ${playerId}`
                };
              });

              notifySubscribers();
            }
          } catch (error) {
            console.error('Error fetching players:', error);
            fetchStatus.players.error = error;
          } finally {
            fetchStatus.players.loading = false;
          }
        }
      }
    };

    fetchData();
  }, [fetchCountries, fetchCurrencies, fetchAffiliates, playerIds]);

  return {
    // Options arrays for Combobox/Listbox components
    countryOptions: cache.countries || [],
    currencyOptions: cache.currencies || [],
    affiliateOptions: cache.affiliates || [],
    playerOptions: Object.values(cache.players || {}), // Convert players object to array

    // Maps for quick lookups (used in RuleTreeDisplay)
    countryMap: cache.countryMap || {},
    currencyMap: cache.currencyMap || {},
    affiliateMap: cache.affiliateMap || {},

    // Loading states
    isLoadingCountries: fetchStatus.countries.loading,
    isLoadingCurrencies: fetchStatus.currencies.loading,
    isLoadingAffiliates: fetchStatus.affiliates.loading,
    isLoadingPlayers: fetchStatus.players.loading,

    // Error states
    countriesError: fetchStatus.countries.error,
    currenciesError: fetchStatus.currencies.error,
    affiliatesError: fetchStatus.affiliates.error,
    playersError: fetchStatus.players.error
  };
};

/**
 * Helper function to clear the cache (useful for testing or forced refresh)
 */
export const clearSegmentationMappingsCache = () => {
  cache.countries = null;
  cache.currencies = null;
  cache.affiliates = null;
  cache.countryMap = null;
  cache.currencyMap = null;
  cache.affiliateMap = null;
  notifySubscribers();
};
