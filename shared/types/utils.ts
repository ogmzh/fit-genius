import { TabLayout } from "tamagui";

export type SelectOption = { label: string; value: string };
export type TabState = {
  currentTab: SelectOption;
  /**
   * Layout of the Tab user might intend to select (hovering / focusing)
   */
  intentAt: TabLayout | null;
  /**
   * Layout of the Tab user selected
   */
  activeAt: TabLayout | null;
  /**
   * Used to get the direction of activation for animating the active indicator
   */
  prevActiveAt: TabLayout | null;
};
