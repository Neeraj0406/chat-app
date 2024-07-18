"use client"
import { RegisterType } from '../../types/commonType';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const Register = () => {

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
        name: Yup.string().required('Name is required'),
        bio: Yup.string().required('Bio is required'),

    });

    const handleRegsiter = (values: RegisterType, setSubmitting: (isSubmitting: boolean) => void) => {
        console.log(values)
    }

    return (
        <div className="flex items-center justify-center bg-slate-400 h-screen w-screen">
            <div className="bg-blue-400 min-h-[500px] w-[500px] rounded-lg px-14 py-14 text-white shadow-2xl">
                <h1 className="text-4xl text-center">Register</h1>
                <Formik
                    initialValues={{
                        name: "",
                        username: '',
                        password: '',
                        bio: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        console.log('Form values submitted:', values); // Log form values on submission
                        handleRegsiter(values, setSubmitting)
                        // Other submission logic
                    }}
                >
                    {(formik) => {
                        { console.log(formik.values) }
                        return (
                            <Form>

                                <div className="mb-1">
                                    <label>Name</label>
                                    <Field type="text" className="input" name="name" />
                                    <ErrorMessage className='error' name='name' component={"div"} />
                                </div>
                                <div className="mb-1">
                                    <label>Username</label>
                                    <Field type="text" className="input" name="username" />
                                    <ErrorMessage className='error' name='username' component={"div"} />
                                </div>

                                <div className="mb-1">
                                    <label>Password</label>
                                    <Field type="password" className="input" name="password" />
                                    <ErrorMessage className='error' name='password' component={"div"} />
                                </div>
                                <div className="mb-1">
                                    <label>Bio</label>
                                    <Field type="text" className="input" name="bio" />
                                    <ErrorMessage className='error' name='bio' component={"div"} />
                                </div>
                                <div className="mb-1">
                                    <label>Avatar</label>
                                    <Field type="file" className="input" name="avatar" />
                                    <ErrorMessage className='error' name='avatar' component={"div"} />
                                </div>

                                <div className="text-center ">
                                    <button type="submit" className="button" disabled={formik.isSubmitting}>
                                        {formik.isSubmitting ? 'Registering in...' : 'Register'}
                                    </button>
                                </div>
                            </Form>)
                    }}
                </Formik>
            </div>
        </div>
    )
};

export default Register;
