// import { Navigate } from "react-router";

export const countryRoutes = [
    // {
    //     path: "country",
    //     children: [
    //       { 
    //         index: true,
    //         element: <Navigate to="/country" />,
    //       },
    //     ],
    //   },
      {
        path: "country",
        lazy: async () => ({
          Component:  (await import("../../pages/country/list/list")).default,
        }),
      }
  ];
  
  export default countryRoutes;
  