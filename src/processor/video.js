import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input_dir = path.join(__dirname, "..", "..", "input");
const output_dir = path.join(__dirname, "..", "..", "output");

// Create the output file path
if (!fs.existsSync(output_dir)) {
  fs.mkdirSync(output_dir, { recursive: true });
}

// Check if the output directory is writable
try {
  fs.accessSync(output_dir, fs.constants.W_OK);
} catch (err) {
  console.error("Error: No write access to output directory", err);
  process.exit(1);
}

const joiner = async () => {
  const timestamp = new Date().getTime();

  const output_filename = `output_joined_${timestamp}.mp4`;
  const output_path = path.resolve(output_dir, output_filename);

  // Ensure output directory exists
  if (!fs.existsSync(output_dir)) {
    fs.mkdirSync(output_dir, { recursive: true });
  }

  let input_videos = fs
    .readdirSync(input_dir)
    .filter((file) => file.endsWith(".mp4"));

  if (input_videos.length === 0) {
    console.info("No input files found to join.");
    return;
  }

  input_videos = input_videos.map((file) => path.resolve(input_dir, file));
  console.log("Output Path:", output_path + "\n");

  return new Promise((resolve, reject) => {
    const command = ffmpeg({
      source: input_videos[0],
    });

    input_videos.slice(1).forEach((input_video) => {
      console.info(`Adding file: ${input_video}...`);
      command.input(input_video);
    });

    command
      .on("start", (cmd) => console.log("\nFFmpeg command:", cmd + "\n"))
      .on("end", () => {
        console.info("Merge complete:", output_filename);
        resolve(output_filename);
      })
      .on("error", (error) => reject(error))
      .mergeToFile(output_path);
  });
};

export default {
  joiner,
};
