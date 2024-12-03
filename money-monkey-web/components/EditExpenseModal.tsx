import BasicField from "@/components/BasicField";
import MoneyField from "@/components/MoneyField";
import PopupModal from "@/components/PopupModal";
import SelectField from "@/components/SelectField";
import { Button } from "@/components/ui/button";
import { updateExpense } from "@/lib/db/queries";
import { SelectExpense } from "@/lib/db/schema";
import { usdFormatter } from "@/lib/money";
import { UserSettingsContext } from "@/lib/userSettings";
import { ExpenseSchema } from "@/lib/validation";
import { Form, Formik, FormikHelpers } from "formik";
import React, { useCallback, useContext, useMemo } from "react";

interface EditExpenseModalProps {
  initialExpense: SelectExpense | null;
  onClose: () => void;
}

export default function EditExpenseModal({
  initialExpense,
  onClose,
}: EditExpenseModalProps) {
  const { categories, setExpense } = useContext(UserSettingsContext);
  const initialValues = initialExpense && {
    name: initialExpense.name,
    amount: usdFormatter.format(initialExpense.amount_cents / 100),
    date: initialExpense.date.toISOString().split("T")[0],
    category_id: initialExpense.category_id,
  };

  const handleSubmit = useCallback(
    async (expense: ExpenseEdit, formikHelpers: FormikHelpers<ExpenseEdit>) => {
      console.log("Edited expense:", expense);
      console.log(`Helpers: ${formikHelpers} (in edit modal)`);
      const updated = await updateExpense(initialExpense!.id, expense);
      setExpense(updated.id, updated);
      formikHelpers.resetForm();
      onClose();
    },
    [onClose]
  );

  const options = useMemo(
    () => (
      <>
        {Array.from(categories.values()).map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </>
    ),
    [categories]
  );

  return (
    <PopupModal
      title="Edit Expense"
      onClose={onClose}
      visible={!!initialValues}
    >
      {initialValues && (
        <Formik
          initialValues={initialValues}
          validationSchema={ExpenseSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form className="flex flex-col gap-2">
              <BasicField name="name" label="Name:" placeholder="Name" />
              <MoneyField name="amount" label="Amount:" />
              <BasicField
                name="date"
                label="Date:"
                type="date"
                min={"1970-01-01"}
                max={new Date().toISOString().split("T")[0]}
              />
              <SelectField
                name="category_id"
                label="Category:"
                options={options}
              />
              <Button
                className="self-center"
                type="submit"
                disabled={!props.dirty || !props.isValid}
              >
                Finish Editing
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </PopupModal>
  );
}
