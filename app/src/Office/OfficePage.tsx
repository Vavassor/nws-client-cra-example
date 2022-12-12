import { Container, Grid, GridItem } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { useQuery } from "@tanstack/react-query";
import { getOffice } from "@vavassor/nws-client";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDocumentTitle } from "../Common/useDocumentTitle";
import { OfficeHeadlinesSection } from "./OfficeHeadlinesSection";
import { OfficeLinksSection } from "./OfficeLinksSection";
import { OfficeSummarySection } from "./OfficeSummarySection";

export const OfficePage: FC = () => {
  const { officeId } = useParams();
  const { setDocumentTitle } = useDocumentTitle();
  const { t } = useTranslation("office");
  const { data: office } = useQuery(
    ["office", officeId],
    () => getOffice({ officeId: officeId! }),
    {
      enabled: !!officeId,
    }
  );

  useEffect(() => {
    if (office) {
      setDocumentTitle(t("officePage.pageTitle", { officeName: office.name }));
    }
  }, [office, setDocumentTitle, t]);

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <Grid
        gap={4}
        gridTemplateColumns="100%"
        maxWidth="100%"
        templateAreas={`"current"
          "summary"
          "news"
          "links"`}
      >
        <GridItem area="summary">
          <OfficeSummarySection officeId={officeId} />
        </GridItem>
        <GridItem area="news">
          <OfficeHeadlinesSection officeId={officeId} />
        </GridItem>
        <GridItem area="links">
          <OfficeLinksSection officeId={officeId} />
        </GridItem>
      </Grid>
    </Container>
  );
};
