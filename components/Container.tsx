import React from "react";

const MyContainer = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="w-full md:w-[80%] mx-auto px-10">{children}</div>;
};

export default MyContainer;
