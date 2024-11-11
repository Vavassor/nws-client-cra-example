import { Box, Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getOffice } from "@vavassor/nws-client";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  officeId: string | undefined;
}

export const OfficeSummarySection: FC<Props> = ({ officeId }) => {
  const { data: office } = useQuery(
    ["office", officeId],
    () => getOffice({ officeId: officeId! }),
    {
      enabled: !!officeId,
    }
  );
  const { t } = useTranslation("office");

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      {!!office && (
        <>
          <Heading as="h1" px={8} size="lg">
            {t("officeSummarySection.heading", { officeName: office.name })}
          </Heading>
          <Box as="address" fontStyle="normal" mt={4} px={8}>
            {t("officeSummarySection.contactAddress", {
              locality: office.address.addressLocality,
              postalCode: office.address.postalCode,
              region: office.address.addressRegion,
              streetAddress: office.address.streetAddress,
            })}
            <br />
            {t("officeSummarySection.contactPhoneNumber", {
              phoneNumber: office.telephone,
            })}
            <br />
            {t("officeSummarySection.contactFaxNumber", {
              faxNumber: office.faxNumber,
            })}
          </Box>
        </>
      )}
    </Box>
  );
};
