# lolm-roll

《英雄联盟手游》随机阵容工具，支持单人、本机五人随机，以及通过房间码组队随机英雄、位置、召唤师技能与基石符文。结果仅供娱乐，请结合实际对局选择。

## 房间组队

1. 首页选择「五人随机」，创建房间，将 6 位房间码发给队友。
2. 队友输入房间码加入。人数自动同步，包含房主最多 5 人，满员显示「房间已满」。
3. 满 5 人后，仅房主可以点击「开始随机」。五位成员获得不同的英雄和位置，打野必带惩戒。
4. 每个人只收到自己的英雄、位置、天赋与召唤师技能。房主也不能查看其他人的结果，重复开始不会重新抽取。

成员身份保存在当前标签页的 `sessionStorage`，刷新会恢复同一身份；房间码用于加入，不能用来读取别人的结果。不要分享浏览器中保存的身份令牌。清除存储或关闭标签页后可能无法恢复原身份。

未开始时，离线超过 60 秒会释放位置，房主离开时自动转交给仍在房间的成员。开始后不再接受新成员，断线重连仍可查看原结果。房间从创建起保留 2 小时。

**部署限制：房间是内存中的临时会话，必须运行单实例；服务重启或重新部署会清空房间。** 当前不依赖数据库。扩展到多实例或需要跨重启保留房间时，应先改用共享存储。

## 当前资源

2026-10-02 对照国服官网 **7.3** 版数据维护：

- **142 位英雄**：补齐原有 112 位之外的 30 位英雄及官方竖版图片，包括彗、芸阿娜、梅尔、斯莫德、奎桑提等。
- **13 种基石符文**：电击、黑暗收割、强攻、致命节奏、迅捷步法、征服者、不灭之握、守护者、艾黎、奥术彗星、相位猛冲、先攻、冰霜领主。
- 移除随机池中的海妖杀手、余震、冰川增幅，使用官方 PNG 图标替换旧图，修复缺图和过期名称。
- 英雄和符文图片随项目发布，运行时无需访问外部图片网站。

资料来源：[国服英雄资料](https://lolm.qq.com/v2/champions.html)、[英雄数据](https://game.gtimg.cn/images/lgamem/act/lrlib/js/heroList/hero_list.js)、[符文数据](https://game.gtimg.cn/images/lgamem/act/lrlib/js/rune/rune.js)、[7.1 符文调整公告](https://wildrift.leagueoflegends.com/en-gb/news/game-updates/wild-rift-patch-notes-7-1/)。

[英雄图片清单](docs/hero-assets.json)和[符文图片清单](docs/rune-assets.json)记录了本次下载的具体来源、版本与核对日期。仅加入已上线且进入官网名单的英雄，不提前加入预告英雄。旧英雄名“塞娜、塞恩、尼拉”保留原图片路径，清单记录对应的官方名称。

## 本地运行

推荐 Node.js 24，使用与现有锁文件匹配的 pnpm 8.15.9：

```sh
npx --yes pnpm@8.15.9 install --frozen-lockfile
npx --yes pnpm@8.15.9 dev
```

开发命令一次启动前后端：页面 `http://localhost:3333`，API 默认监听 `127.0.0.1:3000`，Vite 代理 `/api`。如 API 端口已被占用，可通过 `API_PORT` 修改。端口冲突会报错，不会自动启动到其他端口。

## 检查与构建

```sh
npx --yes pnpm@8.15.9 check:assets
npx --yes pnpm@8.15.9 lint
npx --yes pnpm@8.15.9 test
npx --yes pnpm@8.15.9 build
npx --yes pnpm@8.15.9 start
```

构建前会自动检查随机名单是否重复、每个名称是否有对应图片、文件头是否为图片格式，以及目录内是否残留未使用图片。构建产物在 `dist/`，`start`（或 `preview`）由 Node 同时提供页面和 API，默认端口 3000。GitHub Actions 在推送及 PR 时执行依赖安装、代码检查、房间集成测试和构建。

## Zeabur 部署

仓库根目录提供 `Dockerfile`，将前端构建产物和 Node 房间服务放在同一个容器、同一域名下，无需配置跨域或额外数据库。Zeabur 默认会识别该文件，参见[官方 Dockerfile 部署说明](https://zeabur.com/docs/en-US/deploy/methods/dockerfile)。

- 使用本仓库根目录构建，保持 **1 个实例**。
- 使用 Dockerfile 默认启动命令 `node server/index.js`，移除旧的纯静态服务或 `vite preview` 启动覆盖。
- 服务监听 `0.0.0.0:$PORT`，Dockerfile 默认 `PORT=3000` 并暴露 3000；平台转发端口须与 `PORT` 一致。
- 可将健康检查路径设置为 `/api/health`，参见[官方健康检查说明](https://zeabur.com/docs/en-US/operations/monitoring/health-checks)。
- 仅在服务入口经过可信反向代理时配置 `TRUST_PROXY=1`，用代理提供的客户端地址做访问频率限制；直接对外暴露 Node 时保持默认值。
- 部署后用不同设备创建、加入同一房间，确认人数同步；仅静态页面加载成功不能证明房间 API 正常。

后续更新时，请核对上述手游官方数据的版本及英雄上线状态，同时更新 `shared/pools.js`、`public/assets/` 和 `docs/` 来源清单。前后端共用同一份随机名单。基石符文与符文大乱斗的强化符文是不同系统，不应混入同一个随机池。

游戏名称与图片版权归 Riot Games / 腾讯及相应权利人所有。
