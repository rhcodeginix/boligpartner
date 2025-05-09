import React from "react";

interface Tab {
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: any;
  setActiveTab?: any;
}

const Tabs: React.FC<TabsProps> = ({ tabs, setActiveTab, activeTab }) => {
  return (
    <div className="flex gap-2">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`py-2 px-3 rounded-lg ${
            activeTab === index
              ? "font-semibold text-purple shadow-shadow1"
              : "text-black"
          } ${setActiveTab ? "cursor-pointer" : "cursor-auto"}`}
          onClick={() => (setActiveTab ? setActiveTab(index) : undefined)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
