"use client"
import React from 'react';
import { Formik, Form, Field, useFormikContext, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { LoginType } from '@/app/types/commonType';
import { errorHandler } from '@/app/utils/commonFunction';
import authServices from '@/app/services/authServices';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '@/app/redux/feature/user';
import { PublicRoute } from '@/app/auth/Auth';

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    const handleLogin = async (values: LoginType, setSubmitting: (isSubmitting: boolean) => void) => {
        try {
            const res = await authServices.login(values)
            toast.success(res.data.message)
            localStorage.setItem("chat-token", res.data.data.token)
            dispatch(setUserInfo(res.data))

            router.push("/")
        } catch (error) {
            errorHandler(error)
        } finally {
            setSubmitting(false)
        }
    }


    return (
        <PublicRoute>
            <div className="flex items-center justify-center bg-slate-400 h-screen w-screen">
                <div className="bg-blue-400 min-h-[500px] min-w-auto sm:min-w-[500px] mx-2 sm:mx-0 rounded-lg px-4 sm:px-14 py-14 text-white shadow-2xl">
                    <h1 className="text-4xl text-center">Login</h1>
                    <Formik
                        initialValues={{
                            username: '',
                            password: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            handleLogin(values, setSubmitting)
                        }}
                    >
                        {(formik) => {
                            return (
                                <Form>
                                    <div className="inputCon">
                                        <label>Username</label>
                                        <Field type="text" className="input" name="username" />
                                        <ErrorMessage className='error' name='username' component={"div"} />
                                    </div>

                                    <div className="inputCon">
                                        <label>Password</label>
                                        <Field type="password" className="input" name="password" />
                                        <ErrorMessage className='error' name='password' component={"div"} />
                                    </div>

                                    <div className=" mt-4 text-center">
                                        <button type="submit" className="button" disabled={formik.isSubmitting}>
                                            {formik.isSubmitting ? 'Logging in...' : 'Login'}
                                        </button>
                                        <br />
                                        <h6 className='my-2'>OR</h6>
                                        <Link href="/register">Create new account </Link>
                                    </div>
                                </Form>)
                        }}
                    </Formik>
                </div>
            </div>
        </PublicRoute>
    );
};

export default Login;
