import axios from 'axios';

import { Squad } from './model';

async function importXWS(xws) {
  // We'll use XWS for all our internal reckoning
  return new Squad(xws);
}

async function importYASB(rawYasbUrl) {
  // The YASB serialization format relies on IDs only in YASB, so it's fragile to implement standalone
  // For our usage, we can use https://github.com/zacharyp/yasb-xws
  // If that's dead or bad, people can just export XWS from YASB
  const converterService = 'https://yasb2-xws.herokuapp.com';
  const yasbUrl = new URL(yasbUrl)
  const xws = await axios.get(`${converterService}${yasbUrl.search}`);
  return new Squad(xws);
}
