import { useContext, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import CustomFormField from "../global/form/CustomFormField";
import DateFormField from "../global/form/DateFormField";
import countyService from "../../shared/services/countyService";
import { Autocomplete, TextField } from "@mui/material";
import { AppUtils } from "../../shared/utils/app.utils";
import AccountContext from "../../store/account-context";
import { GenderEnum, IUserDetailsModel } from "../../models/UserDetails.model";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
    .min(2, "Campul este obligatoriu"),
  city: z
    .string({
        required_error: "Campul este obligatoriu",
        invalid_type_error: "Campul poate contine doar litere",
    })
    .refine((val) => val.length > 0, { message: "Campul este obligatoriu" }),
  county: z
    .string({ required_error: "Campul este obligatoriu" })
    .refine((val) => val.length > 0, { message: "Campul este obligatoriu" }),
  full_name: z.
    string({
        required_error: "Campul este obligatoriu",
        invalid_type_error: "Campul poate contine doar litere",
    })
    .min(5, "Campul este obligatoriu"),
  gender: z.string({ required_error: "Campul este obligatoriu" }),
  phone: z
    .string({ required_error: "Campul este obligatoriu" })
    .refine((val) => val.length > 0, { message: "Campul este obligatoriu" })
    .refine((val) => val.length === 10, { message: "Numarul de telefon nu este corect"})
    ,
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
  const [personalInfo, setPersonalInfo] = useState<IUserDetailsModel | null>(
    null
  );
  const [personalInfoID, setPersonaInfoID] = useState(null);
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
    formState: { errors, isSubmitting, isValid },
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
    accountManager?.addPersonalInfo(data, personalInfoID!);
  };

  useEffect(() => {
    accountManager?.fetchPersonalInfo().then((response) => {
      setPersonalInfo(response.data[0].attributes);
      setPersonaInfoID(response.data[0].id);
    });
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
            : personalInfo.first_name + " " + personalInfo.last_name,
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
          <Row>
            <Col lg={6}>
              <CustomFormField
                {...register("full_name")}
                label="Nume si Prenume*"
                type="text"
                value={formData.full_name}
                error={errors.full_name?.message}
                onChange={(e: any) => {
                  setFormData({ ...formData, full_name: e.target.value });
                  handleDirty();
                }}
              />
            </Col>
            <Col lg={6}>
              <CustomFormField
                {...register("phone")}
                label="Telefon*"
                type="text"
                value={formData.phone}
                error={errors.phone?.message}
                onChange={(e: any) => {
                  setFormData({ ...formData, phone: e.target.value });
                  handleDirty();
                }}
              />
            </Col>
          </Row>
          <CustomFormField
            {...register("address")}
            label="Adresa*"
            type="text"
            value={formData.address}
            error={errors.address?.message}
            onChange={(e: any) => {
              setFormData({ ...formData, address: e.target.value });
              handleDirty();
            }}
          />
          <Row>
            <Col lg={6}>
              <CustomFormField
                {...register("city")}
                label="Oras*"
                type="text"
                value={formData.city}
                error={errors.city?.message}
                onChange={(e: React.BaseSyntheticEvent) => {
                  setFormData({ ...formData, city: e.target.value });
                  handleDirty();
                }}
              />
            </Col>
            <Col lg={6}>
              <Autocomplete
                {...register("county")}
                className={`custom-autocomplete ${errors.county?.message ? "invalid-field" : ""}`}
                disablePortal
                id="county"
                options={countyList}
                value={formData.county || ""}
                onChange={(event, value) => {
                  setFormData({ ...formData, county: value! });
                  value && setValue("county", value);
                  handleDirty();
                }}
                inputValue={formData.county || ""}
                onInputChange={(event, value) => {
                  setFormData({ ...formData, county: value! });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Judet*" />
                )}
              />
              <div className="invalid-field">{errors.county?.message}</div>
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <DateFormField
                placeholder="Data de nastere"
                value={formData.birthday}
                onChange={(val: React.BaseSyntheticEvent) => {
                  setFormData({
                    ...formData,
                    birthday: val.target.value,
                  });
                  handleDirty();
                }}
              />
            </Col>
            <Col lg={6}>
              <Autocomplete
                className="custom-autocomplete"
                disablePortal
                id="gender"
                options={genderList}
                value={formData.gender[0]}
                getOptionLabel={(option) => option.title}
                onChange={(event, value) => {
                  setFormData({ ...formData, gender: [{ ...value! }] });
                  handleDirty();
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Forma de adresare" />
                )}
              />
            </Col>
          </Row>
          <Button
            className="button-second mt-5"
            type="submit"
            disabled={isFormSubmitted || !(isValid && isDirty) || isSubmitting}
          >
            Update information
          </Button>
        </form>
      </div>
    </>
  );
};

export default PersonalInfo;
