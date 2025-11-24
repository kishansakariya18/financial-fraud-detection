// Rule Builder Utility Functions
// Helper functions for managing rule tree operations

import { v4 as uuidv4 } from 'uuid';

// Generate unique IDs for groups and conditions
export const generateId = (prefix = 'node') => {
  return `${prefix}-${uuidv4().slice(0, 8)}`;
};

// Create a new empty group
export const createEmptyGroup = (operator = 'AND') => ({
  id: generateId('grp'),
  type: 'group',
  operator,
  children: []
});

// Create a new empty condition
export const createEmptyCondition = () => ({
  id: generateId('cond'),
  type: 'condition',
  attributeKey: '',
  operator: '',
  value: null
});

// Create default root structure
export const createDefaultRuleTree = () => ({
  root: {
    ...createEmptyGroup('AND'),
    children: [createEmptyCondition()]
  }
});

// Find a node by ID in the tree (recursive)
export const findNodeById = (node, targetId) => {
  if (node.id === targetId) {
    return node;
  }

  if (node.type === 'group' && node.children) {
    for (const child of node.children) {
      const found = findNodeById(child, targetId);
      if (found) return found;
    }
  }

  return null;
};

// Find parent of a node by child ID (recursive)
export const findParentNode = (node, targetId, parent = null) => {
  if (node.id === targetId) {
    return parent;
  }

  if (node.type === 'group' && node.children) {
    for (const child of node.children) {
      const found = findParentNode(child, targetId, node);
      if (found) return found;
    }
  }

  return null;
};

// Update a node in the tree (returns new tree)
export const updateNodeInTree = (tree, nodeId, updateFn) => {
  const updateNode = (node) => {
    if (node.id === nodeId) {
      return updateFn(node);
    }

    if (node.type === 'group' && node.children) {
      return {
        ...node,
        children: node.children.map(updateNode)
      };
    }

    return node;
  };

  return {
    root: updateNode(tree.root)
  };
};

// Add a child to a group
export const addChildToGroup = (tree, groupId, child) => {
  return updateNodeInTree(tree, groupId, (node) => ({
    ...node,
    children: [...node.children, child]
  }));
};

// Remove a node from the tree
export const removeNodeFromTree = (tree, nodeId) => {
  const removeFromChildren = (children) => {
    return children.filter((child) => {
      if (child.id === nodeId) {
        return false;
      }
      if (child.type === 'group') {
        child.children = removeFromChildren(child.children);
      }
      return true;
    });
  };

  return {
    root: {
      ...tree.root,
      children: removeFromChildren(tree.root.children)
    }
  };
};

// Toggle group operator (AND <-> OR)
export const toggleGroupOperator = (tree, groupId) => {
  return updateNodeInTree(tree, groupId, (node) => ({
    ...node,
    operator: node.operator === 'AND' ? 'OR' : 'AND'
  }));
};

// Count total conditions in tree (recursive)
export const countConditions = (node) => {
  if (node.type === 'condition') {
    return 1;
  }

  if (node.type === 'group' && node.children) {
    return node.children.reduce((sum, child) => sum + countConditions(child), 0);
  }

  return 0;
};

// Get nesting depth of tree
export const getTreeDepth = (node, currentDepth = 0) => {
  if (node.type === 'condition') {
    return currentDepth;
  }

  if (node.type === 'group' && node.children && node.children.length > 0) {
    const childDepths = node.children.map((child) => getTreeDepth(child, currentDepth + 1));
    return Math.max(...childDepths);
  }

  return currentDepth;
};

// Validate rule tree structure
export const validateRuleTree = (tree) => {
  const errors = [];

  if (!tree || !tree.root) {
    errors.push('Rule tree must have a root node');
    return { valid: false, errors };
  }

  const conditionCount = countConditions(tree.root);
  if (conditionCount === 0) {
    errors.push('Rule tree must have at least one condition');
  }

  const depth = getTreeDepth(tree.root);
  if (depth > 10) {
    errors.push('Rule tree exceeds maximum nesting depth of 10');
  }

  // Validate each node recursively
  const validateNode = (node, path = 'root') => {
    if (!node.id || !node.type) {
      errors.push(`Invalid node structure at ${path}`);
      return;
    }

    if (node.type === 'group') {
      if (!node.operator || !['AND', 'OR'].includes(node.operator)) {
        errors.push(`Invalid group operator at ${path}`);
      }

      if (!Array.isArray(node.children)) {
        errors.push(`Group must have children array at ${path}`);
      } else {
        node.children.forEach((child, index) => {
          validateNode(child, `${path}.children[${index}]`);
        });
      }
    } else if (node.type === 'condition') {
      if (!node.attributeKey) {
        errors.push(`Condition missing attributeKey at ${path}`);
      }

      if (!node.operator) {
        errors.push(`Condition missing operator at ${path}`);
      }

      // Value validation is context-dependent, handled in form validation
    } else {
      errors.push(`Unknown node type at ${path}: ${node.type}`);
    }
  };

  validateNode(tree.root);

  return {
    valid: errors.length === 0,
    errors
  };
};

// Clone a node (deep copy)
export const cloneNode = (node) => {
  if (node.type === 'condition') {
    return {
      ...node,
      id: generateId('cond'),
      value: node.value && typeof node.value === 'object' ? { ...node.value } : node.value
    };
  }

  if (node.type === 'group') {
    return {
      ...node,
      id: generateId('grp'),
      children: node.children ? node.children.map(cloneNode) : []
    };
  }

  return node;
};

// Flatten tree to array of conditions (for debugging/display)
export const flattenConditions = (node, path = []) => {
  const results = [];

  if (node.type === 'condition') {
    results.push({
      ...node,
      path: [...path, node.id]
    });
  } else if (node.type === 'group' && node.children) {
    node.children.forEach((child, index) => {
      results.push(...flattenConditions(child, [...path, `${node.operator}[${index}]`]));
    });
  }

  return results;
};

// Check if a node can be removed (root group cannot be removed)
export const canRemoveNode = (tree, nodeId) => {
  return tree.root.id !== nodeId;
};

// Get human-readable summary of condition
export const getConditionSummary = (condition, attributeRegistry, operatorLabels) => {
  const attribute = attributeRegistry[condition.attributeKey];
  const attrLabel = attribute?.label || condition.attributeKey;
  const operatorLabel = operatorLabels[condition.operator] || condition.operator;

  let valueStr = '';
  if (condition.value !== null && condition.value !== undefined) {
    if (typeof condition.value === 'object') {
      valueStr = JSON.stringify(condition.value);
    } else {
      valueStr = String(condition.value);
    }
  }

  return `${attrLabel} ${operatorLabel} ${valueStr}`.trim();
};
