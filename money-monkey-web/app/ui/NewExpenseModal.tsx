"use client";

import Button from "./Button";
import { MdAdd } from "react-icons/md";
import React, { useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { NewExpenseSchema } from "@lib/validation";

type NewExpenseModalProps = {
  categories: CategorySum[];
};

export default function NewExpenseModal({ categories }: NewExpenseModalProps) {
  const [visible, setVisible] = useState(false);
  const expense: NewExpense = {
    name: "",
    amount_cents: 0,
    date: new Date(),
    category_id: -1,
  };

  const handleSubmit = (
    expense: NewExpense,
    formikHelpers: FormikHelpers<NewExpense>
  ) => {
    console.log("New expense:", expense);
    console.log("Helpers: " + formikHelpers);
  };

  return (
    <div>
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
            <Form>
              <h2>Create New Expense</h2>
              {console.log(a.values) ?? undefined}
              <div>
                <label htmlFor="name">Name:</label>
                <Field name="name" placeholder="Name" />
              </div>
              <div>
                <label htmlFor="amount">Amount:</label>
                <Field name="amount_cents" type="number" />
              </div>
              <div>
                <label htmlFor="date">Date:</label>
                <Field name="date" type="date" />
              </div>
              <div>
                <label htmlFor="category">Category:</label>
                <Field name="category_id" as="select">
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
              <div className="flex">
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
