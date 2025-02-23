import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { resolveObjectURL } from "buffer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input_dir = path.join(__dirname, "..", "..", "input");
const output_dir = path.join(__dirname, "..", "..", "output");

// Create the output file path
if (!fs.existsSync(output_dir)) {
  fs.mkdirSync(output_dir, { recursive: true });
}

// Ensure input directory exists
if (!fs.existsSync(input_dir)) {
  fs.mkdirSync(input_dir, { recursive: true });
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
  console.info("Output Path:", output_path + "\n");

  return new Promise((resolve, reject) => {
    const command = ffmpeg({
      source: input_videos[0],
    });

    input_videos.slice(1).forEach((input_video) => {
      console.info(`Adding file: ${input_video}...`);
      command.input(input_video);
    });

    command
      .on("start", (cmd) => console.info("\nFFmpeg command:", cmd + "\n"))
      .on("end", () => {
        console.info("Merge complete:", output_filename);
        resolve(output_filename);
      })
      .on("error", (error) => reject(error))
      .mergeToFile(output_path);
  });
};

const cut = (fileName, cut_times) => {
  const number_cut_times = cut_times.map(Number);

  if (!fs.existsSync(output_dir)) {
    fs.mkdirSync(output_dir, { recursive: true });
  }

  if (!fs.existsSync(input_dir)) {
    fs.mkdirSync(input_dir, { recursive: true });
  }

  const timestamp = new Date().getTime();
  const input_file = path.resolve(input_dir, fileName);
  const sortedTimes = [0, ...number_cut_times.sort((a, b) => a - b)];

  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(input_file, (error, metadata) => {
      if (error) {
        console.error("Error reading file metadata:", error);
        return reject(error);
      }

      const duration = metadata.format.duration;
      sortedTimes.push(duration); // Add the full video length

      if (sortedTimes.some((time) => time > duration)) {
        return reject(
          new Error(`Invalid cut time. Video duration: ${duration}`)
        );
      }

      const filename = path.parse(input_file).name;
      const cutPromises = [];

      for (let i = 0; i < sortedTimes.length - 1; i++) {
        const start = sortedTimes[i];
        const end = sortedTimes[i + 1];
        const segment_duration = end - start;
        const output_filename = `${filename}_${start}-${end}_${timestamp}.mp4`;
        const output_path = path.join(output_dir, output_filename);

        cutPromises.push(
          new Promise((resolveSegment, rejectSegment) => {
            ffmpeg(input_file)
              .outputOptions(["-ss", start]) // Seek after input for better accuracy
              .outputOptions(["-t", segment_duration]) // Set duration
              .outputOptions([
                "-c:v",
                "libx264",
                "-preset",
                "fast",
                "-crf",
                "23",
                "-c:a",
                "aac",
                "-b:a",
                "128k",
                "-movflags",
                "+faststart",
                "-reset_timestamps",
                "1", // Force timestamp reset
              ])
              .on("start", (cmd) => console.info(`Cutting ${i + 1}:\n${cmd}`))
              .on("end", () => {
                console.info(`Part ${i + 1} completed`);
                resolveSegment(output_filename);
              })
              .on("error", (error) => rejectSegment(error))
              .save(output_path);
          })
        );
      }

      Promise.all(cutPromises)
        .then((segments) => resolve(segments))
        .catch((error) => reject(error));
    });
  });
};

export default {
  joiner,
  cut,
};
