import React, { ReactNode } from "react";
import {
  AnimatePresence,
  H5,
  SizableText,
  Stack,
  StackPropsBase,
  styled,
  TabLayout,
  Tabs,
  TabsTabProps,
  TamaguiComponent,
  YStack,
  YStackProps,
} from "tamagui";
import { SelectOption, TabState } from "../shared/types/utils";

type Props = {
  tabs: SelectOption[];
  tabState: TabState;
  setTabState: (tabState: TabState) => void;
  children: ReactNode;
};

export const TabbedControlHeader = ({
  tabs,
  tabState,
  setTabState,
  children,
}: Props) => {
  const setCurrentTab = (currentTab: SelectOption) =>
    setTabState({ ...tabState, currentTab });
  const setIntentIndicator = (intentAt: TabLayout) =>
    setTabState({ ...tabState, intentAt });
  const setActiveIndicator = (activeAt: TabLayout) =>
    setTabState({
      ...tabState,
      prevActiveAt: tabState.activeAt,
      activeAt,
    });
  const { activeAt, intentAt, prevActiveAt, currentTab } = tabState;

  /**
   * -1: from left
   *  0: n/a
   *  1: from right
   */
  const direction = (() => {
    if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
      return 0;
    }
    return activeAt.x > prevActiveAt.x ? -1 : 1;
  })();

  const enterVariant =
    direction === 1
      ? "isLeft"
      : direction === -1
      ? "isRight"
      : "defaultFade";
  const exitVariant =
    direction === 1
      ? "isRight"
      : direction === -1
      ? "isLeft"
      : "defaultFade";

  const handleOnInteraction: TabsTabProps["onInteraction"] = (
    type,
    layout
  ) => {
    if (layout) {
      if (type === "select") {
        setActiveIndicator(layout);
      } else {
        setIntentIndicator(layout);
      }
    }
  };

  return (
    <Tabs
      value={currentTab.value}
      onValueChange={value =>
        setCurrentTab(tabs.find(tab => tab.value === value)!)
      }
      orientation="horizontal"
      size="$4"
      padding="$2"
      f={1}
      height={150}
      flexDirection="column"
      activationMode="manual"
      borderRadius="$4"
      ai="center"
      position="relative">
      <YStack>
        <AnimatePresence>
          {intentAt && (
            <TabsRovingIndicator
              key="1" // these keys should be identical
              borderRadius="$4"
              width={intentAt.width}
              height={intentAt.height}
              x={intentAt.x}
              y={intentAt.y}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeAt && (
            <TabsRovingIndicator
              key="1" // these keys should be identical
              borderRadius="$4"
              theme="active"
              width={activeAt.width}
              height={activeAt.height}
              x={activeAt.x}
              y={activeAt.y}
            />
          )}
        </AnimatePresence>
        <Tabs.List
          disablePassBorderRadius
          loop={false}
          aria-label="Manage your account"
          space="$2"
          backgroundColor="transparent">
          {tabs.map(({ label, value }) => (
            <Tabs.Tab
              key={value}
              value={value}
              onInteraction={handleOnInteraction}
              unstyled>
              <SizableText color="$text">{label}</SizableText>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </YStack>

      <AnimatePresence
        exitBeforeEnter
        enterVariant={enterVariant}
        exitVariant={exitVariant}>
        <AnimatedYStack
          key={currentTab.value}
          animation="smooth"
          w="100%"
          f={1}
          x={0}
          opacity={1}>
          <Tabs.Content
            key={currentTab.value}
            value={currentTab.value}
            forceMount
            f={1}
            mt="$4"
            justifyContent="center">
            {children}
          </Tabs.Content>
        </AnimatedYStack>
      </AnimatePresence>
    </Tabs>
  );
};

const TabsRovingIndicator = styled(Stack, {
  position: "absolute",
  justifyContent: "flex-start",
  backgroundColor: "$accent",
  opacity: 0.7,
  animation: "smooth",
  enterStyle: {
    opacity: 0,
  },
  exitStyle: {
    opacity: 0,
  },
  variants: {
    active: {
      true: {
        backgroundColor: "$color8",
        opacity: 0.6,
      },
    },
  },
}) as TamaguiComponent<StackPropsBase>;

const AnimatedYStack = styled(YStack, {
  animation: "quick",
  variants: {
    isLeft: { true: { x: -25, opacity: 0 } },
    isRight: { true: { x: 25, opacity: 0 } },
    defaultFade: { true: { opacity: 0 } },
  } as const,
}) as TamaguiComponent<YStackProps>;
