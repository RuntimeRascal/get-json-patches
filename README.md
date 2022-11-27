<h1 align="center">
  Get JSON Patches
  <br>
</h1>

<h4 align="center">Get a collection of json patches from comparing two objects.</h4>  


<div align="center">

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/RuntimeRascal/get-json-patches/Build%20Dist%20&%20Release?label=Build%20Dist%20%26%20Release&logo=github&style=for-the-badge) ![npm](https://img.shields.io/npm/v/get-json-patches?logo=npm&style=for-the-badge)  

 ![Statements](https://img.shields.io/badge/statements-96.15%25-brightgreen.svg?style=for-the-badge&logo=jest) ![Branches](https://img.shields.io/badge/branches-94.28%25-brightgreen.svg?style=for-the-badge&logo=jest) ![Functions](https://img.shields.io/badge/functions-100%25-brightgreen.svg?style=for-the-badge&logo=jest) ![Lines](https://img.shields.io/badge/lines-100%25-brightgreen.svg?style=for-the-badge&logo=jest)  

 ![npm bundle size](https://img.shields.io/bundlephobia/min/get-json-patches?style=for-the-badge) ![GitHub](https://img.shields.io/github/license/RuntimeRascal/get-json-patches?style=for-the-badge)

</div>

> Package ships both CommonJs `.cjs` for use with `require` and EsModule `.mjs` for use with `import`.

## Install

```js
npm install get-json-patches
```

## How To Use

```js
import getJsonPatches from 'get-json-patches';

const obj1 = { s: 'string', n: 345.21, b: true, o: {s: 'string'}, a: [1,2,3]}
const obj2 = { s: 'string', n: 345.64, b: false, o: {s: 'new'}, a: [1,2], aNew: 'new prop'}

const patches = getJsonPatches(obj1, obj2);
/*
patches =
[
    {"op":"replace","path":"/n","value":345.64},
    {"op":"replace","path":"/b","value":false},
    {"op":"replace","path":"/o/s","value":"new"},
    {"op":"replace","path":"/a","value":[1,2]},
    {"op":"add","path":"/aNew","value":"new prop"}
]
*/
```
> For additional use case scenarios you can look over the [unit tests](https://github.com/RuntimeRascal/get-json-patches/blob/UpdateReadme/src/getJsonPatches.test.ts).  

## Motivation
I needed a simple way to generate a list of patch objects from comparing 2 javascript objects. Preferably to use in the browser on the client machine to prevent having to send a complete json object to a server for comparison and then to a db or api to apply partial updates. There are many javascript libraries that implement json patch, many of which are listed at [jsonpatch.com](https://jsonpatch.com/#javascript). Some existing libraries offer a diff function to construct collection of patch objects but this seams like a additional after thought to many libs and therefore they are large libs that implement all parts of the json patch spec. Many API's including Azure Cosmos Db expect a json patch and can implement partial updates. This lib just does object comparison and patch creation.

## TODO List
- [X] Implement replace primitives
- [X] Implement replace objects
- [X] Implement replace arrays
- [X] Implement add object
- [X] Implement add arrays
- [ ] Add RFC spec path substitutes
- [ ] Implement remove in array
- [ ] Implement append to array with `-` in path
- > Currently the array functionality will just replace entire array if array lengths differ and will only iterate array when lengths are the same.
- [ ] [rfc6901](https://datatracker.ietf.org/doc/html/rfc6901/) pointer should be `''` rather then `'/'` to point at root
