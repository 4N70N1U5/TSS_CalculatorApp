import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import Home from "../Home";

// https://jestjs.io/docs/tutorial-react-native

// # Functional Testing - rendering using snapshot

describe("Functional Testing Suite", () => {
  test("renders correctly", () => {
    const tree = renderer.create(<Home />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("AC Button works correctly", () => {
    const { getByTestId, getByText } = render(<Home />);
    const textInput = getByTestId("text-input");

    // update text input to have a number to check if it clears when pressing AC Button

    fireEvent.changeText(textInput, "4873789598275");

    // get AC Button element and fire clicking event

    const button = getByText("AC");
    fireEvent.press(button); // uncomment this line to see proper efect of test working

    // Now we have to check if the content of the text input is empty

    expect(textInput.props.value).toEqual('');

  });

  test("C Button works correctly", () => {

    // Same approach but different scenario - now the C Button should trim the last char 

    const { getByTestId, getByText } = render(<Home />);
    const textInput = getByTestId("text-input");

    fireEvent.changeText(textInput, "4873789598275");

    const button = getByText("C");
    fireEvent.press(button); // uncomment this line to see proper efect of test working

    expect(textInput.props.value).toEqual('487378959827');

  });
});
