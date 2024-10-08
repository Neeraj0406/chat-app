"use client"
import axiosInstance from '@/app/axios/axiosInstance';
import { RegisterType } from '../../types/commonType';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { errorHandler } from '@/app/utils/commonFunction';
import authServices from '@/app/services/authServices';
import { useSelector } from 'react-redux';
import { RootState } from "@/app/redux/store"
import { PublicRoute } from '@/app/component/auth/Auth';
import Image from 'next/image';
import { MdEdit } from "react-icons/md";
import { Button } from '@material-tailwind/react';
import { useRef, useState } from 'react';


const Register = () => {
    const router = useRouter()
    const avatarRef = useRef<HTMLInputElement>(null)
    const [previewImage, setPreviewImage] = useState<string>("")

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
        name: Yup.string().required('Name is required'),
        bio: Yup.string().required('Bio is required'),
        avatar: Yup.string().required("Avatar is required")
    });

    const handleRegsiter = async (values: RegisterType, setSubmitting: (isSubmitting: boolean) => void) => {
        try {
            const formData = new FormData()
            formData.append("name", values.name)
            formData.append("username", values.username)
            formData.append("password", values.password)
            formData.append("bio", values.bio)
            formData.append("avatar", values.avatar)


            const res = await authServices.register(formData)
            toast.success(res.data.message)
            router.push("/login")

        } catch (error) {
            errorHandler(error)
        } finally {
            setSubmitting(false)
        }
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, formik: any) => {
        if (e?.target?.files && e?.target?.files?.length > 0) {
            let file = e?.target?.files[0]
            formik.setFieldValue("avatar", file)
            setPreviewImage(URL.createObjectURL(file))
        }
    }


    return (
        <PublicRoute>
            <div className="flex items-center justify-center bg-slate-400 h-screen w-screen">
                <div className="bg-blue-400 min-h-[500px] min-w-auto sm:min-w-[500px] mx-2 sm:mx-0 rounded-lg px-4 sm:px-14 py-14 text-white shadow-2xl">
                    <h1 className="text-4xl text-center">Register</h1>
                    <Formik
                        initialValues={{
                            name: "",
                            username: '',
                            password: '',
                            bio: "",
                            avatar: ""
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            handleRegsiter(values, setSubmitting)
                        }}
                    >
                        {(formik) => {
                            return (
                                <Form>

                                    <div className="inputCon">

                                        <div className=" flex items-center justify-center flex-col ">
                                            <img
                                                src={previewImage || "/images/defaultUser.png"}
                                                alt='Default user image'
                                                className=' h-[100px] w-[100px] mb-1 rounded-full object-cover'
                                            />
                                            <span className=''>
                                                <Button color="mainColor" onClick={() => avatarRef?.current?.click()}>Upload Image</Button>

                                                <input
                                                    type="file"
                                                    ref={avatarRef}
                                                    name="avatar"
                                                    className="input hidden"
                                                    onChange={e => handleImageUpload(e, formik)}
                                                // onChange={e => formik.setFieldValue("avatar", e.target.files && e.target.files?.length > 0 ? e.target.files[0] : {})}
                                                />

                                            </span>
                                        </div>
                                        <ErrorMessage className='error' name='avatar' component={"div"} />
                                    </div>

                                    <div className="inputCon">
                                        <label>Name</label>
                                        <Field type="text" className="input" name="name" />
                                        <ErrorMessage className='error' name='name' component={"div"} />
                                    </div>
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
                                    <div className="inputCon">
                                        <label>Bio</label>
                                        <Field type="text" className="input" name="bio" />
                                        <ErrorMessage className='error' name='bio' component={"div"} />
                                    </div>


                                    <div className="text-center ">
                                        <button type="submit" className="button" disabled={formik.isSubmitting}>
                                            {formik.isSubmitting ? 'Registering in...' : 'Register'}
                                        </button>
                                        <h6 className='my-2'>OR</h6>
                                        <Link href="/login">Back to login </Link>
                                    </div>
                                </Form>)
                        }}
                    </Formik>
                </div>
            </div>
        </PublicRoute>
    )
};

export default Register;
