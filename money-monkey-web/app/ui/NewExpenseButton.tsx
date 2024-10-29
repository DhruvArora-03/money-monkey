"use client";

import Button from "@ui/Button";
import { MdAdd } from "react-icons/md";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { NewExpenseSchema } from "@lib/validation";
import PopupModal from "@ui/PopupModal";
import BasicField from "@ui/BasicField";
import MoneyField from "@ui/MoneyField";
import { UserSettingsContext } from "@lib/userSettings";
import SelectField from "@ui/SelectField";

type NewExpenseButtonProps = {
  className?: string;
};

export default function NewExpenseButton({
  className = "",
}: NewExpenseButtonProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { categories } = useContext(UserSettingsContext);

  const handleSubmit = useCallback(
    (expense: NewExpense, formikHelpers: FormikHelpers<NewExpense>) => {
      console.log("New expense:", expense);
      console.log("Helpers: " + formikHelpers);
      formikHelpers.resetForm();
      setIsModalVisible(false);
    },
    [setIsModalVisible]
  );
  const options = useMemo(
    () => (
      <>
        <option value={-1}>Select a category</option>
        {categories
          .values()
          .toArray()
          .map((category) => (
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
          date: new Date(),
          category_id: -1,
        }}
        validationSchema={NewExpenseSchema}
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
              <BasicField name="date" label="Date:" type="date" />
              <SelectField
                name="category_id"
                label="Category:"
                options={options}
              />
              <Button className="self-center" type="submit">
                Create
              </Button>
            </Form>
          </PopupModal>
        )}
      </Formik>
    </div>
  );
}
