/* eslint-disable no-console */

import fs from 'fs';
import inquirer from 'inquirer';

const questions = [
  {
    type: 'list',
    name: 'commitLint',
    message: 'commit lint が必要ですか？(husky, lint-staged)',
    choices: ['yes', 'no'],
  },
  {
    type: 'list',
    name: 'dependabot',
    message: 'dependabot が必要ですか？',
    choices: ['yes', 'no'],
  },
];

inquirer.prompt(questions).then((answers) => {
  if (answers.commitLint === 'no') {
    fs.rmdirSync('./husky', { recursive: true });
    console.log('✅commitLintを削除しました。');
    fs.unlinkSync('lint-staged.config.js');
    console.log('✅lint-staged.config.jsを削除しました。');
  }

  if (answers.dependabot === 'no') {
    fs.unlinkSync('.github/dependabot.yml');
    console.log('✅dependabot.ymlを削除しました。');
  }

  console.log('🏆テンプレートからの初期設定が完了しました。');
});
