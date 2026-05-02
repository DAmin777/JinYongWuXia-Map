# 金庸武侠宇宙交互地图

基于 React 18 + Vite 5 + Leaflet 的交互式地图应用，展示金庸武侠世界的地理信息。

## 功能

- 金庸 15 部小说中 **60 个门派/地点** 的地理标注
- 按**小说分类**筛选（多选联动过滤人物和地点）
- 按**类型**筛选（门派 / 名胜）
- **41 位人物**名册，含生平、阵营、武功绝学
- 点击人物查看**江湖行踪轨迹**（带箭头动效和时间线标签）
- 地图标记旁显示**地名标签**
- 无标签古地图底图，泛黄宣纸质感

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | React 18 |
| 构建 | Vite 5 |
| 地图 | Leaflet 1.9 + react-leaflet 4.2 |
| 样式 | Tailwind CSS 3.4 |
| 字体 | Ma Shan Zheng（毛笔）、ZCOOL XiaoWei（正文） |

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:5173

## 部署

项目通过 Vercel 自动部署，推送 main 分支即可触发：

```bash
git push origin main
```

## 项目结构

```
src/
├── data/
│   ├── wuxia_data.json       # 地点数据
│   └── wuxia_characters.json # 人物数据
├── components/
│   ├── MapView.jsx           # 地图主组件
│   ├── ControlPanel.jsx      # 左侧控制面板
│   └── Sidebar.jsx           # 右侧详情侧边栏
├── App.jsx                   # 主应用（状态管理）
├── main.jsx                  # 入口
└── index.css                 # 全局样式
```

## 许可

仅供学习交流，金庸作品版权归原作者所有。
