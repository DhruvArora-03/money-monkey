"use client";

import { createContext, useMemo } from "react";
import { SelectCategory } from "@/lib/db/schema";
interface UserSettings {
  profileId: string;
  categories: Map<number, SelectCategory>;
}
export const UserSettingsContext = createContext<UserSettings>({
  profileId: "",
  categories: new Map(),
});

export default function UserSettingsProvider({
  children,
  categories,
  profileId,
}: {
  children: React.ReactNode;
  categories: SelectCategory[];
  profileId: string;
}) {
  const userSettings: UserSettings = useMemo(
    () => ({
      profileId,
      categories: new Map(
        categories.map((category) => [category.id, category])
      ),
    }),
    [categories, profileId]
  );

  return (
    <UserSettingsContext.Provider value={userSettings}>
      {children}
    </UserSettingsContext.Provider>
  );
}
