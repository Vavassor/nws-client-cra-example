import {
  Box,
  Button,
  Heading,
  Link,
  SkeletonText,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getStationsByUriGeoJson,
  getStationsGeoJson,
} from "@vavassor/nws-client";
import { useTranslation } from "react-i18next";
import { usePoint } from "../Forecast/usePoint";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { FormValues, StationsFilterForm } from "./StationsFilterForm";
import { Fragment, useEffect } from "react";

export const StationsSection = () => {
  const { state } = usePoint();
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const {
    data: stations,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    enabled: urlSearchParams.has("areaCode"),
    queryKey: ["stations", urlSearchParams.get("areaCode")],
    queryFn: ({ pageParam }) =>
      pageParam
        ? getStationsByUriGeoJson({ uri: pageParam })
        : getStationsGeoJson({
            limit: 25,
            state: urlSearchParams.getAll("areaCode")!,
          }),
    getNextPageParam: (lastPage, pages) => lastPage.pagination?.next,
  });
  const { t } = useTranslation("station");

  const onSubmit = (values: FormValues) => {
    setUrlSearchParams(
      values.areaCode ? { areaCode: values.areaCode } : undefined
    );
  };

  const handleClickLoadMore = () => {
    fetchNextPage();
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
      {!!state && (
        <Box px={6} py={4}>
          <StationsFilterForm
            defaultAreaCode={urlSearchParams.get("areaCode") ?? undefined}
            onSubmit={onSubmit}
          />
        </Box>
      )}
      {!!stations &&
      stations.pages.length > 0 &&
      stations.pages[0].features.length > 0 ? (
        <>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>{t("stationsSection.nameTableHeader")}</Th>
                  <Th>{t("stationsSection.idTableHeader")}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {stations?.pages.map((page, pageIndex) => (
                  <Fragment key={pageIndex}>
                    {page.features.map((station) => (
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
                  </Fragment>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <VStack px={6} py={8}>
            <Button
              alignSelf="stretch"
              disabled={!hasNextPage || isFetchingNextPage}
              onClick={handleClickLoadMore}
            >
              {t("stationsSection.loadMoreButtonLabel")}
            </Button>
            {isFetching && !isFetchingNextPage ? <Spinner /> : null}
          </VStack>
        </>
      ) : isLoading ? (
        <SkeletonText noOfLines={4} px={8} py={8} spacing="4" />
      ) : (
        <Text px={8} py={4}>
          {t("stationsSection.noStationsMessage")}
        </Text>
      )}
    </Box>
  );
};
