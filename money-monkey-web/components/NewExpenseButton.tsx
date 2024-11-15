"use client";

import { createExpense } from "@/lib/db/queries";
import { UserSettingsContext } from "@/lib/userSettings";
import { ExpenseSchema } from "@/lib/validation";
import BasicField from "@/components/BasicField";
import Button from "@/components/Button";
import MoneyField from "@/components/MoneyField";
import PopupModal from "@/components/PopupModal";
import SelectField from "@/components/SelectField";
import { Form, Formik, FormikHelpers } from "formik";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { MdAdd } from "react-icons/md";

type NewExpenseButtonProps = {
  className?: string;
  userId: string;
};

export default function NewExpenseButton({
  className = "",
  userId,
}: NewExpenseButtonProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { categories } = useContext(UserSettingsContext);

  const handleSubmit = useCallback(
    (expense: ExpenseEdit, formikHelpers: FormikHelpers<ExpenseEdit>) => {
      console.log("New expense:", expense);
      console.log("Helpers: " + formikHelpers);
      createExpense(expense, userId);
      formikHelpers.resetForm();
      setIsModalVisible(false);
    },
    [setIsModalVisible, userId]
  );
  const options = useMemo(
    () => (
      <>
        <option value={-1}>Select a category</option>
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
    <div className={className}>
      <Button
        Icon={MdAdd}
        disabled={isModalVisible}
        onClick={() => setIsModalVisible(true)}
      >
        New Expense
      </Button>

      <Formik
        initialValues={{
          name: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          category_id: -1,
        }}
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
              <BasicField
                name="name"
                label="Name:"
                placeholder="Name"
                aria-required="true"
              />
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
                Create
              </Button>
            </Form>
          </PopupModal>
        )}
      </Formik>
    </div>
  );
}
