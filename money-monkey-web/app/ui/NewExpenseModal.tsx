"use client";

import Button from "./Button";
import { MdAdd, MdClose } from "react-icons/md";
import React, { useCallback, useEffect, useState } from "react";
import { Field, Form, Formik, FormikHelpers, useField } from "formik";
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
      formikHelpers.resetForm();
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

  function CustomField(props: {
    name: string;
    label: string;
    placeholder?: string;
    type?: string;
  }) {
    const [field, meta] = useField(props.name);
    return (
      <div>
        <label className="capitalize" htmlFor={field.name}>
          {props.label}
        </label>
        <Field {...field} {...props} />
        {meta.touched && <p className="text-red-500">{meta.error}</p>}
      </div>
    );
  }

  return (
    <div className={className}>
      <Button Icon={MdAdd} disabled={visible} onClick={() => setVisible(true)}>
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
          <div
            className={`transition w-screen h-screen fixed left-0 top-0 flex items-center justify-center ${
              visible ? "bg-gray-200 bg-opacity-50" : "pointer-events-none"
            }`}
            onClick={(e) => {
              if (visible) {
                setVisible(false);
                props.handleReset(e);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setVisible(false);
                props.handleReset(e);
              }
            }}
            tabIndex={0}
          >
            <Form
              className={`transition-all flex justify-center flex-col gap-1 pt-2 p-4 bg-white border-2 rounded-xl [&_label]:pr-2 ${
                visible ? "scale-100" : "scale-0"
              }`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div className="relative text-center w-full h-10">
                <h2 className="p-2 font-bold mb-2 underline">New Expense</h2>
                <button
                  className="absolute top-0 right-[-0.5rem] rounded-full hover:bg-gray-400 p-0 hover:p-2 m-2 hover:m-0 transition-all "
                  onClick={(e) => {
                    setVisible(false);
                    props.handleReset(e);
                  }}
                >
                  <MdClose size={24} />
                </button>
              </div>
              <CustomField name="name" label="Name:" placeholder="Name" />
              <CustomField name="amount" label="Amount: $" placeholder="0.00" />
              <CustomField name="date" label="Date:" type="date" />
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
                {props.touched.category_id && (
                  <p className="text-red-700">{props.errors.category_id}</p>
                )}
              </div>
              <Button className="self-center" type="submit">
                Create
              </Button>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}
