# 金庸武侠宇宙交互地图

基于 React 18 + Vite + Leaflet 的交互式地图应用，展示金庸武侠世界的地理信息。

## 技术栈
- **框架**: React 18.3, Vite 5
- **地图**: Leaflet 1.9, react-leaflet 4.2, leaflet-curve, leaflet-polylinedecorator
- **样式**: Tailwind CSS 3.4
- **字体**: Ma Shan Zheng (毛笔), ZCOOL XiaoWei (正文)

## 命令
```bash
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run preview  # 预览生产构建
```

## 项目结构
- `src/data/` — 静态数据
- `src/components/` — React 组件
- `src/App.jsx` — 主应用入口
- `src/main.jsx` — React 挂载点

## 注意事项
- 语言为中文
- 使用 ES Module (`"type": "module"`)
- 字体通过 Google Fonts CDN 加载，离线环境可能无法显示
