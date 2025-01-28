import config from '@rocketseat/eslint-config/react.mjs'
import { rules } from 'eslint-plugin-react-refresh'

export default {
  config,
  rules: {
    ...config.rules,
    '@stylistic/max-len': 'off',
  },
}
