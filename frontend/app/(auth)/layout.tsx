import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fcf3f0] flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#ff6363] selection:text-white">
      {/* Centered Modal Container */}
      <div className="w-full max-w-4xl">
        {children}
      </div>
    </div>
  );
}
