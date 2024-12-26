"use client";

import BasicField from "@/components/BasicField";
import PopupModal from "@/components/PopupModal";
import SelectField from "@/components/SelectField";
import { Button } from "@/components/ui/button";
import { createExpense } from "@/lib/db/queries";
import { UserSettingsContext } from "@/lib/userSettings";
import { ExpenseSchema } from "@/lib/validation";
import { Form, Formik, FormikHelpers } from "formik";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { MdAdd } from "react-icons/md";
import DateField from "@/components/DateField";
import CheckboxField from "@/components/SwitchField";

type NewExpenseButtonProps = {
  className?: string;
};

export default function NewExpenseButton({ className }: NewExpenseButtonProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { addExpense } = useContext(UserSettingsContext);

  const handleSubmit = useCallback(
    async (expense: ExpenseEdit, formikHelpers: FormikHelpers<ExpenseEdit>) => {
      console.log("New expense:", expense);
      console.log("Helpers: " + formikHelpers);
      const inserted = await createExpense(expense);
      addExpense(inserted);
      formikHelpers.resetForm();
      setIsModalVisible(false);
    },
    [setIsModalVisible]
  );

  return (
    <div className={className}>
      <Button disabled={isModalVisible} onClick={() => setIsModalVisible(true)}>
        <MdAdd /> New Expense
      </Button>

      <Formik
        initialValues={
          {
            name: "",
            date: new Date(),
            amount: 0,
            categoryId: null,
            isIncome: false,
          } satisfies ExpenseEdit as ExpenseEdit
        }
        validationSchema={ExpenseSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <PopupModal
            title="New Expense"
            visible={isModalVisible}
            onClose={() => {
              setIsModalVisible(false);
              props.resetForm();
            }}
          >
            <Form className="flex flex-col gap-2" aria-label="New expense form">
              <CheckboxField name="isIncome" label="Recording Income" />
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
              <Button
                className="w-full text-center"
                type="submit"
                disabled={!props.dirty || !props.isValid || props.isSubmitting}
              >
                Create
              </Button>
            </Form>
          </PopupModal>
        )}
      </Formik>
    </div>
  );
}
