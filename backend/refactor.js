import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backendDir = __dirname;
const srcDir = path.join(backendDir, "src");

const mapping = {
  // Modules
  "controller/User.controller.js": "src/modules/user/user.controller.js",
  "controller/admin.controller.js": "src/modules/admin/admin.controller.js",
  "controller/auth.controller.js": "src/modules/auth/auth.controller.js",
  "controller/employee.controller.js":
    "src/modules/employee/employee.controller.js",
  "controller/group.controller.js": "src/modules/group/group.controller.js",
  "controller/manager.controller.js":
    "src/modules/manager/manager.controller.js",
  "controller/profile.controller.js":
    "src/modules/profile/profile.controller.js",

  "routes/admin.routes.js": "src/modules/admin/admin.routes.js",
  "routes/auth.Routes.js": "src/modules/auth/auth.routes.js",
  "routes/employee.routes.js": "src/modules/employee/employee.routes.js",
  "routes/group.routes.js": "src/modules/group/group.routes.js",
  "routes/manager.routes.js": "src/modules/manager/manager.routes.js",
  "routes/profile.routes.js": "src/modules/profile/profile.routes.js",
  "routes/user.Routes.js": "src/modules/user/user.routes.js",

  "modals/adminModel.js": "src/modules/admin/admin.model.js",
  "modals/commentModel.js": "src/modules/comment/comment.model.js",
  "modals/groupModel.js": "src/modules/group/group.model.js",
  "modals/managerModel.js": "src/modules/manager/manager.model.js",
  "modals/taskModel.js": "src/modules/task/task.model.js",
  "modals/userModel.js": "src/modules/user/user.model.js",

  // Middleware
  "middleware/authMiddleware.js": "src/middleware/authMiddleware.js",
  "middleware/errorMiddleware.js": "src/middleware/errorMiddleware.js",
  "middleware/ratelimitermiddleware.js":
    "src/middleware/ratelimitermiddleware.js",

  // Config
  "database/db.js": "src/config/db.js",

  // App
  "app.js": "src/app.js",
};

const moduleNames = [
  "admin",
  "auth",
  "employee",
  "group",
  "manager",
  "profile",
  "user",
  "task",
  "comment",
];

// Create directories
fs.mkdirSync(srcDir, { recursive: true });
fs.mkdirSync(path.join(srcDir, "config"), { recursive: true });
fs.mkdirSync(path.join(srcDir, "middleware"), { recursive: true });
fs.mkdirSync(path.join(srcDir, "utils"), { recursive: true });

for (const mod of moduleNames) {
  fs.mkdirSync(path.join(srcDir, "modules", mod), { recursive: true });
}

// Map of old absolute paths to new absolute paths
const oldToNew = {};

for (const [oldPath, newPath] of Object.entries(mapping)) {
  const oldAbs = path.join(backendDir, oldPath);
  const newAbs = path.join(backendDir, newPath);
  if (fs.existsSync(oldAbs)) {
    fs.renameSync(oldAbs, newAbs);
    oldToNew[oldAbs] = newAbs;
    console.log(`Moved ${oldPath} -> ${newPath}`);
  }
}

// Function to update imports
function updateImports(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  // We need to replace string literals in import statements.
  // Instead of full parsing, we'll try a regex approach on imports.
  // Matches import/export statements
  content = content.replace(
    /(import\s+.*?from\s+['"]|export\s+.*?from\s+['"])(.*?)(['"])/g,
    (match, prefix, importPath, suffix) => {
      // If it's a relative import
      if (importPath.startsWith(".")) {
        // Calculate original absolute path of the imported file
        const originalImporterDir = Object.keys(oldToNew).find(
          (key) => oldToNew[key] === filePath,
        )
          ? path.dirname(
              Object.keys(oldToNew).find((key) => oldToNew[key] === filePath),
            )
          : filePath === path.join(backendDir, "server.js")
            ? backendDir
            : path.dirname(filePath); // fallback

        // Resolve original imported path
        let importedOriginalAbs = path.resolve(originalImporterDir, importPath);

        // Check if it's an exact match in our mapping
        let newImportedAbs = oldToNew[importedOriginalAbs];

        // If it doesn't match exactly, maybe it needs a .js extension or index.js handles
        if (!newImportedAbs && !importPath.endsWith(".js")) {
          newImportedAbs = oldToNew[importedOriginalAbs + ".js"];
        }

        if (newImportedAbs) {
          // We know where it moved! Calculate new relative path
          let newRelPath = path.relative(
            path.dirname(filePath),
            newImportedAbs,
          );
          newRelPath = newRelPath.replace(/\\/g, "/");
          if (!newRelPath.startsWith(".")) {
            newRelPath = "./" + newRelPath;
          }
          return prefix + newRelPath + suffix;
        }
      }
      return match;
    },
  );

  fs.writeFileSync(filePath, content, "utf8");
}

// Apply import updates to all new files and server.js
for (const newAbs of Object.values(oldToNew)) {
  updateImports(newAbs);
}
updateImports(path.join(backendDir, "server.js"));

// Remove old empty directories if they exist
const oldDirs = ["controller", "routes", "modals", "middleware", "database"];
for (const dir of oldDirs) {
  const dirPath = path.join(backendDir, dir);
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmdirSync(dirPath);
      console.log(`Removed empty directory ${dir}`);
    } catch (e) {
      console.log(`Could not remove ${dir}: ${e.message}`);
    }
  }
}

console.log("Refactoring complete.");
