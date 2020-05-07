import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import App from "../App";
import { fetchShow as mockFetchShow } from "../api/fetchShow";
import { mockData } from './mockData';

jest.mock("../api/fetchShow");

jest.mock('react-dropdown', () => ( props ) => {
  return(
      <select data-testid="select" value={props.value} onChange={props.onChange}>
        <option key={props.placeholder} value={props.placeholder}>{props.placeholder}</option>
        {props.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
  );
});

test('App renders correctly before fetching data', ()=>{
  mockFetchShow.mockResolvedValueOnce(mockData);
  const { getByText } = render(<App />);
  getByText(/fetching data/i); //this is the placeholder text before the api call resolves
});

test("App fetches data and renders properly", async () => {
  mockFetchShow.mockResolvedValueOnce(mockData);
  const { queryAllByText, getByText, getByTestId } = render(<App />);
  await wait();
  expect(queryAllByText(/stranger things/i)).toHaveLength(2); //"Stranger Things" appears 2x in the sample data
  expect(queryAllByText(/fetching data/i)).toHaveLength(0); //"Fetching data" should not appear after the api call resolves
  expect(getByText(/select a season/i)).toBeInTheDocument(); //Select placeholder is "Select a season"
  fireEvent.change(getByTestId("select"), {
    target: { value: "Season 1" },
  });
  expect(getByText(/season 1/i)).toBeInTheDocument(); //Once Season 1 is selected, the value should be "Season 1"
});
