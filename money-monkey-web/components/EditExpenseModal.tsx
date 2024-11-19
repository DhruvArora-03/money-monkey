import { usdFormatter } from "@/lib/money";
import { UserSettingsContext } from "@/lib/userSettings";
import { ExpenseSchema } from "@/lib/validation";
import BasicField from "@/components/BasicField";
import Button from "@/components/Button";
import MoneyField from "@/components/MoneyField";
import PopupModal from "@/components/PopupModal";
import SelectField from "@/components/SelectField";
import { Form, Formik, FormikHelpers } from "formik";
import React, { useCallback, useContext, useMemo } from "react";
import { SelectExpense } from "@/lib/db/schema";

interface EditExpenseModalProps {
  initialExpense: SelectExpense | null;
  onClose: () => void;
}

export default function EditExpenseModal({
  initialExpense,
  onClose,
}: EditExpenseModalProps) {
  const { categories } = useContext(UserSettingsContext);
  const initialValues = initialExpense && {
    name: initialExpense.name,
    amount: usdFormatter.format(initialExpense.amount_cents / 100),
    date: initialExpense.date.toISOString().split("T")[0],
    category_id: initialExpense.category_id,
  };

  const handleSubmit = useCallback(
    (expense: ExpenseEdit, formikHelpers: FormikHelpers<ExpenseEdit>) => {
      console.log("New expense:", expense);
      console.log(`Helpers: ${formikHelpers}`);
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
