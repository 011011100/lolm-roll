export function rollFiveCharacter() {
  const cn = [...CharacterName.value]
  // 随机5个英雄
  const rr = []
  for (let i = 0; i < 5; i++) {
    const number = Math.floor(Math.random() * cn.length)
    rr.push(cn[number])
    cn.splice(number, 1)
  }
  return rr
}

// 随机英雄
export function rollCharacter() {
  const random = Math.floor(Math.random() * CharacterName.value.length)
  return CharacterName.value[random]
}

// 随机位置
export function rollFivePosition() {
  const pn = [...PositionName.value]
  // 随机5个位置
  const rr = []
  for (let i = 0; i < 5; i++) {
    const number = Math.floor(Math.random() * pn.length)
    rr.push(pn[number])
    pn.splice(number, 1)
  }
  return rr
}

// 随机位置
export function rollPosition() {
  return PositionName.value[Math.floor(Math.random() * PositionName.length)]
}

// 随机召唤师技能
export function rollSkillJug() {
  // 复制SkillName至sn
  const sn = [...SkillName.value]
  const number = 6
  const n1 = sn[number]
  // 在sn中去除n1
  sn.splice(number, 1)
  const n2 = sn[Math.floor(Math.random() * sn.length)]
  return [n1, n2]
}

// 随机召唤师技能
export function rollSkill() {
  // 复制SkillName至sn
  const sn = [...SkillName.value]
  // 去除惩戒
  sn.splice(sn.length - 1, 1)
  const number = Math.floor(Math.random() * sn.length)
  const n1 = sn[number]
  // 在sn中去除n1
  sn.splice(number, 1)
  const n2 = sn[Math.floor(Math.random() * sn.length)]
  return [n1, n2]
}

// 随机主天赋
export function rollTalent() {
  return TalentName.value[Math.floor(Math.random() * TalentName.value.length)]
}
