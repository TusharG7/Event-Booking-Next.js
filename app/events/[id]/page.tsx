import { cookies } from "next/headers";
import EventDetailsPage from "./EventDetails";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value.toString() || "";

  return <EventDetailsPage id={id} userId={userId} />;
};

export default page;
