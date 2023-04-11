import { useState } from "react";

import ScreenContainer from "../../../components/screen-container";
import { TabbedControlHeader } from "../../../components/tabbed-control-header";
import ClientUserFormScreen from "../../../screens/client-user-form";
import { SelectOption, TabState } from "../../../shared/types/utils";
import { Payments } from "../../../screens/payments";
import { Measurements } from "../../../screens/measurements";

const TABS: SelectOption[] = [
  { label: "Profile", value: "profile" },
  { label: "Payments", value: "payments" },
  { label: "Measurements", value: "measurements" },
];

const ClientUserById = () => {
  const [tabState, setTabState] = useState<TabState>({
    activeAt: null,
    currentTab: TABS[1],
    intentAt: null,
    prevActiveAt: null,
  });

  return (
    <ScreenContainer>
      <TabbedControlHeader
        tabs={TABS}
        tabState={tabState}
        setTabState={setTabState}>
        {tabState.currentTab.value === "profile" && (
          <ClientUserFormScreen />
        )}
        {tabState.currentTab.value === "payments" && <Payments />}
        {tabState.currentTab.value === "measurements" && <Measurements />}
      </TabbedControlHeader>
    </ScreenContainer>
  );
};

export default ClientUserById;
