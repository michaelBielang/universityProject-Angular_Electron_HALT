# tsconfig.json testing
"sourceRoot": "/",
"outDir": "../../dist/api",
"module": "amd",
"removeComments": true,
"inlineSources": true,
"inlineSourceMap": true,
"declaration": false,
"experimentalDecorators": true,
"noResolve": false
"strict": true,



"pretty": true,
"inlineSources": true,
"inlineSourceMap": true



"include": [
  "./**/*.ts",
  "./datastorage/**/*.js"
],


, {
  test: /\.m?js$/,
  loader: 'babel-loader'
}
