import { createSafeContext } from 'utils/createSafeContext';

export const [PageHelpContextProvider, usePageHelp] = createSafeContext(
  'usePageHelp must be used within PageHelpProvider'
);
