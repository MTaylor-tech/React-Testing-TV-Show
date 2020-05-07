import React, {useState} from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import App from "../App";
import { fetchShow as mockFetchShow } from "../api/fetchShow";
import { formatSeasons } from '../utils/formatSeasons';
import { mockData } from './mockData';
import Dropdown from 'react-dropdown';

jest.mock("../api/fetchShow");

jest.mock("react-dropdown", () => ({ options, value, onChange }) => {
  function handleChange(event) {
    const option = options.find(
      (option) => option.value === event.currentTarget.value
    );
    onChange(option);
  }
  return (
    <select data-testid="select" value={value} onChange={handleChange}>
      {options.map(({ label, value }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
});

const formattedSeasons = formatSeasons(mockData._embedded.episodes);

test('App renders correctly before fetching data', ()=>{
  mockFetchShow.mockResolvedValueOnce(mockData);
  const { getByText } = render(<App />);

  getByText(/fetching data/i);
});

test("App fetches data and renders properly", async () => {
  mockFetchShow.mockResolvedValueOnce(mockData);

  const { queryAllByText } = render(<App />);

  await wait();

  expect(queryAllByText(/stranger things/i)).toHaveLength(2);
  expect(queryAllByText(/fetching data/i)).toHaveLength(0);
});


test("Test with mock", () => {
  let selectedSeason = "";

  const {getByText, getByTestId} = render(
    <Dropdown
      options={Object.keys(formattedSeasons)}
      onChange={e => {
        selectedSeason = e.value;
        console.log(selectedSeason);
      }}
      value={selectedSeason || "Select a season"}
      placeholder="Select an option"
      data-testid="dropdown"
    />
  );
  expect(getByText(/select a season/i)).toBeInTheDocument();
  fireEvent.change(getByTestId("select"), {
    target: { value: "Season 1" },
  });
  expect(getByText(/season 1/i)).toBeInTheDocument();
});
