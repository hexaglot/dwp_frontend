module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: ["node", "prettier"],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    "import/no-commonjs": "off",
  },
};
