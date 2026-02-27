"use client";

import { dark } from "@clerk/themes";
import { UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";

interface Props {
  showName?: boolean;
}

export const UserControl = ({ showName }: Props) => {
  const { resolvedTheme } = useTheme();

  return (
    <UserButton
      showName={showName}
      appearance={{
        elements: {
          userButtonBox: "rounded-md!",
          userButtonAvatarBox: "rounded-md! size-8!",
          userButtonTrigger: "rounded-md!",
        },
        theme: resolvedTheme === "dark" ? dark : undefined,
      }}
    />
  );
};
