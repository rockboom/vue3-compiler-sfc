const {
    parse,
    compileTemplate,
    compileScript,
    compileStyle,
} = require('@vue/compiler-sfc');
const rootContext = process.cwd();
const hash = require('hash-sum');
const path = require('path');
const fs = require('fs-extra');
const styleInjectFn = `\n${function styleInject(css, ref) {
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
}}`

const compiler = (compilerOptions = {}) => {
    let {
        input,
        output
    } = compilerOptions;
    let file = fs.readFileSync(input).toString();
    const shortFilePath = path
        .relative(rootContext, input)
        .replace(/^(\.\.[\/\\])+/, '')
        .replace(/\\/g, '/');
    const scopeId = hash(shortFilePath + '\n' + file);
    
    let options = {
        filename: input,
        source: '',
        id: scopeId,
        inlineTemplate: true,
        isProd: false,
        templateOptions: {
            compiler: undefined,
            compilerOptions: {
                scopeId: scopeId,
                bindingMetadata: undefined,
            },
            filename: input,
            id: scopeId,
            isProd: false,
            scoped: true,
            preprocessCustomRequire: undefined,
            preprocessLang: undefined,
            preprocessOptions: undefined,
            ssr: false,
            ssrCssVars: [],
            transformAssetUrls: undefined
        }
    }
    
    let {
        descriptor,
        errors
    } = parse(file);
    options.source = descriptor.template.content;
    let template = compileTemplate(options);
    let templateCode = template.code;
    templateCode = templateCode.replace('export', '');

    options.source = descriptor.script.content;
    let script = compileScript(descriptor, options);
    let scriptCode = script.content;
    scriptCode = scriptCode.replace(/export\s*default/, 'const script = ');
    scriptCode += styleInjectFn;
    descriptor.styles.forEach((style, index) => {
        options.source = style.content;
        let styles = compileStyle(options);
        let styleCode = styles.code.replace(/\n/g, '\\n');
        let cssVar = `css$${index}`;
        let cssStr = `\nlet ${cssVar}  = "${styleCode}"`;
        let cssExpression = `\nstyleInject(${cssVar})`;
        scriptCode += cssStr;
        scriptCode += cssExpression;
    })
    scriptCode += '\nscript.render = render;';
    scriptCode += `\nscript.__scopeId = "data-v-${scopeId}"`
    scriptCode += `\nscript._file = "${shortFilePath}"`;
    scriptCode += '\nexport default script;';

    let code = templateCode + scriptCode;
    if (!fs.existsSync(output)) {
        fs.createFileSync(output);
    }
    fs.writeFileSync(output,code);
}
module.exports = compiler