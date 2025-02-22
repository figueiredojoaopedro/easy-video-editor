import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input_dir = path.join(__dirname, "..", "..", "input");
const output_dir = path.join(__dirname, "..", "..", "output");

const convertToMp4 = (fileName) => {
  // ensure output directory exists
  if (!fs.existsSync(output_dir)) {
    fs.mkdirSync(output_dir, { recursive: true });
  }

  // ensure input directory exists
  if (!fs.existsSync(input_dir)) {
    fs.mkdirSync(input_dir, { recursive: true });
  }

  const timestamp = new Date().getTime();
  const output_filename = `output_${timestamp}.mp4`;

  const output_path = path.join(output_dir, output_filename);
  const input_path = path.resolve(input_dir, fileName);

  console.info("Input Path:", input_path, "\n");
  console.info("Output Path:", output_path, "\n");

  return new Promise((resolve, reject) => {
    ffmpeg({ source: input_path })
      .outputOptions("-c:v", "libx264") // Use h.264 codec
      .outputOptions("-c:a", "aac") // Use AAC audio codec
      .toFormat("mp4")
      .on("start", (cmd) => console.info(`Ffmpeg command: ${cmd} \n`))
      .on("progress", (progress) => {
        console.info(
          `Processing: ${fileName} ${progress.percent.toFixed(2)}% done`
        );
      })
      .on("end", () => {
        console.info("Conversion complete:", output_filename, "\n");
        resolve(output_filename);
      })
      .on("error", (error) => reject(error))
      .save(output_path);
  });
};

export default { mp4: convertToMp4 };
