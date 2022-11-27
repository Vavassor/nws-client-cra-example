import { Button, FormControl, FormLabel, Select } from "@chakra-ui/react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface FormValues {
  areaCode: string;
}

interface Props {
  defaultAreaCode: string | undefined;
  onSubmit: (values: FormValues) => void;
}

export const StationsFilterForm: FC<Props> = ({
  defaultAreaCode,
  onSubmit,
}) => {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<FormValues>({ defaultValues: { areaCode: defaultAreaCode } });
  const { t } = useTranslation("station");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl>
        <FormLabel>{t("stationsSection.areaFieldLabel")}</FormLabel>
        <Select {...register("areaCode")}>
          <option value="AL">Alabama</option>
          <option value="AK">Alaska</option>
          <option value="AS">American Samoa</option>
          <option value="AR">Arkansas</option>
          <option value="AZ">Arizona</option>
          <option value="CA">California</option>
          <option value="CO">Colorado</option>
          <option value="CT">Connecticut</option>
          <option value="DE">Delaware</option>
          <option value="DC">District of Columbia</option>
          <option value="FL">Florida</option>
          <option value="GA">Georgia</option>
          <option value="GU">Guam</option>
          <option value="HI">Hawaii</option>
          <option value="ID">Idaho</option>
          <option value="IL">Illinois</option>
          <option value="IN">Indiana</option>
          <option value="IA">Iowa</option>
          <option value="KS">Kansas</option>
          <option value="KY">Kentucky</option>
          <option value="LA">Louisiana</option>
          <option value="ME">Maine</option>
          <option value="MD">Maryland</option>
          <option value="MA">Massachusetts</option>
          <option value="MI">Michigan</option>
          <option value="MN">Minnesota</option>
          <option value="MS">Mississippi</option>
          <option value="MO">Missouri</option>
          <option value="MT">Montana</option>
          <option value="NE">Nebraska</option>
          <option value="NV">Nevada</option>
          <option value="NH">New Hampshire</option>
          <option value="NJ">New Jersey</option>
          <option value="NM">New Mexico</option>
          <option value="NY">New York</option>
          <option value="NC">North Carolina</option>
          <option value="ND">North Dakota</option>
          <option value="OH">Ohio</option>
          <option value="OK">Oklahoma</option>
          <option value="OR">Oregon</option>
          <option value="PA">Pennsylvania</option>
          <option value="PR">Puerto Rico</option>
          <option value="RI">Rhode Island</option>
          <option value="SC">South Carolina</option>
          <option value="SD">South Dakota</option>
          <option value="TN">Tennessee</option>
          <option value="TX">Texas</option>
          <option value="UT">Utah</option>
          <option value="VT">Vermont</option>
          <option value="VI">U.S. Virgin Islands</option>
          <option value="VA">Virginia</option>
          <option value="WA">Washington</option>
          <option value="WV">West Virginia</option>
          <option value="WI">Wisconsin</option>
          <option value="WY">Wyoming</option>
          <option value="MP">Northern Mariana Islands</option>
          <option value="PW">Palau</option>
          <option value="FM">Micronesia</option>
          <option value="MH">Marshall Islands</option>
          <option value="AM">Western North Atlantic Ocean</option>
          <option value="AN">Northwestern North Atlantic Ocean</option>
          <option value="GM">Gulf of Mexico</option>
          <option value="LC">Lake St. Clair</option>
          <option value="LE">Lake Erie</option>
          <option value="LH">Lake Huron</option>
          <option value="LM">Lake Michigan</option>
          <option value="LO">Lake Ontario</option>
          <option value="LS">Lake Superior</option>
          <option value="PH">Central Pacific Ocean</option>
          <option value="PK">North Pacific Ocean Near Alaska</option>
          <option value="PM">Western Pacific Ocean</option>
          <option value="PS">South Central Pacific Ocean</option>
          <option value="PZ">Eastern North Pacific Ocean</option>
          <option value="SL">St. Lawrence River</option>
        </Select>
      </FormControl>
      <Button isLoading={isSubmitting} mt={4} type="submit">
        {t("stationsSection.searchButtonLabel")}
      </Button>
    </form>
  );
};
