import {
  Box,
  Heading,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getStationsGeoJson } from "@vavassor/nws-client";
import { useTranslation } from "react-i18next";
import { usePoint } from "../Forecast/usePoint";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { FormValues, StationsFilterForm } from "./StationsFilterForm";
import { useEffect } from "react";

export const StationsSection = () => {
  const { state } = usePoint();
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const { data: stations } = useQuery(
    ["stations", urlSearchParams.get("areaCode")],
    () =>
      getStationsGeoJson({
        limit: 25,
        state: [urlSearchParams.get("areaCode")!],
      }),
    { enabled: urlSearchParams.has("areaCode") }
  );
  const { t } = useTranslation("station");

  const onSubmit = (values: FormValues) => {
    setUrlSearchParams(
      values.areaCode ? { areaCode: values.areaCode } : undefined
    );
  };

  useEffect(() => {
    if (!urlSearchParams.has("areaCode")) {
      setUrlSearchParams(state ? { areaCode: state } : undefined);
    }
  }, [setUrlSearchParams, state, urlSearchParams]);

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      <Heading as="h1" px={8} size="lg">
        {t("stationsSection.heading")}
      </Heading>
      <Box px={6} py={4}>
        <StationsFilterForm
          defaultAreaCode={urlSearchParams.get("areaCode") ?? undefined}
          onSubmit={onSubmit}
        />
      </Box>
      {!!stations && (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>{t("stationsSection.nameTableHeader")}</Th>
                <Th>{t("stationsSection.idTableHeader")}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {stations?.features.map((station) => (
                <Tr key={station.properties.stationIdentifier}>
                  <Td>
                    <Link
                      as={RouterLink}
                      to={`/stations/${station.properties.stationIdentifier}`}
                    >
                      {station.properties.name}
                    </Link>
                  </Td>
                  <Td>{station.properties.stationIdentifier}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
