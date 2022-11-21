import {
  Box,
  Heading,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getOfficeHeadlines } from "@vavassor/nws-client";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  officeId: string | undefined;
}

export const OfficeHeadlinesSection: FC<Props> = ({ officeId }) => {
  const { data: headlines } = useQuery(
    ["officeHeadlines", officeId],
    () => getOfficeHeadlines({ officeId: officeId! }),
    {
      enabled: !!officeId,
    }
  );
  const { t } = useTranslation("office");

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      <Heading as="h2" px={8} size="lg">
        {t("officeHeadlinesSection.heading")}
      </Heading>
      {!!headlines && headlines["@graph"].length > 0 ? (
        <UnorderedList>
          {headlines?.["@graph"].map((headline) => (
            <ListItem>
              <Link href={headline.link}>{headline.name}</Link>
            </ListItem>
          ))}
        </UnorderedList>
      ) : (
        <Text px={8}>{t("officeHeadlinesSection.noHeadlinesMessage")}</Text>
      )}
    </Box>
  );
};
