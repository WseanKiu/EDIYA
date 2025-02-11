import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <h1 className="text-xl">root LAYOUT</h1>
      {children}
    </div>
  );
};

export default Layout;
