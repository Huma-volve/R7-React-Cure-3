"use client";

import {
  ChevronRight,
  MapPin,
  Bell,
  CreditCard,
  Heart,
  Settings,
  HelpCircle,
  Shield,
  LogOut,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { ProfileInfo } from "./profileInfo";
import { MainSetting } from "./setting/mainSetting";
import { MainPayment } from "./payment/mainPayment";

export default function ProfileSettings() {
  const [activeSection, setActiveSection] = useState<string| null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile vs desktop
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { icon: Bell, label: "Notifications", type: "switch" },
    { icon: CreditCard, label: "Payment Method" },
    { icon: Heart, label: "Favorites" },
    { icon: Settings, label: "Settings" },
    { icon: HelpCircle, label: "FAQs" },
    { icon: Shield, label: "Privacy Policy" },
    { icon: LogOut, label: "Log out", danger: true },
    {icon: CreditCard, label: "Payment Method" },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "Payment Method":
        return <MainPayment/>;
      case "Favorites":
        return <p>Your favorite items or content here.</p>;
      case "Settings":
        return <MainSetting />;
      case "FAQs":
        return <p>Common questions and help topics.</p>;
      case "Privacy Policy":
        return <p>Privacy policy and terms of use.</p>;
      case "Log out":
        return <p>Clicked Log out.</p>;
          case "Profile Content":
            return <ProfileInfo />;
         
      default:
        return <p>Choose from profile setting tabs.</p>;
    }
  };

  const handleCardClick = (label: string) => {
    setActiveSection(label);
  };

  

  return (
    <div className="flex flex-col lg:flex-row max-w-6xl mx-auto px-4 sm:px-6 py-8 gap-6">
      {/* LEFT PANEL */}
      {(!isMobile || activeSection === "Profile") && (
        <div className="lg:w-1/3 space-y-4">
          <Card
            className="flex flex-row bg-[#F5F6F7] border-0 items-center justify-between p-4 sm:p-5 cursor-pointer"
            onClick={() => handleCardClick("Profile Content")}
          >
            <div className="flex items-center space-x-4">
              <img
                src="../../public/profile.png"
                alt="User Avatar"
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
              <div>
                <p className="text-base font-semibold text-foreground">John Doe</p>
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
                className={`flex flex-row bg-[#F5F6F7] border-0 items-center justify-between p-4 sm:p-5 hover:bg-muted transition cursor-pointer ${
                  item.danger ? "hover:bg-red-50 dark:hover:bg-red-950" : ""
                }`}
                onClick={() => item.type !== "switch" && handleCardClick(item.label)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon
                    className={`w-5 h-5 ${item.danger ? "text-red-500" : "text-muted-foreground"}`}
                  />
                  <span className={`text-sm sm:text-base font-medium ${item.danger ? "text-red-500" : ""}`}>
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
          </div>
        </div>
      )}

      {/* RIGHT PANEL */}
      {(!isMobile || activeSection !== "Profile") && (
        <div className="flex-1">
          <Card className="w-full p-6">
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
