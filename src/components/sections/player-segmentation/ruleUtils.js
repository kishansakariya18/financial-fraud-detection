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
  operator,
  conditions: []
});

// Create a new empty condition
export const createEmptyCondition = () => ({
  id: generateId('cond'),
  field: '',
  dataType: '',
  operator: '',
  value: null
});

// Create a default rule tree with a root group containing one empty condition
export const createDefaultRuleTree = () => ({
  ...createEmptyGroup('AND'),
  conditions: [createEmptyCondition()]
});

// Find a node by ID in the tree (recursive)
export const findNodeById = (node, targetId) => {
  if (node.id === targetId) {
    return node;
  }

  // Groups have 'conditions' array
  if (node.conditions && Array.isArray(node.conditions)) {
    for (const child of node.conditions) {
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

  // Groups have 'conditions' array
  if (node.conditions && Array.isArray(node.conditions)) {
    for (const child of node.conditions) {
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

    // Groups have 'conditions' array
    if (node.conditions && Array.isArray(node.conditions)) {
      return {
        ...node,
        conditions: node.conditions.map(updateNode)
      };
    }

    return node;
  };

  return updateNode(tree);
};

// Add a child to a group
export const addChildToGroup = (tree, groupId, child) => {
  return updateNodeInTree(tree, groupId, (node) => ({
    ...node,
    conditions: [...node.conditions, child]
  }));
};

// Remove a node from the tree
export const removeNodeFromTree = (tree, nodeId) => {
  const removeFromChildren = (conditions) => {
    return conditions.filter((child) => {
      if (child.id === nodeId) {
        return false;
      }
      // Groups have 'conditions' array
      if (child.conditions && Array.isArray(child.conditions)) {
        child.conditions = removeFromChildren(child.conditions);
      }
      return true;
    });
  };

  return {
    ...tree,
    conditions: removeFromChildren(tree.conditions)
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
  // Conditions have 'field' property, groups have 'conditions' array
  if (node.field !== undefined) {
    return 1;
  }

  if (node.conditions && Array.isArray(node.conditions)) {
    return node.conditions.reduce((sum, child) => sum + countConditions(child), 0);
  }

  return 0;
};

// Get nesting depth of tree
export const getTreeDepth = (node, currentDepth = 0) => {
  console.log(node, currentDepth);
  // Conditions have 'field' property
  if (node.field !== undefined) {
    return currentDepth;
  }

  // Groups have 'conditions' array
  if (node.conditions && Array.isArray(node.conditions) && node.conditions.length > 0) {
    const childDepths = node.conditions.map((child) => getTreeDepth(child, currentDepth + 1));
    return Math.max(...childDepths);
  }

  return currentDepth;
};

// Validate rule tree structure
export const validateRuleTree = (tree) => {
  const errors = [];

  if (!tree || !tree.id) {
    errors.push('Rule tree must have a valid structure');
    return { valid: false, errors };
  }

  const conditionCount = countConditions(tree);
  if (conditionCount === 0) {
    errors.push('Rule tree must have at least one condition');
  }

  const depth = getTreeDepth(tree);
  if (depth > 10) {
    errors.push('Rule tree exceeds maximum nesting depth of 10');
  }

  // Validate each node recursively
  const validateNode = (node, path = 'root') => {
    if (!node.id) {
      errors.push(`Invalid node structure at ${path}`);
      return;
    }

    // Check if it's a group (has conditions array)
    if (node.conditions && Array.isArray(node.conditions)) {
      if (!node.operator || !['AND', 'OR'].includes(node.operator)) {
        errors.push(`Invalid group operator at ${path}`);
      }

      if (node.conditions.length === 0) {
        errors.push(`Group must have at least one condition at ${path}`);
      } else {
        node.conditions.forEach((child, index) => {
          validateNode(child, `${path}.conditions[${index}]`);
        });
      }
    }
    // Check if it's a condition (has field property)
    else if (node.field !== undefined) {
      if (!node.field) {
        errors.push(`Condition missing field at ${path}`);
      }

      if (!node.operator) {
        errors.push(`Condition missing operator at ${path}`);
      }

      // Value validation is context-dependent, handled in form validation
    } else {
      errors.push(`Unknown node structure at ${path}`);
    }
  };

  validateNode(tree);

  return {
    valid: errors.length === 0,
    errors
  };
};

// Clone a node (deep copy)
export const cloneNode = (node) => {
  // Conditions have 'field' property
  if (node.field !== undefined) {
    return {
      ...node,
      id: generateId('cond'),
      value: node.value
    };
  }

  // Groups have 'conditions' array
  if (node.conditions && Array.isArray(node.conditions)) {
    return {
      ...node,
      id: generateId('grp'),
      conditions: node.conditions.map(cloneNode)
    };
  }

  return node;
};

// Flatten tree to array of conditions (for debugging/display)
export const flattenConditions = (node, path = []) => {
  const results = [];

  // Conditions have 'field' property
  if (node.field !== undefined) {
    results.push({
      ...node,
      path: [...path, node.id]
    });
  }
  // Groups have 'conditions' array
  else if (node.conditions && Array.isArray(node.conditions)) {
    node.conditions.forEach((child, index) => {
      results.push(...flattenConditions(child, [...path, `${node.operator}[${index}]`]));
    });
  }

  return results;
};

// Check if a node can be removed (root group cannot be removed)
export const canRemoveNode = (tree, nodeId) => {
  return tree.id !== nodeId;
};

// Get human-readable summary of condition
export const getConditionSummary = (condition, attributeRegistry, operatorLabels) => {
  const attribute = attributeRegistry[condition.field];
  const attrLabel = attribute?.label || condition.field;
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

// Process rule tree recursively (map over nodes)
export const processRuleTree = (node, transformFn) => {
  if (!node) return node;

  // Clone node to avoid mutation
  const newNode = { ...node };

  // Groups have 'conditions' array
  if (newNode.conditions && Array.isArray(newNode.conditions)) {
    newNode.conditions = newNode.conditions.map((child) => processRuleTree(child, transformFn));
    return newNode;
  }

  // Conditions have 'field' property
  if (newNode.field !== undefined) {
    return transformFn(newNode);
  }

  return newNode;
};
