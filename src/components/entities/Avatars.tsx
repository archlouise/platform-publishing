import { avatarUri, logoUri } from "@/lib/placeholders";
import { cn } from "@/lib/utils";
import type { Company, Profile } from "@/lib/types";

const SIZES = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
  xl: "size-24",
} as const;

export function PersonAvatar({
  profile,
  size = "md",
  className,
}: {
  profile: Pick<Profile, "full_name" | "avatar_url" | "id">;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={profile.avatar_url ?? avatarUri(profile.full_name, profile.id)}
      alt=""
      width={96}
      height={96}
      className={cn("shrink-0 rounded-full bg-muted object-cover", SIZES[size], className)}
    />
  );
}

export function CompanyLogo({
  company,
  size = "md",
  className,
}: {
  company: Pick<Company, "name" | "logo_url" | "id">;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={company.logo_url ?? logoUri(company.name, company.id)}
      alt=""
      width={96}
      height={96}
      className={cn("shrink-0 rounded-lg bg-muted object-cover", SIZES[size], className)}
    />
  );
}
