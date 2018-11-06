# z-md 项目相关配置和介绍

## 项目介绍

项目是单页面应用(SPA), 前端框架依赖的是[vue.js](https://cn.vuejs.org/v2/guide/), 路由使用[vue-router](https://router.vuejs.org/zh-cn/), 状态模块使用[vuex](https://vuex.vuejs.org/zh-cn/)

## 项目启动

### 安装项目依赖
``` bash
npm --registry=https://registry.npm.taobao.org install

```
### 开发阶段
安装好依赖的情况下，直接运行一下命令，默认访问地址http://localhost:8080/
* 如端口有冲突，可在config文件夹index.js文件中修改端口
* 如修改代理接口地址，可在config文件夹proxy.js文件中修改代理接口地址

```bash
npm run dev
```

### 上线阶段
运行以下命令生成dist文件夹，将dist文件中的文件部署服务器, 如文件路径出现问题，可以修改可在config文件夹index.js配置项中修改打包后的文件夹名称及文件路径。

```bash
npm run build
```

### 打包项目并查看包分析器报告
```
npm run build --report

```
