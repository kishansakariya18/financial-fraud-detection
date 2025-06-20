import * as Yup from 'yup';

export const createBannerSchema = Yup.object().shape({
  bannerName: Yup.string().trim().required('Banner Name is required'),
  placementType: Yup.number().required('Placement Type is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().required('End date is required'),
  bannerHeadline: Yup.string().required('Banner Headline is required'),
  bannerSubHeadline: Yup.string().required('Banner Sub Headline is required'),
  targetUrl: Yup.string().required('Target URL is required')
});

export const editBannerSchema = Yup.object().shape({
  bannerName: Yup.string().trim().required('Banner Name is required'),
  placementType: Yup.number().required('Placement Type is required'),
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date().required('End date is required'),
  bannerHeadline: Yup.string().required('Banner Headline is required'),
  bannerSubHeadline: Yup.string().required('Banner Sub Headline is required'),
  targetUrl: Yup.string().required('Target URL is required')
});
