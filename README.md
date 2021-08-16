# webpack-federation-module-id-plugin

## Installation

`npm i --save-dev webpack-federation-module-id-plugin`

`yarn add --dev webpack-federation-module-id-plugin`

## Usage

```javascript
const FederationModuleIdPlugin = require("webpack-federation-module-id-plugin");

module.exports = {
  plugins: [
    new FederationModuleIdPlugin(),
  ],
};
```

## Docs

This plugin will change the module id of all the federation modules.
The new id will be in the following form: webpack/container/remote/appName/moduleName
