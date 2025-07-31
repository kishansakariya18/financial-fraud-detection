import { lazy } from 'react';
import { Loadable } from 'components/shared/Loadable';

const RegistrationFields = Loadable(
  lazy(() => import('app/pages/registration-fields/RegistrationFields'))
);

const registrationFieldsRoute = [
  {
    path: 'registration-fields',
    element: <RegistrationFields />
  }
];

export default registrationFieldsRoute;
