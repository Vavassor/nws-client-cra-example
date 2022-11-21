import {
  Box,
  Button,
  Container,
  Heading,
  Hide,
  HStack,
  Link,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { SkipNavLink } from "@chakra-ui/skip-nav";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink, Outlet } from "react-router-dom";

export const MainLayout: FC = () => {
  const { getDisclosureProps, getButtonProps } = useDisclosure();
  const shouldShowMenu = useBreakpointValue({ base: true, lg: false });
  const { t } = useTranslation();

  const buttonProps = getButtonProps();
  const disclosureProps = getDisclosureProps();

  return (
    <>
      <SkipNavLink>{t("mainHeader.skipLinkLabel")}</SkipNavLink>
      <Box
        as="header"
        backgroundColor="white"
        borderBottomWidth={1}
        paddingX={6}
        paddingY={3}
      >
        <Container maxW="container.xl">
          <Stack
            alignItems={{ lg: "center" }}
            direction={{ base: "column", lg: "row" }}
          >
            <HStack justifyContent="space-between">
              <Heading as="h2" fontSize="xl" me={4}>
                {t("mainHeader.appName")}
              </Heading>

              <Hide above="lg">
                <Button {...buttonProps}>
                  {t("mainHeader.menuButtonLabel")}
                </Button>
              </Hide>
            </HStack>

            <nav {...(shouldShowMenu ? disclosureProps : {})}>
              <Link as={RouterLink} to="/">
                {t("mainNavigation.todaysWeatherLink")}
              </Link>
              <Link as={RouterLink} ms={4} to="/hourly">
                {t("mainNavigation.hourlyWeatherLink")}
              </Link>
              <Link as={RouterLink} ms={4} to="/products">
                {t("mainNavigation.productsLink")}
              </Link>
              <Link as={RouterLink} ms={4} to="/stations">
                {t("mainNavigation.stationsLink")}
              </Link>
              <Link as={RouterLink} ms={4} to="/zones">
                {t("mainNavigation.zonesLink")}
              </Link>
              <Link as={RouterLink} ms={4} to="/glossary">
                {t("mainNavigation.glossaryLink")}
              </Link>
            </nav>
          </Stack>
        </Container>
      </Box>
      <Outlet />
    </>
  );
};
