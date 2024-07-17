/* eslint-disable no-console */
import fs from 'fs';
import inquirer from 'inquirer';

const questions = [
  {
    type: 'list',
    name: 'commitLint',
    message: 'commit lint が必要ですか？',
    choices: ['yes', 'no'],
  },
  {
    type: 'list',
    name: 'dependabot',
    message: 'dependabot が必要ですか？',
    choices: ['yes', 'no'],
  },
  {
    type: 'input',
    name: 'repositoryURL',
    message: 'リポジトリのURLをペーストして下さい',
  },
];

inquirer.prompt(questions).then((answers) => {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

  const { repositoryURL } = answers;
  const [, , , repositoryOrganization, repositoryName] = repositoryURL.split('/');
  packageJson.name = repositoryName;
  packageJson.repository.url = `git+https://github.com/${repositoryOrganization}/${repositoryName}.git`;

  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  console.log('✅package.jsonを更新しました。');

  if (answers.commitLint === 'no') {
    fs.rmSync('./.husky', { recursive: true, force: true });
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
