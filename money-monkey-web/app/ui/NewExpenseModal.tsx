import { getCategories } from '@lib/api';

export default async function NewExpenseModal() {
  const expense: NewExpense = {
    name: '',
    amount_cents: 0,
    date: new Date(),
    category_id: -1,
  };

  try {
    var categories = await getCategories();
  } catch {
    return <>Could not fetch categories</>;
  }


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Send expense data to API for creation
    console.log('New expense:', expense);
  };

  return (
    <div>
      <h2>Create New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Expense Name:</label>
          <input type="text" id="name" name="name" value={expense.name} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="amount">Expense Amount:</label>
          <input type="number" id="amount" name="amount" value={expense.amount} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="date">Expense Date:</label>
          <input type="date" id="date" name="date" value={expense.date.toISOString().split('T')[0]} onChange={handleInputChange} />
        </div>
        <div>
          <label htmlFor="category">Expense Category:</label>
          <select id="category" name="category" value={expense.category} onChange={handleInputChange}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Expense</button>
      </form>
    </div>
  );
};
