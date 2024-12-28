import BasicField from "@/components/BasicField";
import SwitchField from "@/components/SwitchField";
import DateField from "@/components/DateField";
import PopupModal from "@/components/PopupModal";
import SelectField from "@/components/SelectField";
import { Button } from "@/components/ui/button";
import { deleteExpense, updateExpense } from "@/lib/db/queryActions";
import { SelectExpense } from "@/lib/db/schema";
import { UserSettingsContext } from "@/lib/userSettings";
import { ExpenseSchema } from "@/lib/validation";
import { Form, Formik, FormikHelpers } from "formik";
import React, { useCallback, useContext } from "react";

interface EditExpenseModalProps {
  initialExpense: SelectExpense | null;
  onClose: () => void;
}

export default function EditExpenseModal({
  initialExpense,
  onClose,
}: EditExpenseModalProps) {
  const { setExpense, removeExpense } = useContext(UserSettingsContext);

  const initialValues = initialExpense && {
    name: initialExpense.name,
    amount: (initialExpense.amount_cents / 100)
      .toFixed(2)
      .toString() as unknown as number,
    date: initialExpense.date,
    categoryId: initialExpense.category_id,
    isIncome: initialExpense.is_income,
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
              <SwitchField name="isIncome" label="Recording Income" />
              <BasicField name="name" placeholder="Name" aria-required="true" />
              <div className="flex gap-2">
                {!props.values.isIncome && (
                  <SelectField
                    name="categoryId"
                    placeholder="Category"
                    label="Category"
                    disabled={props.values.isIncome}
                    aria-required={!props.values.isIncome}
                  />
                )}
                <BasicField
                  className="w-full"
                  name="amount"
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  aria-required="true"
                />
              </div>
              <DateField name="date" aria-required="true" />
              <div className="w-full flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-grow"
                  onClick={async () => {
                    await deleteExpense(initialExpense!.id);
                    removeExpense(initialExpense!.id);
                    onClose();
                    props.resetForm();
                  }}
                >
                  Delete Expense
                </Button>
                <Button
                  className="flex-grow"
                  type="submit"
                  disabled={!props.dirty || !props.isValid}
                >
                  Finish Editing
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </PopupModal>
  );
}
