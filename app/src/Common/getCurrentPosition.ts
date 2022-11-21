export const getCurrentPosition = (options?: PositionOptions) => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        options
      );
    } else {
      reject(new Error("The Geolocation API is not supported."));
    }
  });
};
