"use client"
import React from 'react';
import { Formik, Form, Field, useFormikContext } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {


    return (
        <div className="flex items-center justify-center bg-slate-400 h-screen w-screen">
            <div className="bg-blue-400 h-[500px] w-[500px] rounded-lg px-14 py-14 text-white">
                <h1 className="text-4xl text-center">Login</h1>
                <Formik
                    initialValues={{
                        username: '',
                        password: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        console.log('Form values submitted:', values); // Log form values on submission
                        // Other submission logic
                    }}
                >
                    {(formik) => {
                        { console.log(formik) }
                        return (
                            <Form>
                                <div className="mb-1">
                                    <label>Username</label>
                                    <Field type="text" className="input" name="username" />
                                </div>

                                <div className="mb-3">
                                    <label>Password</label>
                                    <Field type="password" className="input" name="password" />
                                </div>

                                <div className="text-center">
                                    <button type="submit" className="button" disabled={formik.isSubmitting}>
                                        {formik.isSubmitting ? 'Logging in...' : 'Login'}
                                    </button>
                                </div>
                            </Form>)
                    }}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
