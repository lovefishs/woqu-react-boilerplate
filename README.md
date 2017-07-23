# woqu-react-boilerplate

WoQu's React App Boilerplate

## Features

* 多入口页面支持
* JSX 语法支持
* ES6 语法支持
* PostCSS 支持
* 区分开发环境和生产环境
* 开发环境支持浏览器源码调试
* 提取 manifest
* 分离 vendor(第三方依赖包) 与 common(应用公共代码)
* HMR(Hot Module Replacement)组件级热更新(可选)
* CSS Module支持(通过 css 文件名规则区分)
* 生产环境分离 CSS 样式文件
* HTML 模板编译支持
* 文件 MD5 戳支持
* 可以使用 [q-lint-js](https://github.com/lovefishs/q-lint-js) 进行代码规则校验
* 图片、字体资源管理
* gzip([compression-webpack-plugin](https://github.com/webpack-contrib/compression-webpack-plugin))
* 支持基于 [React Intl](https://github.com/yahoo/react-intl) 的国际化解决方案

## Instanll

```bash
git clone https://github.com/lovefishs/woqu-react-boilerplate.git
cd woqu-react-boilerplate
npm install
```

## Usage

### Dev

```bash
npm run dev

# or enable HMR
npm run dev:hmr
```

### Build

```bash
npm run build

# or uncompressed
npm run build:source
```

### Lint

```bash
npm run lint-js
```

## TODO

* [ ] 页面路由
* [ ] 模块懒加载策略
* [ ] 应用状态管理
* [ ] 单元测试
* [ ] E2E 测试
