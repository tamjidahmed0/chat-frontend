"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import tamjid from "@/public/tamjid.jpg";
import getProfileDetails from "@/lib/getProfileDetails";
import getCookie from "@/components/getCoockie";
import updateUser from "@/lib/updateUser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toastService from "@/services/toastService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/components/modal";

const Page = ({ params }) => {
  const { slug } = params;
  const [result, setResult] = useState({});
  const [update, setUpdate] = useState({});
  const [imagePreviews, setPreview] = useState(null);

  const [file, setFile] = useState(null);

  //   const userID = getCookie('c_user').value

  useEffect(() => {
    const api = async () => {
      const userId = (await getCookie("c_user")).value;
      const result = await getProfileDetails(userId);
      setResult(result);
    };

    api();
  }, [update]);

  const handleSubmit = async (formData) => {
    const name = formData.get("name");
    const username = formData.get("username");

    const result = await toastService.promise(updateUser(name, username));

    // const result = await updateUser(name, username)
    setResult(result);
    setUpdate(result);

    console.log(result);

    if (result.status === 201) {
      toast.success("Updated successfully");
    } else {
      toast.error(result.msg);
    }
  };

  const handleImageSend = () => {};

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // console.log('Reader result:', reader.result);
        setPreview(reader.result);
      };
      reader.onerror = (error) => {
        console.error("Reader error:", error);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  switch (`/settings/${slug}`) {
    case `/settings/profile`:
      return (
        <form className="w-[100%] z-40 transition-transform -translate-x-full sm:translate-x-0" action={handleSubmit}>
          <ToastContainer position="top-center" />
          {imagePreviews && <Modal image={imagePreviews} imageData={file} />}

          <div className="flex flex-col items-center mt-16">
            <div className="w-full flex justify-center  ">
              <div className=" relative">
                <Image src={`${process.env.NEXT_PUBLIC_API}/${result.profilePic}`} width={100} height={100} objectFit="cover" className="rounded-full w-[8rem] h-[8rem] object-cover " />

                {/* <div className = ' absolute bottom-0 right-0'>
              <FontAwesomeIcon icon={faCamera} size="xl" color="#fff" className=" bg-[#18191A] p-3 rounded-full cursor-pointer" onClick = {handleImageSend} />
              </div> */}

                <label className="absolute bottom-0 right-0 ">
                  <FontAwesomeIcon icon={faCamera} size="xl" color="#fff" className=" bg-[#18191A] p-3 rounded-full cursor-pointer" onClick={handleImageSend} />
                  <input name="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>
            <span className="text-3xl text-[#fff] font-medium">{result.name}</span>
          </div>

          <div className="max-w-md mx-auto my-4 p-4 border rounded-lg shadow-2xl mt-16">
            <div className="mb-4">
              <label htmlFor="name" className="block  font-bold mb-2 text-white">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 bg-transparent placeholder-gray-400 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-white"
                placeholder={result.name}
                // value={name}
                // onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="username" className="block  font-bold mb-2 text-white">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-3 py-2 bg-transparent  border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-white"
                placeholder={result.username}

                // onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
              Save
            </button>
          </div>
        </form>
      );
  }
};

export default Page;
