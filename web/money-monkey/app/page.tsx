import { HomePageStats } from "./lib/types";
import MainSpendDisplay from "./ui/MainSpendDisplay";

export default function Home() {
  const width = 500;
  const radius = (width - 70 - 30) / 2;

  const random = new Array(7)
    .fill(0)
    .map(() => Math.floor(100_00 - Math.random() * 200_00));
  const stats = {
    totalCents: 2_808_67 + random.reduce((x, y) => x + y),
    catagories: {
      Housing: 1_328_00 + random[0],
      Food: 254_37 + random[1],
      Entertainment: 173_46 + random[2],
      Clothes: 145_08 + random[3],
      Groceries: 467_43 + random[4],
      Necessities: 220_04 + random[5],
      Miscellaneous: 220_29 + random[6],
    },
  } satisfies HomePageStats;

  return (
    <main className="flex min-h-screen flex-col justify-between p-14 bg-white">
      <MainSpendDisplay radius={radius} stats={stats} />
    </main>
  );
}
