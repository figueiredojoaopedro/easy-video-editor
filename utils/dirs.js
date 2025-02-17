import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input_dir = path.join(__dirname, "..", "input");
const output_dir = path.join(__dirname, "..", "output");

const clear = (dir) => {
  const validDirs = {
    input: input_dir,
    output: output_dir,
    preprocessed: path.join(input_dir, "preprocessed"),
  };

  const targetDir = validDirs[dir];

  console.log("Clearing directory:", targetDir);

  if (!targetDir) {
    console.error("Invalid directory:", dir);
    return;
  }

  if (!fs.existsSync(targetDir)) {
    console.error("Directory does not exist:", targetDir);
    return;
  }

  const files = fs.readdirSync(targetDir);

  files.forEach((file) => {
    const filePath = path.join(targetDir, file);

    // remove the file
    fs.unlinkSync(filePath);
  });

  console.info("Directory cleared:", targetDir);
};

export default { clear };
