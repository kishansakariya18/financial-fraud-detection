import { Navigate } from "react-router";

export const emailTemplateRoutes = [
    {
        path: "email-templates",
        children: [
          { 
            index: true,
            element: <Navigate to="/add" />,
          },
          {
            path: "add",
            lazy: async () => ({
              Component:  (await import("../../pages/email-templates/AddEmailTemplate")).default,
            }),
          },
          {
            path: "edit/:emailTemplateId",
            lazy: async () => ({
              Component:  (await import("../../pages/email-templates/EditEmailTemplate")).default,
            }),
          }
        ],
    },
];
  
export default emailTemplateRoutes;
 