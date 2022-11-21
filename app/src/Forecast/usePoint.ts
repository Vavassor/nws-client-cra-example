import { useQuery } from "@tanstack/react-query";
import {
  getPointGeoJson,
  isRelativeLocationGeoJson,
} from "@vavassor/nws-client";
import { useMemo } from "react";
import { getCurrentPosition } from "../Common/getCurrentPosition";

export const usePoint = () => {
  const { data: position } = useQuery(["currentPosition"], () =>
    getCurrentPosition({ timeout: 5000 })
  );
  const {
    data: point,
    isError,
    isLoading,
  } = useQuery(
    ["point", position],
    () => {
      return getPointGeoJson({
        latitude: position!.coords.latitude,
        longitude: position!.coords.longitude,
      });
    },
    { enabled: !!position }
  );

  const relativeLocation = useMemo(() => {
    const relativeLocation = point?.properties.relativeLocation;
    return isRelativeLocationGeoJson(relativeLocation)
      ? relativeLocation.properties
      : relativeLocation;
  }, [point]);

  return {
    city: relativeLocation?.city,
    isError,
    isLoading,
    point,
    state: relativeLocation?.state,
  };
};
