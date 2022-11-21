import { describe, expect, jest, test } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react";
import { wrapper } from "../Common/TestUtilities";
import { pointGeoJson } from "../Data/pointMocks";
import * as nwsClient from "@vavassor/nws-client";
import { usePoint } from "./usePoint";

jest.mock("../Common/getCurrentPosition");

jest.mock("@vavassor/nws-client", () => {
  const { jest } = require("@jest/globals");
  return {
    __esModule: true,
    ...jest.requireActual("@vavassor/nws-client"),
    getPointGeoJson: jest.fn(),
  };
});

export const mockedNwsClient = nwsClient as jest.Mocked<typeof nwsClient>;

describe("usePoint", () => {
  test("gets a point", async () => {
    mockedNwsClient.getPointGeoJson.mockResolvedValue(pointGeoJson);
    const { result } = renderHook(() => usePoint(), { wrapper });
    await waitFor(() => expect(result.current.point).toBeDefined());
    expect(result.current.isError).toBeFalsy();
    expect(result.current.city).toBe("Bon Air");
    expect(result.current.state).toBe("VA");
    expect(result.current.point?.properties.gridId).toBe("AKQ");
    expect(result.current.point?.properties.gridX).toBe(40);
    expect(result.current.point?.properties.gridY).toBe(74);
  });

  test("returns an error when the request fails", async () => {
    mockedNwsClient.getPointGeoJson.mockRejectedValue({
      message: "test rejection",
      status: 503,
      statusText: "Service Unavailable",
    });
    const { result } = renderHook(() => usePoint(), { wrapper });
    await waitFor(() => expect(result.current.isError).toBeTruthy());
    expect(result.current.point).toBeUndefined();
  });
});
