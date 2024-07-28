import { ExpenseTypes } from "./types";

const tintColor = "#2f95dc";

const colors = {
  expenses: {
    Housing: "#00C014", // green
    Entertainment: "#00B0FF", // lighter blue
    Food: "#1F51FF", // neon blue
    Clothes: "#FF3131", // neon red
    Groceries: "#BC13FE", // neon purple
    Necessities: "#FF10F0", // neon pink
    Miscellaneous: "#FFA600", // neon orange
  } satisfies Record<ExpenseTypes, string>,
  theme: {
    text: "#000",
    background: "#fff",
    tint: tintColor,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColor,
  },
};

export default colors;
