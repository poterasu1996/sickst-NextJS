import { ChangeEvent, useContext, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Components
import DateFormField from "../global/form/DateFormField";  // from primereact, to be removed
import AutocompleteSelect from "../global/form/Autocomplete";

// Storage & services
import AccountContext from "../../store/account-context";
import countyService from "../../shared/services/countyService";
import userService from "../../shared/services/userService";

// Utils
import { AppUtils } from "../../shared/utils/app.utils";
import { GenderEnum, IUserDetailsModel } from "../../models/UserDetails.model";
import InputField from "../global/form/InputField";

interface FormData {
  address: string;
  birthday: Date | string | null;
  city: string;
  county: string;
  full_name: string;
  gender: { title: string; value: string }[];
  phone: string;
}

const personalInfoSchema = z.object({
  address: z
    .string({ required_error: "Campul este obligatoriu" })
    .min(1, "Campul este obligatoriu")
    .min(6, "Adresa nu este valida"),
  city: z
    .string({
      required_error: "Campul este obligatoriu",
      invalid_type_error: "Campul poate contine doar litere",
    })
    .refine((val) => val.length > 0, { message: "Campul este obligatoriu" }),
  county: z
    .string({ required_error: "Campul este obligatoriu" })
    .refine((val) => val.length > 0, { message: "Campul este obligatoriu" }),
  full_name: z
    .string()
    .transform((val) => val.trim())
    .refine(
      (val) => {
        const cleanedName = val.replace(/\s+/g, " ");
        const nameParts = cleanedName.split(" ");
        return nameParts.length >= 2;
      },
      { message: "Introduceti numele complet" }
    )
    .refine(
      (val) => {
        const regex = /^[0-9]+$/;
        return !regex.test(val);
      },
      { message: "Campul nu este valid" }
    ),
  gender: z.string({ required_error: "Campul este obligatoriu" }),
  phone: z
    .string({ required_error: "Campul este obligatoriu" })
    .refine((val) => val.length > 0, { message: "Campul este obligatoriu" })
    .refine((val) => val.length === 10, {
      message: "Numarul de telefon nu este corect",
    }),
});

type TPersonalInfoSchema = z.infer<typeof personalInfoSchema>;

const PersonalInfo = () => {
  const defaultFirstName = "Sickst"; // default value safed in database
  const defaultBirthdayDate = "1970-01-01"; // default date from DB
  const countyList = countyService.getCountyList();
  const [formData, setFormData] = useState<FormData>({
    address: "",
    birthday: null,
    city: "",
    county: "",
    full_name: "",
    gender: [{ title: "Domnul", value: "male" }],
    phone: "",
  });
  const [isDirty, setIsDirty] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<IUserDetailsModel | undefined>(
    undefined
  );
  const [personalInfoID, setPersonaInfoID] = useState<number | undefined>(undefined);
  const genderList = [
    { title: "Domnul", value: "male" },
    { title: "Doamna", value: "female" },
    { title: "Alta", value: "other" },
  ];
  const accountManager = useContext(AccountContext);
  const { id } = accountManager!.currentUser!;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<TPersonalInfoSchema>({
    resolver: zodResolver(personalInfoSchema),
  });

  const handleDirty = () => {
    if (!isDirty) {
      setIsDirty(true);
    }
  };

  const onSubmit = async (formInputData: TPersonalInfoSchema) => {
    let parsedName: { first_name: string; last_name: string } | null = null;
    if (formInputData.full_name) {
      parsedName = AppUtils.splitUserFullName(formInputData.full_name);
    }

    const data: IUserDetailsModel = {
      address: formData.address,
      birthday:
        formData.birthday && AppUtils.parseBirthdayDate(formData.birthday),
      city: formData.city,
      client_role: personalInfo!.client_role,
      county: formData.county,
      first_name: parsedName!.first_name,
      gender: formData.gender[0].value,
      last_name: parsedName!.last_name,
      phone_number: formData.phone,
      user_id: id,
    };

    setIsFormSubmitted(true);
    userService.updateUserDetails(data)
      .then(() => {
        AppUtils.toastNotification("Datele personale au fost actualizate cu success!", true)
        accountManager?.refreshContext();
      })
      .catch(error => AppUtils.toastNotification("OOPS! An error occured while updating personal info!", false))
  };

  useEffect(() => {
    if(accountManager) {
      setPersonalInfo(accountManager.userDetails?.attributes)
      setPersonaInfoID(accountManager.userDetails?.id);
    }
  }, []);

  useEffect(() => {
    if (personalInfo) {
      setFormData({
        address: personalInfo.address ? personalInfo.address : "",
        birthday:
          personalInfo.birthday === defaultBirthdayDate
            ? null
            : AppUtils.parseDBBirthdayDate(personalInfo.birthday),
        city: personalInfo.city ? personalInfo.city : "",
        county: personalInfo.county ? personalInfo.county : "",
        phone: personalInfo.phone_number ? personalInfo.phone_number : "",
        full_name:
          personalInfo.first_name === defaultFirstName
            ? ""
            : personalInfo.last_name + " " + personalInfo.first_name,
        gender: [
          personalInfo.gender === GenderEnum.MALE
            ? { title: "Domnul", value: "male" }
            : personalInfo.gender === GenderEnum.FEMALE
            ? { title: "Doamna", value: "female" }
            : { title: "Alta", value: "other" },
        ],
      });
    }
  }, [personalInfo]);

  useEffect(() => {
    // prepopulate form
    if (formData.full_name.length > 0) {
      reset({
        ...formData,
        gender: formData.gender[0].value,
      });
    }
  }, [formData]);

  return (
    <>
      <div className="user-details">
        <div className="title">Detalii cont</div>
        <div className="info">
          Detaliile personale pot ajuta la imbunatatirea serviciului nostru.
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="user-details-form">
          {/* gap will fix after boostrap library removal */}
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-4"> 
            <InputField
              className="mt-12"
              label="Nume si Prenume*"
              type="text"
              value={formData.full_name}
              error={errors.full_name?.message}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setFormData({ ...formData, full_name: e.target.value });
                setValue("full_name", e.target.value)
                handleDirty();
              }}
            />
            <InputField
              className="mt-12"
              label="Telefon*"
              type="text"
              value={formData.phone}
              error={errors.phone?.message}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                console.log("eee", e)
                setFormData({ ...formData, phone: e.target.value });
                setValue("phone", e.target.value)
                handleDirty();
              }}
            />
          </div>

          <div className="grid grid-cols-1">
            <InputField
              className="mt-12"
              label="Adresa*"
              type="text"
              value={formData.address}
              error={errors.address?.message}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setFormData({ ...formData, address: e.target.value });
                setValue("address", e.target.value)
                handleDirty();
              }}
            />
          </div>
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-4">
            <InputField
              className="mt-12"
              label="Oras*"
              type="text"
              value={formData.city}
              error={errors.city?.message}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setFormData({ ...formData, city: e.target.value });
                handleDirty();
              }}
            />
            <AutocompleteSelect 
              {...register("county")}
              disablePortal
              id="county"
              options={countyList}
              value={formData.county || ""}
              onChange={(_, value) => {
                if(value && !Array.isArray(value)) {
                  setFormData({ ...formData, county: value! });
                  value && setValue("county", value);
                  handleDirty();
                }
              }}
              inputValue={formData.county || ""}
              onInputChange={(_, value) => {
                setFormData({ ...formData, county: value! });
              }}
              label="Judet*"
              error={errors.county?.message}
            />
          </div>
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-4">
            <DateFormField
              placeholder="Data de nastere"
              value={formData.birthday}
              onChange={(val: ChangeEvent<HTMLInputElement>) => {
                setFormData({
                  ...formData,
                  birthday: val.target.value,
                });
                handleDirty();
              }}
            />
            <AutocompleteSelect
              className="custom-autocomplete"
              disablePortal
              disableClearable
              id="gender"
              options={genderList}
              value={formData.gender[0]}
              getOptionLabel={(option) => option.title}
              onChange={(_, value) => {
                if(value && !Array.isArray(value)) {
                  setFormData({ ...formData, gender: [{ ...value! }] });
                  handleDirty();
                }
              }}
              label="Forma de adresare"
            />
          </div>
          <button
            className="button-second mt-5"
            type="submit"
            disabled={isFormSubmitted || !isDirty || isSubmitting}
          >
            Update information
          </button>
        </form>
      </div>
    </>
  );
};

export default PersonalInfo;
