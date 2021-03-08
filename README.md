# vue3-compiler-sfc
This is an simple compiler to transform code in an `.vue` file into es6 code. 

## install
```
npm install vue3-simple-compiler-sfc
```
## usage
It's very easy to use it.
```js
const compiler = require('vue3-simple-compiler-sfc');
const path = require('path');
compiler({
    input: path.resolve(__dirname, 'Hello.vue'),
    output: path.resolve(__dirname, '../examples/hello.vue.js'),
})
```
For now, It can only compile the following `.vue` file.
```js
<template>
    <div id="hello-vue" class="demo">
        {{ message }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: 'Hello Vue!!',
        }
    },
}
</script>

<style>
#hello-vue{
    color: red;
    background-color: aqua;
    color: 24px;
}
</style>
```
Above code will be compile into the following:
```js
import { toDisplayString as _toDisplayString, createVNode as _createVNode, openBlock as _openBlock, createBlock as _createBlock } from "vue"

const _hoisted_1 = {
  id: "hello-vue",
  class: "demo"
}

 function render(_ctx, _cache) {
  return (_openBlock(), _createBlock("div", _hoisted_1, _toDisplayString(_ctx.message), 1 /* TEXT */))
}
const script =  {
    data() {
        return {
            message: 'Hello Vue!!',
        }
    },
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}
let css$0  = "\n#hello-vue{\n    color: red;\n    background-color: aqua;\n    color: 24px;\n}\n"
styleInject(css$0)
script.render = render;
script.__scopeId = "data-v-bf2701b2"
script._file = "examples/Hello.vue"
export default script;
```

## TODO
- support `scoped`、`lang` attributes of style tag.