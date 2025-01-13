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
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('✅package.jsonを更新');

  const indexHtml = fs.readFileSync('index.html', 'utf-8');
  const updatedIndexHtml = indexHtml.replace(
    /<title>.*<\/title>/,
    `<title>${repositoryName}</title>`
  );
  fs.writeFileSync('index.html', updatedIndexHtml);
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('✅index.htmlを更新');

  if (answers.commitLint === 'no') {
    fs.rmSync('./.husky', { recursive: true, force: true });
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log('✅commitLintを削除');
    fs.unlinkSync('lint-staged.config.js');
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log('✅lint-staged.config.jsを削除');
  }

  if (answers.dependabot === 'no') {
    fs.unlinkSync('.github/dependabot.yml');
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log('✅dependabot.ymlを削除');
  }

  const readmeContent = fs.readFileSync('README.md', 'utf-8');
  const updatedReadmeContent = `# ${repositoryName}\n\n${readmeContent}`;
  fs.writeFileSync('README.md', updatedReadmeContent);
  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('✅README.mdを更新');

  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log('🏆テンプレートからの初期設定が完了しました。');
});
