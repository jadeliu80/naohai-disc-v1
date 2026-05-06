# App Demo Bugfix Report v0.1

## 概述

根据 `playtest-report-v0.1.md` 发现的 6 项问题，已全部修复。修复涉及 `index.html`（单文件 demo）。

---

## 问题修复详情

### ✅ 问题1：RESOLUTION_PHASE 未调用
- **状态**：玩家行动后，`END_ACTION` → `RESOLUTION_PHASE` 未触发
- **修复**：在 `endTurn()` 中调用 `runResolutionPhase()`，确保护盾衰减在 AI 回合前结算
- **代码**：`endTurn()` → `runResolutionPhase()` → `saveGame()` → `runAITurn()`

### ✅ 问题2：20回合上限未实现
- **状态**：游戏没有回合数上限
- **修复**：在 `endTurn()` 中，`turn++` 后检查 `if(turn > 20)`，强制结束游戏并比较主堡HP判定胜负
- **代码**：
  ```js
  if(turn > 20){
    const winner = heavenHP > emberHP ? 'heaven' : (emberHP > heavenHP ? 'ember' : 'heaven');
    gameOver(winner);
    return;
  }
  ```

### ✅ 问题3：申公豹击杀回能缺失
- **状态**：申公豹击杀敌人后没有回复能量
- **修复**：在 `applyDamageToUnit()` 中，击杀判定后增加能量回复逻辑：
  ```js
  if(srcType.skKillEnergy && source.faction !== target.faction){
    energy = Math.min(maxEnergy, energy + srcType.skKillEnergy);
    showFloat(source.x, source.y, `+${srcType.skKillEnergy}⚡`, 'shield');
  }
  ```

### ✅ 问题4：哪吒AOE缺失
- **状态**：`skAOE=1` 已定义但技能逻辑未实现
- **修复**：在 `executeSkill()` 中添加 AOE 逻辑——对目标造成伤害，并对相邻4格敌人各造成等量伤害
  ```js
  if(t.skDmg>0 && t.skAOE===1){
    // 对目标造成 skDmg
    // 对相邻（上下左右）敌方各造成 skDmg
  }
  ```

### ✅ 问题5：鹿童直线AOE缺失
- **状态**：`skLine=true` 已定义但直线AOE逻辑未实现
- **修复**：在 `executeSkill()` 中添加直线逻辑——沿 `sign(dx), sign(dy)` 方向遍历至多 `skRange` 格，对路径上所有敌方造成伤害

### ✅ 问题6：暂停按钮缺失
- **状态**：UI 中无暂停按钮
- **修复**：
  1. 在 actionBar 添加「暂停」按钮
  2. 新增 `isPaused` 状态变量
  3. 新增 `togglePause()` 函数（暂停/继续切换）
  4. 新增 `<div id="pauseOverlay">` 暂停遮罩层
  5. 暂停时 `stopTimer()`，继续时 `startTimer()`
  6. `startDrawPhase()` 中检查 `isPaused` 防止恢复计时器自动启动

---

## 修改文件
- `index.html` — 全部修复

## 未涉及的文件
- `manifest.json`、`sw.js` — 无需修改
