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
import { getZonesGeoJson, ZoneType } from "@vavassor/nws-client";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useSearchParams } from "react-router-dom";

export const ZonesSection: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: zones } = useQuery(["zones"], () =>
    getZonesGeoJson({
      area: searchParams.getAll("area"),
      limit: 25,
      region: searchParams.getAll("region"),
      type: searchParams.getAll("type") as ZoneType[],
    })
  );
  const { t } = useTranslation("zone");

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      <Heading as="h1" px={8} size="lg">
        {t("zonesSection.heading")}
      </Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t("zonesSection.nameTableHeader")}</Th>
              <Th>{t("zonesSection.idTableHeader")}</Th>
              <Th>{t("zonesSection.typeTableHeader")}</Th>
              <Th>{t("zonesSection.stateTableHeader")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {zones?.features.map((zone) => (
              <Tr key={zone.properties.id}>
                <Td>
                  <Link
                    as={RouterLink}
                    to={`/zones/${zone.properties.type}/${zone.properties.id}`}
                  >
                    {zone.properties.name}
                  </Link>
                </Td>
                <Td>{zone.properties.id}</Td>
                <Td>{zone.properties.type}</Td>
                <Td>{zone.properties.state}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
