import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import Home from "../Home";
import Button from "../Button";
import TextBox from "../TextBox";

describe("UI Testing Suite", () => {
  test("Text box renders correctly", () => {
    const tree = renderer.create(<TextBox />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Buttons render correctly", () => {
    const tree = renderer.create(<Button />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Home screen renders correctly", () => {
    const tree = renderer.create(<Home />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
