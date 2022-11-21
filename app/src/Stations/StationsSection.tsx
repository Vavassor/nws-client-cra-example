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
import { Link as RouterLink } from "react-router-dom";

export const StationsSection = () => {
  const { state } = usePoint();
  const { data: stations } = useQuery(
    ["stations"],
    () =>
      getStationsGeoJson({
        limit: 25,
        state: [state!],
      }),
    { enabled: !!state }
  );
  const { t } = useTranslation("station");

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      <Heading as="h1" px={8} size="lg">
        {t("stationsSection.heading")}
      </Heading>
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
