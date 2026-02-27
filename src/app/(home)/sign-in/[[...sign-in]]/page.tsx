"use client";

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <SignIn
            appearance={{
              theme: resolvedTheme === "dark" ? dark : undefined,
              elements: {
                cardBox: "border! shadow-none! rounded-lg!",
              },
            }}
          />
        </div>
      </section>
    </div>
  );
}
