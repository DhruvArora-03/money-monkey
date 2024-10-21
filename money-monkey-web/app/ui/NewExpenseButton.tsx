"use client";

import Button from "@ui/Button";
import { MdAdd } from "react-icons/md";
import React, { useCallback, useEffect, useState } from "react";
import { Field, Form, Formik, FormikHelpers, useField } from "formik";
import { NewExpenseSchema } from "@lib/validation";
import PopupModal from "@ui/PopupModal";

type NewExpenseModalProps = {
  className?: string;
  categories: CategorySum[];
};

export default function NewExpenseButton({
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
          <Form>
            <PopupModal
              title="New Expense"
              visible={visible}
              onClose={(e) => {
                setVisible(false);
              }}
            >
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
            </PopupModal>
          </Form>
        )}
      </Formik>
    </div>
  );
}
