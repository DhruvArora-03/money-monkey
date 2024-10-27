"use client";

import { createContext } from "react";

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
  var userSettings: UserSettings = {
    categories: new Map(categories.map((category) => [category.id, category])),
  };

  return (
    <UserSettingsContext.Provider value={userSettings}>
      {children}
    </UserSettingsContext.Provider>
  );
}
