#!/usr/bin/env node
const { lstatSync, readdirSync, readFileSync } = require('fs-extra');
const { basename, join, extname } = require('path');
const { get, map, set } = require('lodash');

const isDirectory = (source) => lstatSync(source).isDirectory();
const isJSONFile = (source) => {
  const stat = lstatSync(source);
  return stat.isFile() && /\.json$/i.test(source);
};

const getDirectories = (source) => readdirSync(source).filter((name) => isDirectory(join(source, name)));
const getJSONFiles = (source) => {
  const files = readdirSync(source).filter((name) => isJSONFile(join(source, name)));
  return files.map((name) => ({
    path: join(source, name),
    file: JSON.parse(readFileSync(join(source, name)).toString())
  }));
};
const dataPath = join(__dirname, '../xwing-data2/data');

//How much folder depth to respect (depends on how unique the "name" field, or the filenames in the tree where depth > 1)
const MAX_DEPTH = 1;

//Map of depth -> aliases
const WRITE_ALIASES = {
  0: {
    pilots: 'ships',
    'damage-decks': 'damage_decks'
  }
};

//Roll up all the JSON into one data structure
const rollup = (data, path = [], depth = 0) => {
  //Read from
  const fullPath = join(dataPath, ...path);
  //Write to
  const scope = map(path.slice(0, Math.min(path.length, MAX_DEPTH)), (val, index) => {
    return get(WRITE_ALIASES, [index, val], val);
  });

  //List all folders, turn them into keys
  const folders = getDirectories(fullPath);
  if (folders.length) {
    for (const folder of folders) {
      const newPath = [...path, folder];
      rollup(data, newPath, depth++);
    }
  } else {
    //Read all the JSON here and put it in stuff
    const jsonFiles = getJSONFiles(fullPath);
    if (jsonFiles.length === 1) {
      //Write the entire file as the folder key value
      set(data, scope, jsonFiles[0].file);
    } else {
      for (let { path, file } of jsonFiles) {
        const name = file.xws || file.name || basename(path, extname(path));

        // Flatten some things by XWS ID so we can use direct paths instead of having lists to index

        // Flatten ship-pilots
        if(Array.isArray(file.pilots)) {
          file.pilots = file.pilots.reduce((all, pilot) => {
            const key = pilot.xws || pilot.name;
            all[key] = pilot;
            return all;
          }, {})
        }

        // Flatten upgrades
        if(path.includes('/upgrades/') && Array.isArray(file)) {
          file = file.reduce((all, upgrade) => {
            const key = upgrade.xws || upgrade.name;
            all[key] = upgrade;
            return all;
          }, {})
        }

        set(data, [...scope, name], file);
      }
    }
  }

  return data;
};

const data = rollup({});
const { writeFileSync } = require('fs-extra');
writeFileSync('./src/data/xwing-data.json', JSON.stringify(data));
