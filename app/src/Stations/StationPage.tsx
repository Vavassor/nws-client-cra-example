import { Container, Grid, GridItem } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { RecentObservationsSection } from "./RecentObservationsSection";
import { StationSection } from "./StationSection";

export const StationPage: FC = () => {
  const { stationId } = useParams();

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <Grid
        gap={4}
        gridTemplateColumns="100%"
        maxWidth="100%"
        templateAreas={`"summary"
          "observations"`}
      >
        <GridItem area="summary">
          <StationSection stationId={stationId} />
        </GridItem>
        <GridItem area="observations">
          <RecentObservationsSection stationId={stationId} />
        </GridItem>
      </Grid>
    </Container>
  );
};
