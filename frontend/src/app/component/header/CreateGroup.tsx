"use client";
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { MdGroupAdd } from 'react-icons/md';
import { ErrorMessage, Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import ChatServices from '@/app/services/chatServices';
import { errorHandler } from '@/app/utils/commonFunction';
import makeAnimated from 'react-select/animated';
import { chatDetailsType, createNewGroupType, updateGroupType } from '@/app/types/commonType';
import { toast } from 'react-toastify';
import { FaCamera } from "react-icons/fa6";
import { Button } from '@material-tailwind/react';

interface OptionType {
    label: string;
    value: string;
}

const animatedComponents = makeAnimated();

const CreateGroup = ({ pageName, chatDetails, setRefresh, refresh }: { pageName: "manage" | "create", chatDetails: chatDetailsType | undefined, refresh?: boolean, setRefresh?: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [allFriends, setAllFriends] = useState<OptionType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [imagePreview, setImagePreview] = useState<string | null>("");

    const imageRef = useRef<HTMLInputElement>(null);

    const getAllFriends = async () => {
        try {

            const res = await ChatServices.getMyFriends();
            let temp = res?.data?.data?.map((data: any) => ({ label: data?.friend?.name, value: data?.friend?._id }));
            setAllFriends(temp);
        } catch (error) {
            errorHandler(error);
        }
    };

    useEffect(() => {
        if (open) {
            getAllFriends();
        }
    }, [open]);

    const formik = useFormik<{
        avatar: File | string;
        name: string;
        members: OptionType[];
    }>({
        initialValues: {
            avatar: "",
            name: '',
            members: [],
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Group name is required'),
            members: Yup.array().min(1, 'Group must have at least 1 member'),
        }),
        onSubmit: async (values, { setSubmitting }) => {

            const modifiedData = {
                ...values,
                members: values.members?.map((member) => member.value) // Assuming members are OptionType and you need 'value'
            };
            pageName == "create"
                ? createNewGroup(modifiedData, setSubmitting)
                : updateGroup(modifiedData, setSubmitting)
        }
    });


    useEffect(() => {
        if (pageName === "manage" && chatDetails && allFriends.length > 0) {
            const mappedMembers: OptionType[] = []
            chatDetails.members?.map(memberId => {
                const friend = allFriends.find(friend => friend.value === memberId?._id);
                if (friend) {
                    mappedMembers?.push(friend)
                }

            }) || [];

            formik.setValues({
                name: chatDetails.name || '',
                members: mappedMembers,
                avatar: chatDetails?.avatar?.url || "",
            });
            setImagePreview(chatDetails.avatar?.url || ""); // Set image preview if needed
        }
    }, [pageName, chatDetails, allFriends]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e?.target?.files && e?.target?.files?.length > 0) {
            let file = e?.target?.files[0];
            formik.setFieldValue("avatar", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const createNewGroup = async (values: createNewGroupType, setSubmitting: (isSubmitting: boolean) => void) => {
        try {
            setLoading(true)
            const formData = new FormData();
            formData.append("avatar", values.avatar as any);
            formData.append("name", values.name);
            values.members?.forEach((member) => {
                formData.append("members[]", member);
            });

            const res = await ChatServices.createGroup(formData);
            toast.success(res.data.message);
            setOpen(false);
        } catch (error) {
            errorHandler(error);
        } finally {
            setOpen(false);
            setLoading(false);
            setImagePreview("");
        }
    }

    const updateGroup = async (values: createNewGroupType, setSubmitting: (isSubmitting: boolean) => void) => {
        try {
            setLoading(true)
            const formData = new FormData();

            formData.append("name", values.name);
            formData.append("chatId", chatDetails?._id || "");
            values.members?.forEach((member) => {
                formData.append("members[]", member);
            });
            if (chatDetails?.avatar?.public_id && chatDetails?.avatar?.url != formik.values.avatar) {
                formData.append("deletedPhotoPublicId", chatDetails?.avatar?.public_id)
                formData.append("avatar", values.avatar);
            }
            const res = await ChatServices.updateGroup(formData)
            toast.success(res?.data?.message)
            if ((refresh == true || refresh == false) && setRefresh) {
                setRefresh(!refresh)
            }
            setOpen(false);
        } catch (error) {
            errorHandler(error)
        }
        finally {
            setOpen(false);
            setLoading(false);
            setImagePreview("");
        }
    }

    const handleClose = () => {
        setOpen(false)
        setImagePreview("");
        formik.resetForm()
    }


    return (
        <div>
            <span className="text-white text-lg cursor-pointer" onClick={() => setOpen(true)}>
                {pageName === "create" ? <MdGroupAdd /> : <Button>Manage Group</Button>}
            </span>

            {open && (
                <div className="pointer-events-auto fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
                    <div className="relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white font-sans text-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl">
                        <div className="flex items-center p-4 font-sans text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900">
                            {pageName === "create" ? "Create Group" : "Manage Group"}
                        </div>
                        <FormikProvider value={formik}>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="relative p-4 font-sans text-base antialiased leading-relaxed border-t border-b border-t-blue-gray-100 border-b-blue-gray-100 px-11">
                                    <div className='w-full flex items-center justify-center mb-3'>
                                        <span className='relative'>
                                            <input
                                                type="file"
                                                className='hidden'
                                                ref={imageRef}
                                                onChange={handleImageChange}
                                            />
                                            <img
                                                src={imagePreview || "/images/defaultGroupImage.jpg"}
                                                alt="user-image"
                                                className="rounded-full h-[100px] w-[100px]"
                                            />
                                            <span
                                                className='absolute bottom-0 right-0 cursor-pointer pl-10'
                                                onClick={() => imageRef?.current?.click()}
                                            >
                                                <FaCamera />
                                            </span>
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="group_name" className="font-bold">
                                            Group Name
                                        </label>
                                        <input
                                            type="text"
                                            className="input border"
                                            id="group_name"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.name && formik.errors.name ? (
                                            <div className='error'>{formik.errors.name}</div>
                                        ) : null}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="group_members" className="font-bold">
                                            Members
                                        </label>
                                        <Select
                                            value={formik.values.members}
                                            onChange={(selectedOptions) => {
                                                formik.setFieldValue('members', selectedOptions);
                                            }}
                                            components={animatedComponents}
                                            options={allFriends}
                                            isMulti
                                            closeMenuOnSelect={false}
                                        />

                                        <ErrorMessage name='members' component={"div"} className='error' />
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-end p-4 shrink-0 text-blue-gray-500">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={loading}
                                        className="px-6 py-3 mr-1 font-sans text-xs font-bold text-red-500 uppercase transition-all rounded-lg middle none center hover:bg-red-500/10 active:bg-red-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="middle none center rounded-lg bg-gradient-to-tr from-green-600 to-green-400 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                        disabled={loading}
                                    >
                                        {pageName === "manage" ?
                                            loading ? "Updating" : "Update"
                                            : loading ? "Creating" : "Create"}
                                    </button>
                                </div>
                            </form>
                        </FormikProvider>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateGroup;
