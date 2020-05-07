import React from "react";
import { render } from "@testing-library/react";
import Episodes from "../components/Episodes";
import { formatSeasons } from '../utils/formatSeasons';
import { mockData } from './mockData';

const formattedSeasons = formatSeasons(mockData._embedded.episodes);

test("Episode list renders correctly with no episodes", () => {
  const { queryAllByTestId } = render(
    <Episodes episodes={[]} />
  );

  expect(queryAllByTestId("episode")).toStrictEqual([]);
  expect(queryAllByTestId("episode")).toHaveLength(0);
});

test("Episode list renders correctly with episodes", () => {

  const { queryAllByTestId, queryAllByText } = render(
    <Episodes episodes={formattedSeasons['Season 1']} />
  );

  expect(queryAllByTestId("episode")).toHaveLength(8);
  expect(queryAllByText(/chapter/i)).toHaveLength(8);
  expect(queryAllByText(/60 minutes/i)).toHaveLength(8);
});
