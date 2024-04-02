import React from "react";
import { render } from "@testing-library/react-native";
import Home from "./components/Home";

describe("Home", () => {
  test("renders correctly", () => {
    const { getByText } = render(<Home />);
    // Find the button element with innerHTML "="
    const buttonElement = getByText("=");

    // Assert that the button element with innerHTML "=" exists
    expect(buttonElement).toBeDefined();
  });
});
