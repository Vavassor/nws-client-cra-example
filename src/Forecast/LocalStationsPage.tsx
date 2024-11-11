import {
  Box,
  Container,
  Heading,
  Link,
  ListItem,
  UnorderedList,
} from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { useQuery } from "@tanstack/react-query";
import { getGridpointStationsGeoJson } from "@vavassor/nws-client";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useDocumentTitle } from "../Common/useDocumentTitle";

export const LocalStationsPage: FC = () => {
  const { t } = useTranslation("forecast");
  const [searchParams] = useSearchParams();
  useDocumentTitle(t("localStationsPage.pageTitle"));

  const { data: stations } = useQuery(
    [
      "gridpointStations",
      searchParams.get("gridId"),
      searchParams.get("gridX"),
      searchParams.get("gridY"),
    ],
    () =>
      getGridpointStationsGeoJson({
        forecastOfficeId: searchParams.get("gridId")!,
        gridX: searchParams.get("gridX")!,
        gridY: searchParams.get("gridY")!,
      }),
    {
      enabled:
        searchParams.has("gridId") &&
        searchParams.has("gridX") &&
        searchParams.has("gridY"),
    }
  );

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
        <Heading as="h1" px={8} size="lg">
          {t("localStationsSection.heading")}
        </Heading>
        {!!stations && (
          <UnorderedList px={8}>
            {stations.features.map((station) => (
              <ListItem>
                <Link
                  as={RouterLink}
                  to={`/stations/${station.properties.stationIdentifier}`}
                >
                  {station.properties.name}
                </Link>
              </ListItem>
            ))}
          </UnorderedList>
        )}
      </Box>
    </Container>
  );
};
