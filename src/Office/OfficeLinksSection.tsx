import { Box, Heading, Link, ListItem, UnorderedList } from "@chakra-ui/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  officeId: string | undefined;
}

export const OfficeLinksSection: FC<Props> = ({ officeId }) => {
  const { t } = useTranslation("office");
  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      <Heading as="h2" px={8} size="lg">
        {t("officeLinksSection.heading")}
      </Heading>
      <UnorderedList px={8}>
        <ListItem>
          <Link as={RouterLink} to={`/products?location=${officeId}`}>
            {t("officeLinksSection.latestRelatedTextProductsLink")}
          </Link>
        </ListItem>
      </UnorderedList>
    </Box>
  );
};
