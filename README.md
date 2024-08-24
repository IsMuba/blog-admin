<p align="center">
    <img width="200px" src="https://s21.ax1x.com/2024/07/16/pkIr1Bj.jpg" style="border-radius:50%;" />
</p>

<p align="center">
  大家好，我是沐爸。给个 Star 鼓励一下吧！
</p>
</p>

<p align="center">
  <a href="https://gitee.com/ismuba/projects">
    <img height="30px" src="https://s21.ax1x.com/2024/07/16/pkIsWiq.png" />
  </a>
  <a href="https://www.zhihu.com/people/mu-ba-38-69">
    <img height="30px" src="https://s21.ax1x.com/2024/07/16/pkIsUII.jpg" />
  </a>
  <a href="https://blog.csdn.net/m0_37943716">
    <img height="30px" src="https://s21.ax1x.com/2024/07/16/pkIsGse.jpg" />
  </a>
</p>

## 项目介绍

博客管理系统后台，框架采用 Vue3 + Vue-Router + Vuex + Element-Plus + Axios，是一个功能相对完整的博客后台系统。欢迎大家在此基础上进行二次开发，快速打造一个属于自己的博客网站。当然不仅仅是开发博客，开发其他后台应用也可以以此为模板。如果有好的想法或建议，欢迎在 issue 中提出。

## 开源地址

- 博客服务端：[github](https://github.com/ismuba/blog-express.git)、[gitee](https://gitee.com/ismuba/blog-express.git)
- 博客前台：[github](https://github.com/ismuba/blog-web.git)、[gitee](https://gitee.com/ismuba/blog-web.git)
- 效果预览：[沐爸的官方网站](http://blog.muba888.cn/#/home)
- 接口地址：[https://doc.apipost.net/docs/detail/2e6803128c64000?target_id=0](https://doc.apipost.net/docs/detail/2e6803128c64000?target_id=0)

## 快速开始

clone 到本地后，安装依赖并运行

```
    # 安装依赖
    npm install

    # 启动项目
    npm run serve

    # 打包项目
    npm run build
```

**提示**：该项目的正常运行依赖于服务端，请先将博客服务端克隆到本地并启动。

## 功能列表

- 主要模块
  - 注册登录
  - 用户管理
  - 资讯管理
  - 资讯类别管理
  - 产品管理
  - 广告位管理
  - 友链管理
  - 个人中心设置
- axios封装
- 路由封装
- 登录拦截
- 权限控制
- 组件封装
  - 表格组件
  - 上传组件
  - 富文本组件
- 环境变量

## 目录结构

```
    ├── public // 项目主入口
    ├── src
    │   ├── api // 接口
    │   ├── assets // 静态资源
    │   ├── components // 组件
    │   ├── router // 路由
    │   ├── store // 状态管理
    │   ├── utils // 工具库
    │   ├── views // 页面
    │   ├── App.vue // 根组件
    │   └── main.js // 入口文件
    ├── .env.development // 开发环境配置
    ├── .env.production // 生产环境配置
    ├── .gitignore // git忽略文件
    ├── .prettierrc.js // prettier配置
    ├── babel.config.js // babel配置
    ├── jsconfig.json // js配置
    ├── package-lock.json // 依赖版本锁定文件
    ├── package.json // 项目依赖
    ├── README.md // 项目说明
    └── vue.config.js // vue配置
```

后续会持续更新，敬请期待。如果对你有所帮助，给个 Star 吧！
