import React, { ChangeEvent, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

// Components
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import InputFileUpload from "../../components/global/FileUploadButton";

// Storage & services
import AuthContext from "../../store/auth-context";
import contactService from "../../services/contactService";
import { IContactUsModel } from "../../models/ContactUs.model";

// Utils
import { AppUtils } from "../../utils/app.utils";
import InputField from "../../components/global/form/InputField";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

const fileSchema = z
  .any()
  .refine((file) => !file || file.size <= MAX_UPLOAD_SIZE, {
    message: "File size must be less than 5MB",
  })
  .refine((file) => !file || ACCEPTED_FILE_TYPES.includes(file.type), {
    message: "File must be a PNG or JPEG",
  });

const contactUsSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(1, "Campul este obligatoriu"),
  description: z.string().min(1, 'Campul este obligatoriu'),
  // category: z.string(),
  attachments: fileSchema.optional(),
});

type TContactUsSchema = z.infer<typeof contactUsSchema>;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
      fontSize: "1.5rem",
    },
  },
};

export default function ContactUs() {
  const { isAuth } = useContext(AuthContext);
  const router = useRouter();
  const [category, setCategory] = useState("general");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    reset,
  } = useForm<TContactUsSchema>({
    resolver: zodResolver(contactUsSchema),
  });

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  // const onFormSubmit = async (formData: IContactUsModel) => {
  //   if(!isAuth) {
  //       router.push("/account/login");
  //   } else {
  //       const data = {
  //         ...formData,
  //         category: category,
  //         // attachements: null,
  //       };

  //       if (formData.attachements && formData.attachements instanceof File) {
  //         try {
  //           const encodedFile = await AppUtils.encodeFileToBase64Alt(formData.attachements);
  //           data.attachements = encodedFile;
  //         } catch (error) {
  //           console.error('Error encoding file:', error);
  //           data.attachements = undefined;
  //         }
  //       } 

  //       // console.log('data si aici', data);
  //       contactService.postContactUs(data);
  //   }
  // };

  const onFormSubmit = async (formData: IContactUsModel) => {
    if (!isAuth) {
      router.push("/account/login");
    } else {
      const data = new FormData();
      data.append('category', category);
      console.log("formData", formData)
      
      Object.keys(formData).forEach(key => {
        data.append(key, (formData as any)[key]);
      });
  
      // if (formData.attachments && formData.attachments instanceof File) {
      //   data.append('attachments', formData.attachments);
      // }
  
      console.log('Data being sent:', data); // Log the data being sent
  
      try {
        const response = await contactService.postContactUs(data);
        console.log('Response:', response); // Log the response
      } catch (error) {
        console.error('Error posting contact us form:', error); // Log the error
      }
    }
  };

  const handleFileInput = () => {
    const input = document.getElementById("file-input") as HTMLInputElement;
    const fileNameElement = document.getElementById(
      "file-name"
    ) as HTMLSpanElement;
    if (fileNameElement && input.files && input.files.length > 0) {
      fileNameElement.textContent = input.files[0].name;
    } else {
      fileNameElement.textContent = "No file chosen";
    }
  };

  return (
    <div className="container h-full mb-auto pt-10 pb-10">
      <div className="contact-us">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <h1 className="text-4xl font-bold mb-10">Submit a request</h1>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel id="category-label">Select category*</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={category}
              label="Select category ss"
              onChange={handleChangeCategory}
              MenuProps={MenuProps}
            >
              <MenuItem value="general">General</MenuItem>
              <MenuItem value="membership">Membership & Subscription</MenuItem>
              <MenuItem value="shipping">Shipping & Tracking</MenuItem>
              <MenuItem value="billing">Billing & Payment</MenuItem>
              <MenuItem value="my-account">My Account</MenuItem>
              <MenuItem value="gifts">Gifts</MenuItem>
              <MenuItem value="returns">Returns</MenuItem>
              <MenuItem value="cancel-subscription">
                Cancel My Subscription
              </MenuItem>
            </Select>
          </FormControl>
          <InputField
            {...register("email", { value: getValues("email") || "" })}
            className="mt-12"
            label="Your email address*"
            type="email"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue("email", e.target.value)
            }
            error={errors?.email?.message}
          />
          <InputField
            {...register("subject", { value: getValues("subject") || "" })}
            className="mt-12"
            label="Subject*"
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue("subject", e.target.value)
            }
            error={errors?.subject?.message}
          />
          {/* <InputField
            {...register("description", {
              value: getValues("description") || "",
            })}
            className={"textarea"}
            label="Description*"
            type="text"
            as="textarea"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue("description", e.target.value)
            }
            error={errors?.description?.message}
            style={{ height: "100px" }}
          /> */}
          <InputFileUpload
            {...register("attachments", {
              value: getValues("attachments") || undefined,
            })}
            className="mt-8 mb-8"
            onChange={(event: any) => {
              setValue("attachments", event.target.files[0]);
              handleFileInput();
            }}
            error={errors?.attachments?.message}
          />
          <div className="btw-wrapper mt-10">
            <button className="button-second mt-4 ms-0" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
