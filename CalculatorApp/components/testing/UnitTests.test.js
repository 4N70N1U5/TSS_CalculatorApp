import React from "react";
import { Linking } from 'react-native';
import { render, fireEvent } from "@testing-library/react-native";
import Home from "../Home";
import About from "../About";
import AboutButton from "../AboutButton";

// https://jestjs.io/docs/tutorial-react-native

// # Functional Testing

const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockedNavigate })
}));

describe("Unit Testing Suite", () => {
  test("AC Button works correctly", async () => {
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

  test("C Button works correctly", async () => {
    // Same approach but different scenario - now the C Button should trim the last char 

    const { getByTestId, getByText } = render(<Home />);
    const textInput = getByTestId("text-input");

    fireEvent.changeText(textInput, "4873789598275");

    const button = getByText("C");
    fireEvent.press(button); // uncomment this line to see proper efect of test working

    expect(textInput.props.value).toEqual('487378959827');
  });

  test("Percent button works correctly", async () => {
    const { getByTestId, getByText } = render(<Home />);
    const textInput = getByTestId("text-input");

    fireEvent.changeText(textInput, "4873789598275");

    const button = getByText("%");
    fireEvent.press(button);

    expect(textInput.props.value).toEqual('48737895982.75')
  });

  test("Div button works correctly", async () => {
    const { getByTestId, getByText } = render(<Home />);
    const textInput = getByTestId("text-input");

    fireEvent.changeText(textInput, "123");

    const div = getByText("/");
    fireEvent.press(div);

    const two = getByText('2');
    fireEvent.press(two);

    const eq = getByText("=");
    fireEvent.press(eq);

    expect(textInput.props.value).toEqual('61.5')
  });

  test("Multiply button works correctly", async () => {
    const { getByTestId, getByText } = render(<Home />);
    const textInput = getByTestId("text-input");

    fireEvent.changeText(textInput, "61.5");

    const times = getByText("x");
    fireEvent.press(times);

    const two = getByText("2");
    fireEvent.press(two);

    const eq = getByText("=");
    fireEvent.press(eq);

    expect(textInput.props.value).toEqual('123')
  });

  test("Minus button works correctly", async () => {
    const { getByTestId, getByText } = render(<Home />);
    const textInput = getByTestId("text-input");

    fireEvent.changeText(textInput, "61.5");

    const minus = getByText("-");
    fireEvent.press(minus);

    const one = getByText("1");
    fireEvent.press(one);

    const eq = getByText("=");
    fireEvent.press(eq);

    expect(textInput.props.value).toEqual('60.5')
  });

  test("Plus button works correctly", async () => {
    const { getByTestId, getByText } = render(<Home />);
    const textInput = getByTestId("text-input");

    fireEvent.changeText(textInput, "61.5");

    const minus = getByText("+");
    fireEvent.press(minus);

    const three = getByText("3");
    fireEvent.press(three);

    const eq = getByText("=");
    fireEvent.press(eq);

    expect(textInput.props.value).toEqual('64.5')
  });

  test("Equals button works with last character / ", async () => {
    const { getByTestId, getByText } = render(<Home />);
    const textInput = getByTestId("text-input");

    fireEvent.changeText(textInput, "123/");

    const button = getByText("=");
    fireEvent.press(button);

    expect(textInput.props.value).toEqual('123')
  });

  test("Percent button works with last character / ", async () => {
    const { getByTestId, getByText } = render(<Home />);
    const textInput = getByTestId("text-input");

    fireEvent.changeText(textInput, "123/");

    const button = getByText("%");
    fireEvent.press(button);

    expect(textInput.props.value).toEqual('1.23')
  });

  test("Plus button works with last character / ", async () => {
    const { getByTestId, getByText } = render(<Home />);
    const textInput = getByTestId("text-input");

    fireEvent.changeText(textInput, "123/");

    const button = getByText("+");
    fireEvent.press(button);

    expect(textInput.props.value).toEqual('123+')
  });

  test("Number Buttons work correctly", async () => {
    const { getByTestId, getByText } = render(<Home />);
    const textInput = getByTestId("text-input");

    fireEvent.changeText(textInput, "");

    const one = getByText("1");
    fireEvent.press(one);
    expect(textInput.props.value).toEqual('1');

    const two = getByText("2");
    fireEvent.press(two);
    expect(textInput.props.value).toEqual('12');

    const three = getByText("3");
    fireEvent.press(three);
    expect(textInput.props.value).toEqual('123');

    fireEvent.changeText(textInput, "");

    const four = getByText("4");
    fireEvent.press(four);
    expect(textInput.props.value).toEqual('4');

    const five = getByText("5");
    fireEvent.press(five);
    expect(textInput.props.value).toEqual('45');

    const six = getByText("6");
    fireEvent.press(six);
    expect(textInput.props.value).toEqual('456');

    fireEvent.changeText(textInput, "");

    const seven = getByText("7");
    fireEvent.press(seven);
    expect(textInput.props.value).toEqual('7');

    const eight = getByText("8");
    fireEvent.press(eight);
    expect(textInput.props.value).toEqual('78');

    const nine = getByText("9");
    fireEvent.press(nine);
    expect(textInput.props.value).toEqual('789');

    const zero = getByText("0");
    fireEvent.press(zero);
    expect(textInput.props.value).toEqual('7890');

    const point = getByText(".");
    fireEvent.press(point);
    expect(textInput.props.value).toEqual('7890.');
  });

  test("Link opens correctly", async () => {
    const { getByText } = render(<About />);

    const link = getByText("github.com/zero7zero5/React-Native-Calculator-App");

    fireEvent.press(link);

    expect(Linking.openURL).toHaveBeenCalledWith("https://github.com/zero7zero5/React-Native-Calculator-App");
  });

  test("AboutButton navigates to About", async () => {
    const { getByText } = render(<AboutButton />);

    const button = getByText("About");

    fireEvent.press(button);

    expect(mockedNavigate).toHaveBeenCalledWith("About");
  });
});
