"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Lock, User } from "lucide-react";
import { PasswordManagement } from "./passwordManagement";
import { DeleteAccount } from "./deleteAccount";

export const MainSetting = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  
  const renderContent = () => {
    switch (activeSection) {
      case "ManagePassword":
        return <PasswordManagement />;
      case "DeleteAccount":
        return <DeleteAccount />;
      default:
        return null;
    }
  };


  const renderList = () => (
    <>
     
      <div
        onClick={() => setActiveSection("ManagePassword")}
        className="flex items-center justify-between bg-[#F5F6F7] hover:bg-muted transition rounded-lg p-4 cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <div>
            <h2 className="text-sm sm:text-base font-medium text-foreground">
              Password Management
            </h2>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Change your account password
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
      </div>

    
      <div
        onClick={() => setActiveSection("DeleteAccount")}
        className="mt-3 flex items-center justify-between bg-[#F5F6F7] hover:bg-muted transition rounded-lg p-4 cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-muted-foreground" />
          <div>
            <h2 className="text-sm sm:text-base font-medium text-foreground">
              Delete Account
            </h2>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
      </div>
    </>
  );


  const renderSectionView = () => (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <button
          onClick={() => setActiveSection(null)}
          className="p-1 hover:bg-gray-100 rounded-full transition"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h2 className="text-base sm:text-lg font-semibold">
          {activeSection === "ManagePassword"
            ? "Password Management"
            : "Delete Account"}
        </h2>
      </div>
      <div>{renderContent()}</div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {activeSection === null ? renderList() : renderSectionView()}
    </div>
  );
};
