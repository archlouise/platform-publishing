import { redirect } from "next/navigation";
import { repo } from "@/lib/data";

/** "My Profile" is the seeded signed-in demo user. */
export default async function MyProfilePage() {
  const me = await repo.getDemoProfile();
  redirect(`/people/${me.profile.slug}`);
}
