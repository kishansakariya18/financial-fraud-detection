import { apiConfig } from 'configs/api.config';

/**
 * Checks if a navigation item is allowed for the current platform
 * @param {Object} navigationItem - The navigation item object
 * @param {string} platformType - The platform type (b2b/b2c) - optional, defaults to config
 * @returns {boolean} - Whether the item is allowed
 */
export function isNavigationItemAllowed(navigationItem, platformType = null) {
  const currentPlatform = platformType || apiConfig.platformType?.toLowerCase();

  // If navigation item doesn't have platformType property, it's allowed in all platforms
  if (!navigationItem.platformType) {
    return true;
  }

  // Handle different platformType formats
  const allowedPlatforms = Array.isArray(navigationItem.platformType)
    ? navigationItem.platformType
    : [navigationItem.platformType];

  // Check if current platform is in allowed platforms
  return allowedPlatforms.some((platform) => platform.toLowerCase() === currentPlatform);
}

/**
 * Filters navigation items based on platform type
 * @param {Array} navigationItems - Array of navigation items
 * @param {string} platformType - The platform type (optional, defaults to config)
 * @returns {Array} - Filtered navigation items
 */
export function filterNavigationByPlatform(navigationItems, platformType = null) {
  console.log('navigationItems', navigationItems);
  return navigationItems.filter((item) => {
    // Check if the main item is allowed
    if (!isNavigationItemAllowed(item, platformType)) {
      return false;
    }
    // If item has children, filter them too
    if (item.childs && Array.isArray(item.childs)) {
      console.log('navigationItems', navigationItems);
      item.childs = filterNavigationByPlatform(item.childs, platformType);

      // If all children were filtered out, remove the parent item
      if (item.childs.length === 0 && item.type !== 'NAV_TYPE_ITEM') {
        return false;
      }
    }

    return true;
  });
}

/**
 * Gets the current platform type from config
 * @returns {string} - Current platform type
 */
export function getCurrentPlatformType() {
  return apiConfig.platformType?.toLowerCase() || 'b2c';
}

/**
 * Checks if the current platform is B2B
 * @returns {boolean}
 */
export function isB2BPlatform() {
  return getCurrentPlatformType() === 'b2b';
}

/**
 * Checks if the current platform is B2C
 * @returns {boolean}
 */
export function isB2CPlatform() {
  return getCurrentPlatformType() === 'b2c';
}
