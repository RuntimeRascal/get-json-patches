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

## Install

```js
npm intall get-json-patches
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



## TODO List
- [X] Implement replace primitives
- [X] Implement replace objects
- [X] Implement replace arrays
- [X] Implement add object
- [X] Implement add arrays
- [ ] Add RFC spec path substitues
- [ ] Implement remove in array
- [ ] Implement append to array with `-` in path
- [ ] [rfc6901](https://datatracker.ietf.org/doc/html/rfc6901/) pointer should be `''` rather then `'/'` to point at root