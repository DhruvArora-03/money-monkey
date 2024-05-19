import { ExpenseTypes } from './Types'

const tintColor = '#2f95dc';

export default {
  expenses: { 
    Housing: '#39FF14', //neon green
    Entertainment: '#FFFF33', // neon yellow
    Food: '#1F51FF', // neon blue
    Clothes: '#FF3131', // neon red
    Groceries: '#BC13FE', // neon purple
    Necessities: '#FF10F0', // neon pink
    Miscellaneous: '#FFA600', // neon orange
  } satisfies  Record<ExpenseTypes, string>,
  theme: {
    text: '#000',
    background: '#fff',
    tint: tintColor,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColor,
  },
};

