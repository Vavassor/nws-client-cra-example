export const getCurrentPosition = (options?: PositionOptions) =>
  Promise.resolve({
    coords: {
      accuracy: 1,
      altitude: null,
      altitudeAccuracy: null,
      heading: NaN,
      latitude: 37.5247764,
      longitude: -77.5633017,
      speed: 0,
    },
    timestamp: Date.now(),
  });
