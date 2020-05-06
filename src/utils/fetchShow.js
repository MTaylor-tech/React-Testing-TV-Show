import axios from 'axios';
import {formatSeasons} from './formatSeasons';

export const fetchShow = () => {
  return axios
    .get(
      "https://api.tvmaze.com/singlesearch/shows?q=stranger-things&embed=episodes"
    )
    .then(res => {
      return ({
        show: res.data,
        seasons: formatSeasons(res.data._embedded.episodes)
      });
    });
};
