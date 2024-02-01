> [!WARNING]
> This package is deprecated. The content is moved to the [@teamleader/ahoy](https://www.npmjs.com/package/@teamleader/ahoy) package. 
> The further development of the project will be closed-source but the package will be published under the new name.

# Teamleader UI Illustrations

Illustrations used in the Teamleader application(s), both as SVG and matching React-based implementation.

## Installation

Teamleader's illustrations package is [available on npm](https://www.npmjs.com/package/@teamleader/ui-illustrations).

```sh
$ npm install --save @teamleader/ui-illustrations
```

or

```bash
$ yarn install @teamleader/ui-illustrations
```

If you're already using [teamleader-ui](https://www.npmjs.com/package/teamleader-ui) in your application, you can access the illustrations using the sub-repo notation `'@teamleader-ui/illustrations'`.

## Usage

```jsx
import React from 'react';
import { render } from 'react-dom';
import { IllustrationEmptyStateMeetings120x120Static } from '@teamleader/ui-illustrations';

const App = () => {
  return (
    <IllustrationEmptyStateMeetings120x120Static />
  );
}

render(<App />, document.querySelector('#app'));
```

## Development

### Prerequisites
- node `^12.0.0`
- npm `^6.9.0`

### Getting started
Clone this repo

```sh
$ git clone https://github.com/teamleadercrm/ui-illustrations.git
```

Add your newly designed SVG files to the `/illustrations` folder. Make sure they are named properly using the `dimensions_name_variant.svg` syntax, eg: `120x120_empty_state_meeting_static.svg` or `240x240_task_list_dynamic.svg`.


Don't forget to transform your newly added SVGs to React components by running

```sh
$ npm run build
```

If you are satisfied with your updates, make sure to bump the version number in the `package.json` file and publish it for others to use by running

```sh
$ npm publish --access=public
```
