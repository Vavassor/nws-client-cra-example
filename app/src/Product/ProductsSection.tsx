import {
  Box,
  Heading,
  Link,
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
import { getProducts, getProductTypes } from "@vavassor/nws-client";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { FormValues, ProductFiltersForm } from "./ProductFiltersForm";

export const ProductsSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [endTime, setEndTime] = useState(dayjs().endOf("day").toISOString());
  const [startTime, setStartTime] = useState(
    dayjs().startOf("day").toISOString()
  );
  const { i18n, t } = useTranslation("product");

  const { data: products } = useQuery(
    ["products", searchParams.get("type")],
    () =>
      getProducts({
        end: endTime,
        limit: 25,
        location: searchParams.getAll("location"),
        office: searchParams.getAll("office"),
        start: startTime,
        type: searchParams.getAll("type"),
      })
  );

  const { data: productTypes } = useQuery(
    ["productTypes", searchParams.get("type")],
    () => getProductTypes()
  );

  const handleSubmit = (values: FormValues) => {
    setSearchParams({
      end: values.endDate,
      start: values.startDate,
      type: values.type,
    });
  };

  return (
    <Box as="section" borderRadius="lg" borderWidth="1px" py={4}>
      <Heading as="h1" px={8} size="lg">
        {t("productsSection.heading")}
      </Heading>
      {!!productTypes && (
        <Box px={6} py={4}>
          <ProductFiltersForm
            defaultType={searchParams.get("type") ?? undefined}
            onSubmit={handleSubmit}
            productTypes={productTypes}
          />
        </Box>
      )}
      {!!products && products?.["@graph"].length > 0 ? (
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
                    <Link as={RouterLink} to={`/products/${product.id}`}>
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
      ) : (
        <Text px={8} py={4}>
          {t("productsSection.noResultsMessage")}
        </Text>
      )}
    </Box>
  );
};
