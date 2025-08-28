import * as Yup from 'yup';

export const createBannerSchema = Yup.object().shape({
  bannerName: Yup.string().trim().required('Banner Name is required'),
  placementType: Yup.number().required('Placement Type is required'),
  segmentationType: Yup.number()
    .oneOf([0, 1], 'Invalid segmentation type')
    .required('Segmentation Type is required'),
  segmentIds: Yup.array()
    .of(Yup.number())
    .when('segmentationType', {
      is: 1,
      then: (schema) => schema.min(1, 'Select at least one banner segmentation').required(),
      otherwise: (schema) => schema.optional()
    }),
  startDate: Yup.date()
    .nullable()
    .notRequired()
    .test(
      'start-date-required-if-end-date',
      'If End Date is provided, Start Date must also be provided.',
      function (value) {
        const { endDate } = this.parent;
        if (endDate && !value) {
          return false;
        }
        return true;
      }
    ),
  endDate: Yup.date()
    .nullable()
    .notRequired()
    .test(
      'end-date-required-if-start-date',
      'If Start Date is provided, End Date must also be provided.',
      function (value) {
        const { startDate } = this.parent;
        if (startDate && !value) {
          return false;
        }
        return true;
      }
    )
    .test('end-date-after-start-date', 'End Date should be after Start Date', function (value) {
      const { startDate } = this.parent;
      if (startDate && value) {
        return new Date(value) > new Date(startDate);
      }
      return true;
    }),
  bannerHeadline: Yup.string().optional(),
  bannerSubHeadline: Yup.string().optional(),
  targetUrl: Yup.string()
    .test('is-valid-url', 'Enter a correct URL!', function () {
      const { targetUrl } = this.parent;

      if (targetUrl && targetUrl.trim().length > 0) {
        const urlPattern =
          /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
        return urlPattern.test(targetUrl);
      }
      return true;
    })
    .required('Target URL is required')
});

export const editBannerSchema = Yup.object().shape({
  bannerName: Yup.string().trim().required('Banner Name is required'),
  placementType: Yup.number().required('Placement Type is required'),
  segmentationType: Yup.number()
    .oneOf([0, 1], 'Invalid segmentation type')
    .required('Segmentation Type is required'),
  segmentIds: Yup.array()
    .of(Yup.number())
    .when('segmentationType', {
      is: 1,
      then: (schema) => schema.min(1, 'Select at least one banner segmentation').required(),
      otherwise: (schema) => schema.optional()
    }),
  startDate: Yup.date()
    .nullable()
    .notRequired()
    .test(
      'start-date-required-if-end-date',
      'If End Date is provided, Start Date must also be provided.',
      function (value) {
        const { endDate } = this.parent;
        if (endDate && !value) {
          return false;
        }
        return true;
      }
    ),
  endDate: Yup.date()
    .nullable()
    .notRequired()
    .test(
      'end-date-required-if-start-date',
      'If Start Date is provided, End Date must also be provided.',
      function (value) {
        const { startDate } = this.parent;
        if (startDate && !value) {
          return false;
        }
        return true;
      }
    )
    .test('end-date-after-start-date', 'End Date should be after Start Date', function (value) {
      const { startDate } = this.parent;
      if (startDate && value) {
        return new Date(value) > new Date(startDate);
      }
      return true;
    }),
  bannerHeadline: Yup.string().nullable().optional(),
  bannerSubHeadline: Yup.string().nullable().optional(),
  targetUrl: Yup.string()
    .test('is-valid-url', 'Enter a correct URL!', function () {
      const { targetUrl } = this.parent;

      if (targetUrl && targetUrl.trim().length > 0) {
        const urlPattern =
          /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
        return urlPattern.test(targetUrl);
      }
      return true;
    })
    .required('Target URL is required')
});
