import { cookies } from "next/headers";
import React from "react";
import MyTicketsPage from "./MyTickets";

const page = async () => {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value.toString() || "";
  return <MyTicketsPage userId={userId} />;
};

export default page;
