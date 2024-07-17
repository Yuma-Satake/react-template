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
  console.log('✅package.jsonを更新');

  const indexHtml = fs.readFileSync('index.html', 'utf-8');
  const updatedIndexHtml = indexHtml.replace(
    /<title>.*<\/title>/,
    `<title>${repositoryName}</title>`
  );
  fs.writeFileSync('index.html', updatedIndexHtml);
  console.log('✅index.htmlを更新');

  if (answers.commitLint === 'no') {
    fs.rmSync('./.husky', { recursive: true, force: true });
    console.log('✅commitLintを削除');
    fs.unlinkSync('lint-staged.config.js');
    console.log('✅lint-staged.config.jsを削除');
  }

  if (answers.dependabot === 'no') {
    fs.unlinkSync('.github/dependabot.yml');
    console.log('✅dependabot.ymlを削除');
  }

  const readmeContent = fs.readFileSync('README.md', 'utf-8');
  const updatedReadmeContent = `# ${repositoryName}\n\n${readmeContent}`;
  fs.writeFileSync('README.md', updatedReadmeContent);
  console.log('✅README.mdを更新');

  console.log('🏆テンプレートからの初期設定が完了しました。');
});
