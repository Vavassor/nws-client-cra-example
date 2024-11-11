import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { TextProductTypeCollection } from "@vavassor/nws-client";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface FormValues {
  endDate: string;
  startDate: string;
  type: string;
}

interface ProductFiltersFormProps {
  defaultType: string | undefined;
  onSubmit: (values: FormValues) => void;
  productTypes: TextProductTypeCollection | undefined;
}

export const ProductFiltersForm: FC<ProductFiltersFormProps> = ({
  onSubmit,
  productTypes,
  defaultType,
}) => {
  const {
    formState: { isSubmitting },
    handleSubmit,
    register,
  } = useForm<FormValues>({
    defaultValues: {
      type: defaultType,
    },
  });
  const { t } = useTranslation("product");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormControl>
        <FormLabel>{t("productsSection.typeFieldLabel")}</FormLabel>
        <Select {...register("type")}>
          {productTypes?.["@graph"].map((type) => (
            <option value={type.productCode}>{type.productName}</option>
          ))}
        </Select>
      </FormControl>
      <Button isLoading={isSubmitting} mt={4} type="submit">
        {t("productsSection.searchButtonLabel")}
      </Button>
    </form>
  );
};
