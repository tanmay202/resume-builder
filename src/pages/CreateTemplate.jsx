import React, { useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage, db } from "../config/firebase.config";
import { initialTags } from "../utlis/helper";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import useTemplates from "../hooks/useTemplates";
const CreateTemplate = () => {
  const [formData, setformData] = useState({
    title: "",
    imageURL: null,
  });
  const [selectedTags, setselectedTags] = useState([]);
  const {
    data: templates,
    isError: templatesIsError,
    isLoading: templatesIsLoading,
    refetch: templatesRefetch,
  } = useTemplates();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformData((prevRec) => ({ ...prevRec, [name]: value }));
  };
  const [imageAsset, setimageAsset] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0,
  });

  const handleFileSelect = async (e) => {
    setimageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
    const file = e.target.files[0];

    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapShot) => {
          setimageAsset((prevAsset) => ({
            ...prevAsset,
            progress: (snapShot.bytesTransferred / snapShot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorized")) {
            toast.error(`Error:Authorization Failed`);
          } else {
            toast.error(`Error:${error.message}`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setimageAsset((prevAsset) => ({
              ...prevAsset,
              uri: downloadURL,
            }));
          });
          toast.success("Image uploaded");
          setInterval(() => {
            setimageAsset((prevAsset) => ({
              ...prevAsset,
              isImageLoading: false,
            }));
          }, 2000);
        }
      );
    } else {
      toast.info("Invalid File Format");
    }
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const deleteAnImageObject = async () => {
    setInterval(() => {
      setimageAsset((prevAsset) => ({
        ...prevAsset,
        progress: 0,
        uri: null,
      }));
    }, 2000);
    const deleteRef = ref(storage, imageAsset.uri);
    deleteObject(deleteRef).then(() => {
      toast.success("Image deleted");
    });
  };

  const handleSelectedTags = (tag) => {
    if (selectedTags.includes(tag)) {
      setselectedTags(selectedTags.filter((selected) => selected !== tag));
    } else {
      setselectedTags([...selectedTags, tag]);
    }
  };

  const pushToCloud = async () => {
    const timeStamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.uri,
      tags: selectedTags,
      name:
        templates && templates.length > 0
          ? `Template${templates.length + 1}`
          : "Template1",
      timeStamp: timeStamp,
    };
    
    await setDoc(doc(db, "templates", id), _doc).then(() => {
      setformData((prevData) => ({ ...prevData, title: "", imageURL: "" }));
      setimageAsset((prevAsset) => ({ ...prevAsset, uri: null }));
      setselectedTags([]);
      templatesRefetch();
      toast.success("Data pushed to the cloud");
    });
  };

  return (
    <div className=" w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/*left container*/}

      <div className=" col-span-12 lg:col-span-4 2xl:col-span-3 w-full flex-1 flex items-center justify-start flex-col gap-4 px-2">
        <div className=" w-full">
          <p className=" text-lg text-black">Create a new Template</p>
        </div>

        {/*template id section*/}
        <div className=" w-full flex items-center justify-end">
          <p className=" text-base text-blue-950 uppercase font-semibold">
            TempID:{""}
          </p>

          <p className=" text-sm text-txtDark capitalize font-bold">
            {templates && templates.length > 0
              ? `Template${templates.length + 1}`
              : "Template1"}
          </p>
        </div>

        {/*Template title sec*/}
        <input
          type="text"
          className=" w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-gray-700 focus: text-black focus:shadow-md outline-none"
          name="title"
          placeholder="Template Title"
          value={formData.title}
          onChange={handleInputChange}
        />

        {/* file uploader*/}
        <div className=" w-full bg-gray-100 backdrop-blur-md h-[200px] lg:h-[100px] 2xl:h-[440px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div className=" flex flex-col  items-center justify-center gap-4">
                <PuffLoader color="#498FCD" size={40} />
                <p>{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.uri ? (
                <React.Fragment>
                  <label className=" w-full cursor-pointer h-full">
                    <div className=" flex flex-col items-center justify-center h-full w-full">
                      <div className=" flex items-center justify-center cursor-pointer flex-col gap-4">
                        <FaUpload className=" text-2xl" />
                        <p className=" font-bold">Click to upload</p>
                      </div>
                    </div>

                    <input
                      type="file"
                      className=" w-0 h-0"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className=" relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset?.uri}
                      className=" w-full h-full object-cover"
                      loading="lazy"
                      alt=""
                    />

                    {/*delete button*/}
                    <div
                      className=" absolute top-4 right-4 w-8 h-8
                         rounded-md flex items-center justify-center bg-red-600 cursor-pointer"
                      onClick={deleteAnImageObject}
                    >
                      <FaTrash className=" text-sm text-white" />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>

        {/*tags*/}
        <div className=" w-full flex items-center flex-wrap gap-2">
          {initialTags.map((tag, i) => (
            <div
              key={i}
              className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${
                selectedTags.includes(tag) ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handleSelectedTags(tag)}
            >
              <p className=" text-xs">{tag}</p>
            </div>
          ))}
        </div>
        {/*button for saving*/}
        <button
          type="button"
          className=" w-full bg-blue-700 text-white rounded-md py-3"
          onClick={pushToCloud}
        >
          Save
        </button>
      </div>

      {/*right container */}

      
    </div>
  );
};

export default CreateTemplate;
