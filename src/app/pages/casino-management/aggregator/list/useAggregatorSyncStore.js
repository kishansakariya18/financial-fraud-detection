import { useSyncExternalStore } from 'react';

const subscribers = new Set();

const initialState = {
  status: 'idle',
  isSyncing: false,
  activeAggregator: null,
  startedAt: null,
  message: null
};

let state = initialState;

const notify = () => {
  subscribers.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.warn('Aggregator sync subscriber error', error);
    }
  });
};

const setState = (partial) => {
  state = {
    ...state,
    ...partial
  };
  notify();
};

const subscribe = (listener) => {
  subscribers.add(listener);
  return () => {
    subscribers.delete(listener);
  };
};

const getSnapshot = () => state;

export const startAggregatorSync = (aggregatorName) => {
  setState({
    status: 'loading',
    isSyncing: true,
    activeAggregator: aggregatorName,
    startedAt: Date.now(),
    message: null
  });
};

export const completeAggregatorSync = ({
  status = 'idle',
  message = null,
  aggregatorName
} = {}) => {
  const nextStatus = status;
  const nextActiveAggregator =
    nextStatus === 'error' ? aggregatorName || state.activeAggregator : null;

  setState({
    status: nextStatus,
    isSyncing: false,
    activeAggregator: nextActiveAggregator,
    startedAt: null,
    message
  });
};

export const clearAggregatorSync = () => {
  setState(initialState);
};

export const useAggregatorSyncStore = () => useSyncExternalStore(subscribe, getSnapshot);
