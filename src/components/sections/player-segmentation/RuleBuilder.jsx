import { useTranslation } from 'react-i18next';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from 'components/ui';
import { Listbox } from 'components/shared/form/Listbox';
import ConditionEditor from './ConditionEditor';
import {
  createEmptyCondition,
  createEmptyGroup,
  addChildToGroup,
  removeNodeFromTree,
  updateNodeInTree,
  cloneNode,
  createDefaultRuleTree
} from './ruleUtils';

const RuleGroup = ({ group, onChange, onRemove, disabled, depth = 0, isRoot = false, errors }) => {
  const { t } = useTranslation();
  const maxDepth = 10;
  const canNest = depth < maxDepth;

  const operatorOptions = [
    { value: 'AND', label: t('all') },
    { value: 'OR', label: t('at_least_one') }
  ];

  const handleOperatorChange = (opt) => {
    const newTree = updateNodeInTree({ root: group }, group.id, (node) => ({
      ...node,
      operator: opt.value
    }));
    onChange(newTree.root);
  };

  const handleAddCondition = () => {
    const newCondition = createEmptyCondition();
    const newTree = addChildToGroup({ root: group }, group.id, newCondition);
    onChange(newTree.root);
  };

  const handleAddGroup = () => {
    if (!canNest) return;
    const newGroup = createEmptyGroup('AND');
    newGroup.children = [createEmptyCondition()];
    const newTree = addChildToGroup({ root: group }, group.id, newGroup);
    onChange(newTree.root);
  };

  const handleRemoveChild = (childId) => {
    // Prevent removing the last child
    console.log(childId, group.children.length, isRoot);
    if (group.children.length <= 1 && isRoot) {
      return;
    }

    const newTree = removeNodeFromTree({ root: group }, childId);
    onChange(newTree.root);
  };

  const handleUpdateChild = (childId, updatedChild) => {
    const newTree = updateNodeInTree({ root: group }, childId, () => updatedChild);
    onChange(newTree.root);
  };

  const handleCopyChild = (child) => {
    const clonedChild = cloneNode(child);
    const newTree = addChildToGroup({ root: group }, group.id, clonedChild);
    onChange(newTree.root);
  };

  // Background colors for nested hierarchy
  const bgColors = [
    'bg-gray-50 dark:bg-dark-800',
    'bg-white dark:bg-dark-750',
    'bg-gray-50 dark:bg-dark-800',
    'bg-white dark:bg-dark-750'
  ];
  const bgColor = bgColors[depth % bgColors.length];

  return (
    <div
      className={`rounded-lg border border-gray-200 dark:border-dark-600 ${bgColor} p-3`}
      style={{ marginLeft: depth > 0 ? `${depth * 16}px` : '0' }}>
      {/* Group Header */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* AND/OR Dropdown */}
          <Listbox
            data={operatorOptions}
            value={operatorOptions.find((opt) => opt.value === group.operator) || null}
            onChange={handleOperatorChange}
            displayField="label"
            classNames={{ root: 'w-[140px]' }}
          />
          <span className="text-xs text-gray-600 dark:text-dark-300">
            {t('of_the_following_conditions_match')}
          </span>

          {/* {depth > 0 && (
            <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-dark-700 dark:text-dark-300">
              Depth: {depth}
            </span>
          )} */}
        </div>

        <div className="flex items-center gap-2">
          {/* Remove Group Button (only if not root) */}
          {!isRoot && (
            <Button
              isIcon
              color="error"
              type="button"
              onClick={onRemove}
              disabled={disabled}
              variant="flat"
              className="size-9">
              <TrashIcon className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Children */}
      <div className="space-y-2">
        {group.children && group.children.length > 0 ? (
          group.children.map((child, index) => (
            <div key={child.id} className="flex items-start gap-2">
              {/* Show operator chip on left side (except first) */}

              <div className={`flex-shrink-0 pt-2 ${index > 0 ? '' : 'invisible'}`}>
                <span className="inline-block rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-dark-600 dark:text-dark-300">
                  {group.operator}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                {child.type === 'condition' ? (
                  <ConditionEditor
                    condition={child}
                    onChange={(updatedCondition) => handleUpdateChild(child.id, updatedCondition)}
                    onRemove={() => handleRemoveChild(child.id)}
                    onCopy={() => handleCopyChild(child)}
                    disabled={!!(group.children.length <= 1 && isRoot)}
                    error={errors?.[child.id]}
                  />
                ) : (
                  <RuleGroup
                    group={child}
                    onChange={(updatedGroup) => handleUpdateChild(child.id, updatedGroup)}
                    onRemove={() => handleRemoveChild(child.id)}
                    disabled={!!(group.children.length <= 1 && isRoot)}
                    depth={depth + 1}
                    isRoot={false}
                    errors={errors}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded border-2 border-dashed border-gray-300 p-6 text-center dark:border-dark-600">
            <p className="text-sm text-gray-500 dark:text-dark-400">{t('no_conditions_add_one')}</p>
          </div>
        )}
      </div>

      {/* Add buttons */}
      <div className="mt-3 flex items-center gap-3 border-t border-gray-200 pt-2 dark:border-dark-600">
        <button
          type="button"
          onClick={handleAddCondition}
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
          <PlusIcon className="size-4" />
          <span>
            {t('add')} {t('condition')}
          </span>
        </button>

        {canNest && (
          <button
            type="button"
            onClick={handleAddGroup}
            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
            <PlusIcon className="size-4" />
            <span>
              {t('add')} {t('group')}
            </span>
          </button>
        )}
      </div>

      {/* Max Depth Warning */}
      {!canNest && (
        <div className="mt-3 rounded bg-yellow-50 p-2 text-xs text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
          {t('maximum_nesting_depth_reached')}
        </div>
      )}
    </div>
  );
};

const RuleBuilder = ({ value, onChange, error }) => {
  const { t } = useTranslation();

  const handleChange = (newRoot) => {
    onChange({ root: newRoot });
  };

  // Extract individual field errors from react-hook-form nested structure
  const extractFieldErrors = (ruleTree, errors) => {
    const fieldErrors = {};

    if (!errors || !ruleTree) return fieldErrors;

    // Handle case where errors is an object with nested structure from Yup
    const errorObj = typeof errors === 'object' ? errors : {};

    // Recursively traverse both value tree and error tree together
    const traverse = (node, errorNode, path = '') => {
      if (!node) return;

      // If this node is a condition, extract field errors
      if (node.type === 'condition' && errorNode) {
        const hasErrors =
          errorNode.attributeKey || errorNode.operator || errorNode.value || errorNode.message;

        if (hasErrors) {
          fieldErrors[node.id] = {};

          // Extract specific field errors
          if (errorNode.attributeKey) {
            fieldErrors[node.id].attributeKey =
              typeof errorNode.attributeKey === 'string'
                ? errorNode.attributeKey
                : errorNode.attributeKey.message || 'Attribute is required';
          }

          if (errorNode.operator) {
            fieldErrors[node.id].operator =
              typeof errorNode.operator === 'string'
                ? errorNode.operator
                : errorNode.operator.message || 'Operator is required';
          }

          if (errorNode.value) {
            fieldErrors[node.id].value =
              typeof errorNode.value === 'string'
                ? errorNode.value
                : errorNode.value.message || 'Value is required';
          }

          // If there's a general message but no field-specific ones
          if (
            errorNode.message &&
            !errorNode.attributeKey &&
            !errorNode.operator &&
            !errorNode.value
          ) {
            fieldErrors[node.id].message = errorNode.message;
          }
        }
      }

      // Traverse children for groups
      if (node.type === 'group' && node.children && Array.isArray(node.children)) {
        node.children.forEach((child, index) => {
          let childError = null;

          // Try to get error for this child
          if (errorNode && errorNode.children) {
            if (Array.isArray(errorNode.children)) {
              childError = errorNode.children[index];
            } else if (typeof errorNode.children === 'object') {
              childError = errorNode.children[index.toString()] || errorNode.children[index];
            }
          }

          traverse(child, childError, `${path}.children[${index}]`);
        });
      }
    };

    // Start traversal from root
    if (errorObj.root && ruleTree.root) {
      traverse(ruleTree.root, errorObj.root, 'root');
    } else if (ruleTree.root) {
      // Try traversing with the error object directly in case it's structured differently
      traverse(ruleTree.root, errorObj, 'root');
    }

    return fieldErrors;
  };

  // Get field-level errors
  const fieldErrors = extractFieldErrors(value, error);

  const handleResetToDefault = () => {
    const defaultTree = createDefaultRuleTree();
    onChange(defaultTree);
  };

  if (!value || !value.root) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-100">
          {t('segment_rules')} *
        </label>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg
                className="size-5 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="font-medium text-red-800 dark:text-red-300">
                {t('invalid_rule_structure')}
              </p>
            </div>
            <p className="text-sm text-red-700 dark:text-red-400">
              {t('resetto_default_rules_info')}
            </p>
            <Button type="button" color="error" onClick={handleResetToDefault}>
              {t('resetto_default_rules')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-100">
          {t('segment_rules')} *
        </label>
        {error && typeof error === 'string' && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      <RuleGroup
        group={value.root}
        onChange={handleChange}
        onRemove={() => {
          console.log('Remove root group', value.root);
        }}
        depth={0}
        isRoot={true}
        errors={fieldErrors}
      />
    </div>
  );
};

export default RuleBuilder;
