
import { useState } from "react";

export function useTabsState(initialTab: string) {
  const [activeTab, setActiveTab] = useState(initialTab);

  function setTab(tab: string) {
    setActiveTab(tab);
  }

  return { activeTab, setTab };
}
