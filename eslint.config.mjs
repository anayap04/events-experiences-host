import nextConfig from 'eslint-config-next/core-web-vitals';

export default [
  ...nextConfig,
  {
    ignores: ['.next/**', 'dist/**', 'node_modules/**'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];