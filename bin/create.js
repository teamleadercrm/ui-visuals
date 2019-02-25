const path = require('path');
const Promise = require('bluebird');
const cheerio = require('cheerio');
const camelCase = require('lodash.camelcase');
const upperFirst = require('lodash.upperfirst');
const fs = Promise.promisifyAll(require('fs-extra'));
const { globAsync } = Promise.promisifyAll(require('glob'));
const svgToJsx = require('@balajmarius/svg2jsx');
const clc = require('cli-color');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const ILLUSTRATIONS_DIR = path.join(ROOT_DIR, 'illustrations');
const LIB_DIR = path.join(ROOT_DIR, 'lib');

const readFile = filename => fs.readFileSync(filename, 'utf8');
const writeFile = (filename, data) => fs.outputFileSync(filename, data);
const copyFile = (source, destination) => fs.copySync(source, destination);

const transformSVGToReactComponent = Promise.coroutine(function*(rawSVG, componentName, width, height) {
  const transformedSVG = yield svgToJsx(rawSVG);

  // Cleaning up; we only need the content *between* the <svg> tags
  const $ = cheerio.load(transformedSVG, { xmlMode: true });
  const $svg = $('svg');
  const viewBox = $svg.attr('viewBox');

  // Actual output of the React component
  return `
            import React from 'react';
            import Illustration from './IllustrationBase';
            
            const ${componentName} = props => (
              <Illustration viewBox="${viewBox}" width="${width}" height="${height}" {...props}>
                ${$svg.html()}
              </Illustration>
            );
            
            export default ${componentName};`;
});

const generateSVGs = Promise.coroutine(function*() {
  const illustrationsToProcess = yield globAsync(`${ILLUSTRATIONS_DIR}/*`);
  const illustrations = illustrationsToProcess.map(folder => path.basename(folder));
  let index = '';

  yield Promise.all(
    illustrations.map(
      Promise.coroutine(function*(fileName) {
        const dimension = fileName.split('_')[0];
        const width = parseInt(dimension.split('x')[0]);
        const height = parseInt(dimension.split('x')[1]);

        // Remove '.svg' and the size (eg.: 14x14) from the fileName
        const fileNameWithoutDimension = path.basename(fileName.substring(fileName.indexOf('_') + 1), '.svg');
        const variation = fileNameWithoutDimension.split('_').pop();
        const illustrationName = fileNameWithoutDimension.substring(0, fileNameWithoutDimension.lastIndexOf('_'));
        const illustrationNameWithSize = `illustration_${illustrationName}_${dimension}_${variation}`;
        const componentName = upperFirst(camelCase(`${illustrationNameWithSize}`));

        const rawSVG = readFile(`${ILLUSTRATIONS_DIR}/${fileName}`);
        const stringifiedSVGComponent = yield transformSVGToReactComponent(rawSVG, componentName, width, height);

        // Write the newly created Component strings to file
        const filename = path.join(LIB_DIR, `${componentName}.js`);
        writeFile(filename, stringifiedSVGComponent);

        // Write a simple export index file for easier access
        index += `export ${componentName} from './${componentName}';\n`;
      }),
    ),
  );

  const indexFilename = path.join(LIB_DIR, `index.js`);
  writeFile(indexFilename, index);

  // Copy other necessary files to LIB_DIR
  copyFile(SRC_DIR, LIB_DIR);

  console.log(clc.green(`[Teamleader] 🎉  ${illustrations.length} UI Illustrations generated`));
});

fs.remove(LIB_DIR).then(generateSVGs);
