import firebase from 'firebase/app';

import { Squad } from './model';

// 3KB max squad size
const MAX_SIZE = 3 * 1024;

function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
}

// Should be parsed by the time it gets here
function makeSquad(xwsObj) {
  if(!xwsObj) {
    throw Error('No squad data received');
  }

  if(JSON.stringify(xwsObj).length > MAX_SIZE) {
    throw Error(`Squad size cannot exceed ${MAX_SIZE} bytes`);
  }

  return new Squad(xwsObj);
}

export async function importXWS(xws) {
  // We'll use XWS for all our internal reckoning
  const parsed = parseJSON(xws);
  if(parsed) {
    return makeSquad(parsed);
  } else {
    throw new Error('Squad was not JSON');
  }
}

export async function importYASB(rawYasbUrl) {
  const importFn = firebase.functions().httpsCallable('importYASB');
  const xws = await importFn({ url: rawYasbUrl });
  return makeSquad(xws?.data);
}
