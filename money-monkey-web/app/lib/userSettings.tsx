"use client";

import { createContext, useMemo } from "react";

export const UserSettingsContext = createContext<UserSettings>({
  categories: new Map(),
});

export default function UserSettingsProvider({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: Category[];
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
