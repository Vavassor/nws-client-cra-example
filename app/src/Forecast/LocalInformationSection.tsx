import { Box, Heading, Link, ListItem, UnorderedList } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { usePoint } from "./usePoint";

export const LocalInformationSection: FC = () => {
  const { point } = usePoint();
  const { t } = useTranslation("forecast");

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      <Heading as="h2" px={8} size="lg">
        {t("localInformationCard.heading")}
      </Heading>
      {!!point && (
        <UnorderedList px={8}>
          <ListItem>
            <Link as={RouterLink} to={`offices/${point.properties.cwa}`}>
              {t("localInformationCard.forecastOfficeLink")}
            </Link>
          </ListItem>
        </UnorderedList>
      )}
    </Box>
  );
};
