"use client";

import Button from "./Button";
import { MdAdd, MdClose } from "react-icons/md";
import React, { useCallback, useEffect, useState } from "react";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { NewExpenseSchema } from "@lib/validation";

type NewExpenseModalProps = {
  className?: string;
  categories: CategorySum[];
};

export default function NewExpenseModal({
  categories,
  className = "",
}: NewExpenseModalProps) {
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
    <div className={className}>
      <Button Icon={MdAdd} disabled={visible} onClick={() => setVisible(true)}>
        New Expense
      </Button>
      <div
        className={
          visible
            ? "h-screen flex items-center justify-center fixed inset-0 bg-gray-200 bg-opacity-50"
            : "invisible w-0 h-0"
        }
        onClick={() => setVisible(false)}
      >
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
          {() => (
            <Form
              className="flex justify-center flex-col gap-1 pt-2 p-4 bg-white border-2 rounded-xl [&_label]:pr-2"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="relative text-center w-full h-10">
                <h2 className="p-2 font-bold mb-2 underline">New Expense</h2>
                <button
                  className="absolute top-0 right-[-0.5rem] hover:bg-gray-400 rounded-full p-2 m-0"
                  onClick={() => setVisible(false)}
                >
                  <MdClose size={24} />
                </button>
              </div>
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
              <Button className="self-center" type="submit">
                Create
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
