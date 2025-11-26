import * as Yup from 'yup';
import {
  NumericOperator,
  DatetimeOperator,
  EnumStringOperator,
  requiresValue,
  getAttribute
} from './attributeRegistry';

// Recursive schema for validating rule tree nodes
const createConditionSchema = () => {
  return Yup.object().shape({
    id: Yup.string().required('Condition ID is required'),
    field: Yup.string()
      .required('Attribute is required')
      .test('not-empty', 'Attribute is required', (value) => {
        return value && value.trim().length > 0;
      }),
    operator: Yup.string()
      .required('Operator is required')
      .test('not-empty', 'Operator is required', (value) => {
        return value && value.trim().length > 0;
      }),
    value: Yup.mixed()
      .nullable()
      .test('value-validation', 'Value is required', function (value) {
        const { operator, field } = this.parent;

        // Skip validation if operator or field is not set yet
        if (!operator || !field) {
          return true;
        }

        if (!requiresValue(operator)) {
          return true; // No value needed for is_true, is_false, is_null, is_not_null
        }

        // Get attribute metadata to determine data type
        const attribute = getAttribute(field);
        if (!attribute) {
          return this.createError({ message: 'Invalid attribute' });
        }

        const dataType = attribute.dataType;

        // Between numeric - expects array [min, max]
        if (operator === NumericOperator.BETWEEN && dataType === 'numeric') {
          if (!Array.isArray(value)) {
            return this.createError({ message: 'Please enter min and max values' });
          }
          if (value.length !== 2) {
            return this.createError({ message: 'Please enter min and max values' });
          }
          if (typeof value[0] !== 'number' || typeof value[1] !== 'number') {
            return this.createError({ message: 'Both min and max must be numbers' });
          }
          if (value[0] >= value[1]) {
            return this.createError({ message: 'Max must be greater than min' });
          }
          return true;
        }

        // Numeric operators - only validate as number if attribute is numeric
        if (
          [
            NumericOperator.EQUALS,
            NumericOperator.NOT_EQUALS,
            NumericOperator.GREATER_THAN,
            NumericOperator.LESS_THAN
          ].includes(operator)
        ) {
          // Check if this is a numeric attribute
          if (dataType === 'numeric') {
            if (typeof value !== 'number') {
              return this.createError({ message: 'Value must be a number' });
            }
            return true;
          }

          // For string/enum attributes with equals/not_equals
          if (dataType === 'string' || dataType === 'enum') {
            if (value === null || value === undefined || value === '') {
              return this.createError({ message: 'Value is required' });
            }
            return true;
          }
        }

        // Relative time operators
        if (
          operator === DatetimeOperator.LESS_THAN_X_AGO ||
          operator === DatetimeOperator.GREATER_THAN_X_AGO
        ) {
          if (!value || typeof value !== 'object') {
            return this.createError({ message: 'Value must be an object with amount and unit' });
          }
          if (typeof value.amount !== 'number' || value.amount < 0) {
            return this.createError({ message: 'Amount must be a positive number' });
          }
          if (!['minutes', 'hours', 'days', 'weeks', 'months'].includes(value.unit)) {
            return this.createError({ message: 'Invalid time unit' });
          }
          return true;
        }

        // Between relative
        if (operator === DatetimeOperator.BETWEEN_RELATIVE) {
          if (!value || typeof value !== 'object') {
            return this.createError({
              message: 'Value must be an object with from and to'
            });
          }
          if (!value.from || !value.to) {
            return this.createError({ message: 'Both from and to are required' });
          }
          if (typeof value.from.amount !== 'number' || typeof value.to.amount !== 'number') {
            return this.createError({ message: 'Amounts must be numbers' });
          }
          if (
            !['minutes', 'hours', 'days', 'weeks', 'months'].includes(value.from.unit) ||
            !['minutes', 'hours', 'days', 'weeks', 'months'].includes(value.to.unit)
          ) {
            return this.createError({ message: 'Invalid time units' });
          }
          return true;
        }

        // Between date range - expects array [fromDate, toDate]
        if (operator === DatetimeOperator.BETWEEN_DATE_RANGE && dataType === 'datetime') {
          if (!Array.isArray(value)) {
            return this.createError({
              message: 'Please enter from and to dates'
            });
          }
          if (value.length !== 2) {
            return this.createError({ message: 'Please enter from and to dates' });
          }
          if (!value[0] || !value[1]) {
            return this.createError({ message: 'Please enter from and to dates' });
          }
          const fromDate = new Date(value[0]);
          const toDate = new Date(value[1]);
          if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            return this.createError({ message: 'Invalid date format' });
          }
          if (fromDate >= toDate) {
            return this.createError({ message: 'To date must be after from date' });
          }
          return true;
        }

        // In/Not In operators
        if (operator === EnumStringOperator.IN || operator === EnumStringOperator.NOT_IN) {
          if (!Array.isArray(value)) {
            return this.createError({ message: 'Value must be an array' });
          }
          if (value.length === 0) {
            return this.createError({ message: 'At least one value is required' });
          }
          return true;
        }

        return true;
      })
  });
};

// Recursive schema for groups
const createGroupSchema = () => {
  return Yup.lazy(() =>
    Yup.object().shape({
      id: Yup.string().required('Group ID is required'),
      operator: Yup.string()
        .oneOf(['AND', 'OR'], 'Operator must be AND or OR')
        .required('Group operator is required'),
      conditions: Yup.array()
        .of(
          Yup.lazy((child) => {
            // Check if child is a group (has conditions array) or condition (has field)
            if (child && child.conditions !== undefined) {
              return createGroupSchema();
            }
            return createConditionSchema();
          })
        )
        .min(1, 'Group must have at least one child')
        .required('Conditions are required')
    })
  );
};

// Main validation schema for the entire form
export const playerSegmentationSchema = Yup.object().shape({
  segmentName: Yup.string()
    .required('Segment name is required')
    .max(255, 'Segment name cannot exceed 255 characters'),
  // .matches(
  //   /^[a-zA-Z0-9\s\-_]+$/,
  //   'Segment name can only contain letters, numbers, spaces, hyphens, and underscores'
  // ),

  segmentDescription: Yup.string()
    .nullable()
    .max(1000, 'Description cannot exceed 1000 characters'),

  segmentTag: Yup.string().nullable().max(100, 'Tag cannot exceed 100 characters'),
  // .matches(/^[a-zA-Z0-9_-]*$/, 'Tag can only contain letters, numbers, hyphens, and underscores'),

  segmentRules: Yup.lazy(() => {
    // Validate as a group schema
    return Yup.object()
      .shape({
        id: Yup.string().required('Group ID is required'),
        operator: Yup.string()
          .oneOf(['AND', 'OR'], 'Operator must be AND or OR')
          .required('Group operator is required'),
        conditions: Yup.array()
          .of(
            Yup.lazy((child) => {
              // Check if child is a group (has conditions array) or condition (has field)
              if (child && child.conditions !== undefined) {
                return createGroupSchema();
              }
              return createConditionSchema();
            })
          )
          .min(1, 'Group must have at least one child')
          .required('Conditions are required')
      })
      .required('Segment rules are required')
      .test('rule-tree-structure', 'Invalid rule structure', function (value) {
        if (!value) return this.createError({ message: 'Segment rules are required' });
        // Check basic structure
        if (!value.id || !value.operator) {
          return this.createError({ message: 'Invalid rule structure' });
        }
        return true;
      })
      .test('condition-count', 'At least one condition is required', function (value) {
        if (!value) return true;

        // Count conditions recursively
        const countConditions = (node) => {
          // Conditions have 'field' property
          if (node.field !== undefined) return 1;
          // Groups have 'conditions' array
          if (node.conditions && Array.isArray(node.conditions)) {
            return node.conditions.reduce((sum, child) => sum + countConditions(child), 0);
          }
          return 0;
        };

        const totalConditions = countConditions(value);
        if (totalConditions === 0) {
          return this.createError({ message: 'At least one condition is required' });
        }

        return true;
      })
      .test('nesting-depth', 'Maximum nesting depth exceeded (10 levels)', function (value) {
        if (!value) return true;

        // Check depth recursively
        const getDepth = (node, currentDepth = 0) => {
          // Conditions have 'field' property
          if (node.field !== undefined) return currentDepth;
          // Groups have 'conditions' array
          if (node.conditions && Array.isArray(node.conditions) && node.conditions.length > 0) {
            const childDepths = node.conditions.map((child) => getDepth(child, currentDepth + 1));
            return Math.max(...childDepths);
          }
          return currentDepth;
        };

        const depth = getDepth(value);
        if (depth > 10) {
          return this.createError({ message: 'Maximum nesting depth exceeded (10 levels)' });
        }

        return true;
      });
  }),

  isScheduled: Yup.boolean().nullable(),

  evaluationFrequency: Yup.string()
    .nullable()
    .when('isScheduled', {
      is: true,
      then: (schema) =>
        schema
          .oneOf(['NONE', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'], 'Invalid evaluation frequency')
          .required('Evaluation frequency is required when scheduled'),
      otherwise: (schema) => schema.nullable()
    })
});

// Edit mode schema (includes segmentationUID)
export const playerSegmentationEditSchema = playerSegmentationSchema.shape({
  segmentationUID: Yup.string().required('Segmentation UID is required for editing')
});

// Helper to extract validation errors for specific nodes
export const extractRuleErrors = (errors) => {
  const ruleErrors = {};

  if (!errors || !errors.segmentRules) {
    return ruleErrors;
  }

  // Parse tree errors from Yup
  const parseErrors = (path, error) => {
    const match = path.match(/conditions\[(\d+)\]/g);
    if (match) {
      // Extract node IDs from path if possible
      // This is a simplified approach; in practice, you might need
      // to traverse the tree to map indices to IDs
      ruleErrors[path] = error;
    }
  };

  if (Array.isArray(errors.segmentRules)) {
    errors.segmentRules.forEach((err) => {
      if (err.path) {
        parseErrors(err.path, err.message);
      }
    });
  }

  return ruleErrors;
};
