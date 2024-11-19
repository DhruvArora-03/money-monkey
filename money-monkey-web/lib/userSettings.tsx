"use client";

import { createContext, useMemo } from "react";
import { SelectCategory } from "@/lib/db/schema";
interface UserSettings {
  categories: Map<number, SelectCategory>;
}
export const UserSettingsContext = createContext<UserSettings>({
  categories: new Map(),
});

export default function UserSettingsProvider({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: SelectCategory[];
}) {
  const userSettings: UserSettings = useMemo(
    () => ({
      categories: new Map(
        categories.map((category) => [category.id, category])
      ),
    }),
    [categories]
  );

  return (
    <UserSettingsContext.Provider value={userSettings}>
      {children}
    </UserSettingsContext.Provider>
  );
}
