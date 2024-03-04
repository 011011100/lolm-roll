import {CharacterName} from "@/components/enums/characterName.js";
import {PositionName} from "@/components/enums/positionName.js";
import {SkillName} from "@/components/enums/skillName.js";
import {TalentName} from "@/components/enums/talentName.js";


export const rollUtil = {

    // 随机英雄
    rollFiveCharacter() {
        let cn = [...CharacterName]
        // 随机5个英雄
        let rr = []
        for (let i = 0; i < 5; i++) {
            let number = Math.floor(Math.random() * cn.length);
            rr.push(cn[number])
            cn.splice(number, 1)
        }
        return rr;
    },

    // 随机英雄
    rollCharacter() {
        const random = Math.floor(Math.random() * CharacterName.length)
        return CharacterName[random];
    },

    // 随机位置
    rollFivePosition() {
        let pn = [...PositionName]
        // 随机5个位置
        let rr = []
        for (let i = 0; i < 5; i++) {
            let number = Math.floor(Math.random() * pn.length);
            rr.push(pn[number])
            pn.splice(number, 1)
        }
        return rr
    },

    // 随机位置
    rollPosition() {
        return PositionName[Math.floor(Math.random() * PositionName.length)];
    },


    // 随机召唤师技能
    rollSkillJug() {
        // 复制SkillName至sn
        let sn = [...SkillName]
        let number = 6;
        let n1 = sn[number];
        // 在sn中去除n1
        sn.splice(number, 1)
        let n2 = sn[Math.floor(Math.random() * sn.length)];
        return [n1, n2]
    },

    // 随机召唤师技能
    rollSkill() {
        // 复制SkillName至sn
        let sn = [...SkillName]
        // 去除惩戒
        sn.splice(sn.length - 1, 1)
        let number = Math.floor(Math.random() * sn.length);
        let n1 = sn[number];
        // 在sn中去除n1
        sn.splice(number, 1)
        let n2 = sn[Math.floor(Math.random() * sn.length)];
        return [n1, n2]
    },

    // 随机主天赋
    rollTalent() {
        return TalentName[Math.floor(Math.random() * TalentName.length)];
    }

}
