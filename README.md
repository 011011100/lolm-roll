# lolm-roll

《英雄联盟手游》随机阵容工具，支持单人和五人随机英雄、位置、召唤师技能与基石符文。结果仅供娱乐，请结合实际对局选择。

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

## 检查与构建

```sh
npx --yes pnpm@8.15.9 check:assets
npx --yes pnpm@8.15.9 lint
npx --yes pnpm@8.15.9 build
```

构建前会自动检查随机名单是否重复、每个名称是否有对应图片、文件头是否为图片格式，以及目录内是否残留未使用图片。构建产物在 `dist/`。GitHub Actions 在推送及 PR 时执行依赖安装、代码检查和构建。

后续更新时，请核对上述手游官方数据的版本及英雄上线状态，同时更新 `src/composables/characterName.js` / `talentName.js`、`public/assets/` 和 `docs/` 来源清单。基石符文与符文大乱斗的强化符文是不同系统，不应混入同一个随机池。

游戏名称与图片版权归 Riot Games / 腾讯及相应权利人所有。
