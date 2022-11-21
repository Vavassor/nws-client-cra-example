import { Container } from "@chakra-ui/react";
import { SkipNavContent } from "@chakra-ui/skip-nav";
import { FC } from "react";
import { useParams } from "react-router-dom";
import { RadarStationSection } from "./RadarStationSection";

export const RadarStationPage: FC = () => {
  const { stationId } = useParams();

  return (
    <Container as="main" maxW="container.sm" pt={4}>
      <SkipNavContent />
      <RadarStationSection stationId={stationId} />
    </Container>
  );
};
