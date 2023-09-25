import { Button, Col, Row } from "react-bootstrap";
import React, {
  ChangeEvent,
  useContext,
} from "react";
import CustomFormField from "../global/form/CustomFormField";
import AccountContext from "../../store/account-context";
import { IShippingInfo } from "../../models/ShippingInformation.model";
import countyService from "../../shared/services/countyService";
import { Autocomplete, TextField } from "@mui/material";
import Switch from "@mui/material/Switch";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const shippingInfoSchema = z.object({
  address: z
    .string()
    .min(1, "Campul este obligatoriu")
    .min(6, "Adresa nu este valida"),
  city: z
    .string()
    .min(1, "Campul este obligatoriu")
    .refine(
      (val) => {
        const regex = /^[0-9]+$/;
        return !regex.test(val);
      },
      { message: "Campul nu este valid" }
    ),
  county: z.string().min(1, "Campul este obligatoriu"),
  full_name: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => {
        const cleanedName = val.replace(/\s+/g, ' ');
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
  phone: z
    .string()
    .min(1, { message: "Campul este obligatoriu" })
    .refine(
      (val) => {
        // phone validation, must be 0 - 9 and must start with 0
        const regex = /^[0-9]+$/;
        return val.startsWith("0") && val.length === 10 && regex.test(val);
      },
      { message: "Numarul de telefon nu este corect" }
    ),
  primary: z.boolean(),
});

type TShippingInfoSchema = z.infer<typeof shippingInfoSchema>;
type Props = {
  onSubmit: () => void;
};

export default function ShipmentForm({ onSubmit }: Props) {
  const accountManager = useContext(AccountContext);
  const countyList = countyService.getCountyList();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    reset,
  } = useForm<TShippingInfoSchema>({
    resolver: zodResolver(shippingInfoSchema),
    defaultValues: {
        address: "",
        city: "",
        county: "",
        full_name: "",
        phone: "",
        primary: false
    }
  });

  const onFormSubmit = async (formInputData: TShippingInfoSchema) => {
    const data: IShippingInfo = {
        address: formInputData.address,
        full_name: formInputData.full_name,
        city: formInputData.city,
        county: formInputData.county,
        phone: formInputData.phone,
        primary: formInputData.primary,
    }
    accountManager!.addShippingInfo(data);
    onSubmit();
    reset();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="shipment-details-form"
      >
        <CustomFormField
          {...register("address", {
            required: "Campul este obligatoriu"
          })}
          label="Adresa"
          type="text"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("address", e.target.value)
          }
          error={errors.address?.message}
        />
        <Row>
          <Col lg={6}>
            <CustomFormField
              {...register("full_name")}
              label="Nume si Prenume"
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setValue("full_name", e.target.value)
              }
              error={errors.full_name?.message}
            />
          </Col>
          <Col lg={6}>
            <CustomFormField
              {...register("phone")}
              label="Telefon"
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setValue("phone", e.target.value)
              }
              error={errors.phone?.message}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <CustomFormField
              {...register("city")}
              label="Oras"
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setValue("city", e.target.value)
              }
              error={errors.city?.message}
            />
          </Col>
          <Col lg={6}>
            <Autocomplete
              {...register("county")}
              className={`custom-autocomplete ${
                errors.county?.message ? "invalid-field" : ""
              }`}
              disablePortal
              id="county"
              options={countyList}
              defaultValue={undefined}
              onChange={(event, value) => {
                value && setValue("county", value);
              }}
              renderInput={(params) => <TextField {...params} label="Judet" />}
            />
            <div className="invalid-field">{errors.county?.message}</div>
          </Col>
        </Row>
        <div className="custom-switch-input">
          <label>Make this address primary</label>
          <Switch
            {...register("primary")}
            onChange={(e, value) => {
              setValue("primary", value);
            }}
            defaultChecked={false}
          />
        </div>
        <Button
          className="button-second mt-5"
          type="submit"
        //   onClick={() => isValid && onSubmit}
          disabled={isSubmitting}
        >
          Add new address
        </Button>
      </form>
    </>
  );
}
