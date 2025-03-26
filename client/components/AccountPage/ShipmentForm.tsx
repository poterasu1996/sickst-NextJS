import React, {
  ChangeEvent,
  useContext,
} from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

//  Components
import AutocompleteSelect from "../global/form/Autocomplete";
import Switch from "@mui/material/Switch";

// Storage and services
import AccountContext from "../../store/account-context";
import countyService from "../../shared/services/countyService";
import shippingService from "../../shared/services/shippingService";

// Utilities
import { IShippingInfo } from "../../models/ShippingInformation.model";
import InputField from "../global/form/InputField";

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
    const userId = accountManager!.currentUser?.id;
    shippingService.addShippingInfo(data, userId ?? 0).then(() => accountManager!.refreshContext());  // de modificat, dupa context refacto
    // accountManager!.addShippingInfo(data);
    onSubmit();
    reset();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="shipment-details-form"
      >
        <div className="grid grid-cols-1">
          <InputField
            {...register("address", {
              required: "Campul este obligatoriu"
            })}
            className="mt-12"
            label="Adresa*"
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue("address", e.target.value)
            }
            error={errors.address?.message}
          />
        </div>
        <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-4">
          <InputField
            {...register("full_name")}
            className="mt-12"
            label="Nume si Prenume*"
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue("full_name", e.target.value)
            }
            error={errors.full_name?.message}
          />
          <InputField
            {...register("phone")}
            className="mt-12"
            label="Telefon*"
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue("phone", e.target.value)
            }
            error={errors.phone?.message}
          />
        </div>
        <div className="grid grid-cols-1 gap-1 md:grid-cols-2 md:gap-4">
          <InputField
            {...register("city")}
            className="mt-12"
            label="Oras*"
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue("city", e.target.value)
            }
            error={errors.city?.message}
          />
          <AutocompleteSelect 
            {...register("county")}
            disablePortal
            id="county"
            options={countyList}
            defaultValue={undefined}
            onChange={(_: any, value: any) => {
                value && setValue("county", value);
            }}
            label={"Judet*"}
            error={errors.county?.message}
          />
        </div>
        <div className="custom-switch-input">
          <label>Make this address primary</label>
          <Switch
            {...register("primary")}
            sx={{
              padding: 0,
              height: "2.6rem",
              width: "4.2rem",
              margin: "0 0.8rem",
              '.MuiSwitch-switchBase': {
                padding: 0,
                margin: '2px',
                transitionDuration: '300ms',
                '&.Mui-checked': {
                  transform: 'translateX(16px)',
                  color: '#fff',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#cc3633',
                    opacity: 1,
                    border: 0
                  },
                  '&.MuiSwitch-track': {
                    opacity: 0.5
                  }
                }
              },
              '.MuiSwitch-thumb': {
                boxSizing: 'border-box',
                width: '2.2rem',
                height: '2.2rem',
                color: '#fff'
              },
              '.MuiTouchRipple-root': {
                'display': 'none'
              },
              '.MuiSwitch-track': {
                borderRadius: '1.3rem',
                backgroundColor: '#A9A9AD',
                opacity: 1
              }
            }}
            onChange={(e, value) => {
              setValue("primary", value);
            }}
            defaultChecked={false}
          />
        </div>
        <button
          className="button-second mt-5"
          type="submit"
        //   onClick={() => isValid && onSubmit}
          disabled={isSubmitting}
        >
          Add new address
        </button>
      </form>
    </>
  );
}
