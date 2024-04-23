import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import renderer from "react-test-renderer";
import Home from "../Home";
import Button from "../Button";
import TextBox from "../TextBox";
import About from "../About";

describe("UI Testing Suite", () => {
  test("Text box component matches snapshot", () => {
    const tree = renderer.create(<TextBox> 1234 </TextBox>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Button component matches snapshot", () => {
    const tree = renderer.create(<Button />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Home screen matches snapshot", () => {
    const tree = renderer.create(<Home />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("Home screen renders everything", () => {
    const { getByText, getByTestId } = render(<Home />);

    const textBox = getByTestId("text-input");
    expect(textBox).toBeDefined();

    const clearButton = getByText("C");
    expect(clearButton).toBeDefined();

    const ACButton = getByText("AC");
    expect(ACButton).toBeDefined();

    const percentageButton = getByText("%");
    expect(percentageButton).toBeDefined();

    const divideButton = getByText("/");
    expect(divideButton).toBeDefined();

    const multiplyButton = getByText("x");
    expect(multiplyButton).toBeDefined();

    const subtractButton = getByText("-");
    expect(subtractButton).toBeDefined();

    const addButton = getByText("+");
    expect(addButton).toBeDefined();

    const equalsButton = getByText("=");
    expect(equalsButton).toBeDefined();

    const decimalButton = getByText(".");
    expect(decimalButton).toBeDefined();

    const zeroButton = getByText("0");
    expect(zeroButton).toBeDefined();

    const oneButton = getByText("1");
    expect(oneButton).toBeDefined();

    const twoButton = getByText("2");
    expect(twoButton).toBeDefined();

    const threeButton = getByText("3");
    expect(threeButton).toBeDefined();

    const fourButton = getByText("4");
    expect(fourButton).toBeDefined();

    const fiveButton = getByText("5");
    expect(fiveButton).toBeDefined();

    const sixButton = getByText("6");
    expect(sixButton).toBeDefined();

    const sevenButton = getByText("7");
    expect(sevenButton).toBeDefined();

    const eightButton = getByText("8");
    expect(eightButton).toBeDefined();

    const nineButton = getByText("9");
    expect(nineButton).toBeDefined();

    fireEvent.press(oneButton);
    fireEvent.press(twoButton);
    fireEvent.press(threeButton);
    fireEvent.press(fourButton);

    expect(textBox.props.value).toEqual("1234");
  });

  test("About screen matches snapshot", () => {
    const tree = renderer.create(<About />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
