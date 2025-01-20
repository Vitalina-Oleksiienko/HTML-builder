const fs = require('fs').promises;
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const templateFilePath = path.join(__dirname, 'template.html');
const stylesFolderPath = path.join(__dirname, 'styles');
const componentsFolderPath = path.join(__dirname, 'components');
const assetsFolderPath = path.join(__dirname, 'assets');

async function buildPage() {
  try {
    await fs.mkdir(projectDistPath, { recursive: true });

    const templateContent = await fs.readFile(templateFilePath, 'utf-8');

    const templateTags = templateContent.match(/\{\{(\w+)\}\}/g) || [];

    let modifiedTemplate = templateContent;
    for (const tag of templateTags) {
      const componentName = tag.slice(2, -2);
      const componentFilePath = path.join(
        componentsFolderPath,
        `${componentName}.html`,
      );

      try {
        const componentContent = await fs.readFile(componentFilePath, 'utf-8');
        modifiedTemplate = modifiedTemplate.replace(tag, componentContent);
      } catch (componentError) {
        console.error(
          `Error reading component file ${componentName}.html: ${componentError.message}`,
        );
      }
    }

    const indexPath = path.join(projectDistPath, 'index.html');
    await fs.writeFile(indexPath, modifiedTemplate, 'utf-8');

    const styleFiles = await fs.readdir(stylesFolderPath);
    const styleContents = await Promise.all(
      styleFiles.map((file) =>
        fs.readFile(path.join(stylesFolderPath, file), 'utf-8'),
      ),
    );
    const styleFilePath = path.join(projectDistPath, 'style.css');
    await fs.writeFile(styleFilePath, styleContents.join('\n'), 'utf-8');

    const assetsDistPath = path.join(projectDistPath, 'assets');
    await fs.mkdir(assetsDistPath, { recursive: true });
    await copyAssets(assetsFolderPath, assetsDistPath);

    console.log('Build completed successfully.');
  } catch (error) {
    console.error(`Error during build: ${error.message}`);
  }
}

async function copyAssets(source, destination) {
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destinationPath, { recursive: true });
      await copyAssets(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

buildPage();
