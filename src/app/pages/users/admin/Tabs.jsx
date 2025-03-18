// Local Imports
import { Page } from "components/shared/Page";
import { Outlet } from "react-router";
import TabNavigation from "./ShiftLeftAnimation";
// ----------------------------------------------------------------------



export default function Tabs() {
    console.log('in tabs');
    
  return (
  <Page title="Admin Tabs">
            <TabNavigation />
        <Outlet/>
    </Page>
  );
}
