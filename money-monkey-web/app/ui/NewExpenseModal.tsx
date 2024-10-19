"use client";

import Button from "./Button";
import { MdAdd } from "react-icons/md";
import React, { useCallback, useEffect, useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { NewExpenseSchema } from "@lib/validation";

type NewExpenseModalProps = {
  categories: CategorySum[];
};

export default function NewExpenseModal({ categories }: NewExpenseModalProps) {
  const [visible, setVisible] = useState(false);

  const handleSubmit = useCallback(
    (expense: NewExpense, formikHelpers: FormikHelpers<NewExpense>) => {
      console.log("New expense:", expense);
      console.log("Helpers: " + formikHelpers);
      // formikHelpers.resetForm();
      setVisible(false);
    },
    []
  );

  // disable scrolling
  useEffect(() => {
    if (visible == true) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [visible]);

  return (
    <div
      className={
        visible
          ? "h-screen flex items-center justify-center fixed inset-0 bg-gray-200 bg-opacity-50"
          : ""
      }
      onClick={() => visible && setVisible(false)}
    >
      {!visible && (
        <Button icon={MdAdd} onClick={() => setVisible(true)}>
          New Expense
        </Button>
      )}
      {visible && (
        <Formik
          initialValues={{
            name: "",
            amount_cents: 0,
            date: new Date(),
            category_id: -1,
          }}
          validationSchema={NewExpenseSchema}
          onSubmit={handleSubmit}
        >
          {(a) => (
            <Form
              className="flex justify-center flex-col gap-1 p-4 bg-white border-2 rounded-xl [&_label]:pr-2"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <h2 className="font-bold self-center mb-2 underline">
                Create New Expense
              </h2>
              {console.log(a.values) ?? undefined}
              <div>
                <label htmlFor="name">Name:</label>
                <Field id="name" name="name" placeholder="Name" />
              </div>
              <div>
                <label htmlFor="amount_cents">Amount: $</label>
                <Field id="amount_cents" name="amount_cents" type="number" />
              </div>
              <div>
                <label htmlFor="date">Date:</label>
                <Field id="date" name="date" type="date" />
              </div>
              <div>
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
              </div>
              <div className="flex self-center">
                <Button onClick={() => setVisible(false)}>Cancel</Button>
                <Button type="submit">Create Expense</Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
