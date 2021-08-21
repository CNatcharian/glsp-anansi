/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: [
        './base.eslintrc.json',
        './warnings.eslintrc.json',
        './errors.eslintrc.json'
    ],
    ignorePatterns: [
        '**/{css,node_modules,lib}'
    ],
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: 'tsconfig.json'
    }
};
