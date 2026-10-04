import { ref } from 'vue'
import { CHARACTER_NAMES } from '../../shared/pools.js'

export const CharacterName = ref([...CHARACTER_NAMES])
