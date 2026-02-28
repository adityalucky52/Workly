import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendDir = __dirname;
const srcDir = path.join(backendDir, "src");

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      getAllFiles(path.join(dir, file), fileList);
    } else if (file.endsWith(".js")) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const allFiles = getAllFiles(srcDir);

for (const file of allFiles) {
  let content = fs.readFileSync(file, "utf8");

  // Regex to match imports, using [\s\S]*? to handle multi-line imports
  content = content.replace(
    /(import\s+[\s\S]*?from\s+['"]|export\s+[\s\S]*?from\s+['"])(.*?)(['"])/g,
    (match, prefix, importPath, suffix) => {
      // Fix paths like:
      // ../controller/admin.controller.js -> ./admin.controller.js (if in same module)
      // ../modals/adminModel.js -> ./admin.model.js (if in admin module) or ../admin/admin.model.js (if in another module)

      let newImportPath = importPath;

      // Check if it's pointing to old controller or modals
      const matchOld = importPath.match(
        /(\.\.\/)+controller\/([a-zA-Z0-9]+)\.controller\.js/,
      );
      if (matchOld) {
        const moduleName = matchOld[2].toLowerCase(); // e.g. admin
        // If current file is in src/modules/admin, it should be ./admin.controller.js
        const currentModule = path.basename(path.dirname(file));
        if (currentModule === moduleName) {
          newImportPath = `./${moduleName}.controller.js`;
        } else {
          newImportPath = `../${moduleName}/${moduleName}.controller.js`;
        }
      }

      const matchOldModel = importPath.match(
        /(\.\.\/)+modals\/([a-zA-Z0-9]+)Model\.js/,
      );
      if (matchOldModel) {
        let tempName = matchOldModel[2];
        // special cases: adminModel -> admin, userModel -> user
        // the match gets 'admin', 'user', 'task', etc.
        let moduleName = tempName.toLowerCase();
        // Wait, User is user, admin is admin...
        const currentModule = path.basename(path.dirname(file));
        if (currentModule === moduleName) {
          newImportPath = `./${moduleName}.model.js`;
        } else {
          newImportPath = `../${moduleName}/${moduleName}.model.js`;
        }
      }

      const matchOldMiddleware = importPath.match(
        /(\.\.\/)+middleware\/([a-zA-Z0-9]+)\.js/i,
      );
      if (matchOldMiddleware) {
        const currentModule = path.basename(path.dirname(file));
        // from src/modules/admin it should be ../../middleware/authMiddleware.js
        // from src/app.js it should be ./middleware/authMiddleware.js
        if (currentModule === "src") {
          newImportPath = `./middleware/${matchOldMiddleware[2]}.js`;
        } else {
          newImportPath = `../../middleware/${matchOldMiddleware[2]}.js`;
        }
      }

      return prefix + newImportPath + suffix;
    },
  );

  fs.writeFileSync(file, content, "utf8");
}

console.log("Imports updated.");
