import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import './App.css'

const validationSchema = Yup.object().shape({
  years: Yup.number().required("Required").min(1),
  fees: Yup.array().of(
    Yup.object().shape({
      totalFee: Yup.number()
        .min(1, "Total Fee must be greater than 0")
        .required("Required"),
      scholarship: Yup.number()
        .max(
          Yup.ref("totalFee"),
          "Scholarship must be less than or equal to total fee"
        )
        .required("Required"),
    })
  ),
});

const FeeDetails = () => {
  const initialValues = {
    years: 1,
    fees: Array(2).fill({ totalFee: "", scholarship: "" }), 
  };

  const handleSubmit = (values) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      
    >
      {({ values, setFieldValue }) => (
        <Form style={{padding:'1%'}}>
          <label >
            Duration of Course (in Years): 
            <Field
            style={{width:'100px',margin:'50px', marginBottom:'7%'}}
              as="select"
              name="years"
              onChange={(e) => {
                const yearValue = Number(e.target.value);
                setFieldValue("years", yearValue);
                
                if (yearValue < values.years) {
                  setFieldValue("fees", values.fees.slice(0, yearValue * 2));
                } else {
                  const additionalYears = Array(
                    (yearValue - values.years) * 2
                  ).fill({ totalFee: "", scholarship: "" });
                  setFieldValue("fees", [...values.fees, ...additionalYears]);
                }
              }}
            >
              {[1, 2, 3, 4, 5].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Field>
            <ErrorMessage name="years" component="div" />
          </label>

          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Semester</th>
                <th>Total Fee</th>
                <th>Scholarship</th>
                <th>Remaining to be Paid</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(values.years)].map((_, yearIndex) => (
                <React.Fragment key={`year-${yearIndex}`}>
                  {[...Array(2)].map((_, semIndex) => (
                    <tr key={`year-${yearIndex}-sem-${semIndex}`}>
                      {semIndex === 0 && <td rowSpan="2">{yearIndex + 1}</td>}
                      <td>{`Sem ${semIndex + 1}`}</td>
                      <td>
                        <Field
                          type="number"
                          name={`fees.${yearIndex * 2 + semIndex}.totalFee`}
                        />
                        <ErrorMessage
                          name={`fees.${yearIndex * 2 + semIndex}.totalFee`}
                          component="div"
                        />
                      </td>
                      <td>
                        <Field
                          type="number"
                          name={`fees.${yearIndex * 2 + semIndex}.scholarship`}
                        />
                        <ErrorMessage
                          name={`fees.${yearIndex * 2 + semIndex}.scholarship`}
                          component="div"
                        />
                      </td>
                      <td>
                        {values.fees[yearIndex * 2 + semIndex]?.totalFee -
                          values.fees[yearIndex * 2 + semIndex]?.scholarship}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              <tr>
                <td style={{fontWeight:'bold'}} colSpan="2">Total</td>
                <td style={{fontWeight:'bold'}}>
                  {values.fees.reduce(
                    (total, fee) => total + (fee?.totalFee || 0),
                    0
                  )}
                </td>
                <td style={{fontWeight:'bold'}}>
                  {values.fees.reduce(
                    (total, fee) => total + (fee?.scholarship || 0),
                    0
                  )}
                </td>
                <td style={{fontWeight:'bold'}}>
                  {values.fees.reduce(
                    (total, fee) => total + (fee?.totalFee || 0),
                    0
                  ) -
                    values.fees.reduce(
                      (total, fee) => total + (fee?.scholarship || 0),
                      0
                    )}
                </td>
              </tr>
            </tbody>
          </table>

          <button type="submit">Save</button>
        </Form>
      )}
    </Formik>
  );
};

export default FeeDetails;
