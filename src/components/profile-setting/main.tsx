"use client";

import {
  ChevronRight,
  MapPin,
  Bell,
  CreditCard,
  Settings,
  HelpCircle,
  Shield,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { ProfileInfo } from "./profileInfo";
import { MainSetting } from "./setting/mainSetting";
import  SavedCards  from "./payment/MainPayment";
import FAQ from "./faq";
import { PrivacyNpolicy } from "./privacyNpolicy";
import { LogoutButton } from "./logoutButton";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const [activeSection, setActiveSection] = useState<string>("Profile");
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { icon: Bell, label: "Notifications", type: "switch" },
    { icon: CreditCard, label: "Payment Method" },
    { icon: Settings, label: "Settings" },
    { icon: HelpCircle, label: "FAQs" },
    { icon: Shield, label: "Privacy Policy" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Payment Method":
        return <SavedCards/>;
      case "Settings":
        return <MainSetting />;
      case "FAQs":
        return <FAQ/>;
      case "Privacy Policy":
        return <PrivacyNpolicy/>;
      case "Log out":
        return <LogoutButton/>;
          case "Profile Content":
            return <ProfileInfo />;
         
      default:
        return <p>Choose from profile setting tabs.</p>;
    }
  };

  const handleCardClick = (label: string) => {
    setActiveSection(label);
  };
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/signin"); 
    }
  }, [user, navigate]);

  
  

  return (
    <div className="flex flex-col lg:flex-row max-w-6xl mx-auto px-4 sm:px-6 py-8 gap-6">
      {/* LEFT PANEL */}
      {(!isMobile || activeSection === "Profile") && (
        <div className="lg:w-1/3 space-y-4">
          <Card
            className="!bg-gray-100 flex flex-row bg-white border-0 items-center justify-between p-4 sm:p-5 cursor-pointer"
            onClick={() => handleCardClick("Profile Content")}
          >
            <div className="flex items-center space-x-4">
              <img
                src={user?.profile_photo||"/avatar.jpg"}
                alt="User Avatar"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <div>
                <p className="text-base font-semibold text-foreground">{user?.name}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-0.5">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </Card>

          <Separator />

          <div className="grid gap-3 sm:gap-4">
            {menuItems.map((item) => (
              <Card
                key={item.label}
                className={`!bg-gray-100 flex flex-row bg-white border-0 items-center justify-between p-4 sm:p-5 hover:bg-muted transition cursor-pointer`}
                onClick={() => item.type !== "switch" && handleCardClick(item.label)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon
                    className={`w-5 h-5 text-muted-foreground`}
                  />
                  <span className={`text-sm sm:text-base font-medium`}>
                    {item.label}
                  </span>
                </div>
                {item.type === "switch" ? (
                  <Switch />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </Card>
            ))}
            <LogoutButton/>
          </div>
        </div>
      )}

      {/* RIGHT PANEL */}
      {(!isMobile || activeSection !== "Profile") && (
        <div className="flex-1">
          <Card className="w-full p-6 bg-white">
            {isMobile && (
              <button
                className="flex items-center text-sm text-muted-foreground mb-4"
                onClick={() => setActiveSection("Profile")}
              >
                <ChevronRight className="w-4 h-4 transform rotate-180 mr-2" />
                Back
              </button>
            )}
            <h2 className="text-lg font-semibold mb-1">{activeSection}</h2>
            <div className="text-sm text-muted-foreground leading-relaxed">
              {renderContent()}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
