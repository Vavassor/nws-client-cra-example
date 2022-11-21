import {
  Box,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@vavassor/nws-client";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

export const ProductsSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [endTime, setEndTime] = useState(dayjs().endOf("day").toISOString());
  const [startTime, setStartTime] = useState(
    dayjs().startOf("day").toISOString()
  );
  const { i18n, t } = useTranslation("product");

  const { data: products } = useQuery(["products"], () =>
    getProducts({
      end: endTime,
      limit: 25,
      location: searchParams.getAll("location"),
      office: searchParams.getAll("office"),
      start: startTime,
    })
  );

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      <Heading as="h1" px={8} size="lg">
        {t("productsSection.heading")}
      </Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t("productsSection.nameTableHeader")}</Th>
              <Th>{t("productsSection.timeTableHeader")}</Th>
              <Th>{t("productsSection.officeTableHeader")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products?.["@graph"].map((product) => (
              <Tr key={product.id}>
                <Td maxWidth="150px">
                  <Link to={`/products/${product.id}`}>
                    <Text
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {product.productName}
                    </Text>
                  </Link>
                </Td>
                <Td>
                  {new Intl.DateTimeFormat(i18n.language, {
                    timeStyle: "short",
                  }).format(new Date(product.issuanceTime))}
                </Td>
                <Td>{product.issuingOffice}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
