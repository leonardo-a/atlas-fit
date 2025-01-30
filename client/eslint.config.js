import config from '@rocketseat/eslint-config/react.mjs'

export default [
  ...config,
  {
    rules: {
      ...config.rules,
      '@stylistic/max-len': 'off',
    },
  },
]
