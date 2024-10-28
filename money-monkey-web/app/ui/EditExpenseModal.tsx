import React, { useCallback } from "react";
import PopupModal from "@ui/PopupModal";
import { NewExpenseSchema } from "@lib/validation";
import { FormikHelpers, Formik, Form, Field } from "formik";
import BasicField from "@ui/BasicField";
import Button from "@ui/Button";

interface EditExpenseModalProps {
  initialExpense: Expense | null;
  onClose: () => void;
}

export default function EditExpenseModal({
  initialExpense,
  onClose,
}: EditExpenseModalProps) {
  const handleSubmit = useCallback(
    (expense: Expense, formikHelpers: FormikHelpers<Expense>) => {
      console.log("New expense:", expense);
      console.log("Helpers: " + formikHelpers);
      formikHelpers.resetForm();
      onClose();
    },
    [onClose]
  );
  return (
    <PopupModal
      title="Edit Expense"
      onClose={onClose}
      visible={initialExpense != null}
    >
      {initialExpense && (
        <Formik
          initialValues={initialExpense}
          validationSchema={NewExpenseSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form className="flex flex-col">
              <BasicField name="name" label="Name:" placeholder="Name" />
              <BasicField name="amount" label="Amount: $" placeholder="0.00" />
              <BasicField name="date" label="Date:" type="date" />
              {/* <div>
                <label htmlFor="category_id">Category:</label>
                <Field id="category_id" name="category_id" as="select">
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.name}
                    </option>
                  ))}
                </Field>
                {props.touched.category_id && (
                  <p className="text-red-700">{props.errors.category_id}</p>
                )}
              </div> */}
              <Button className="self-center" type="submit">
                Finish Editing
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </PopupModal>
  );
}
