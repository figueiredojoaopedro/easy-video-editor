import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const output_dir = path.join(__dirname, "..", "..", "output");

const volume = (fileName, gain = 1, useDecibels = false) => {
  console.info("Adjusting volume...", fileName, gain, useDecibels);

  const timestamp = new Date().getTime();
  const output_filename = `output_volume_${timestamp}.mp4`;
  const output_path = path.join(output_dir, output_filename);

  if (!fileName) {
    console.error("No input file provided.");
    return;
  }

  const video_path = path.resolve(__dirname, "..", "..", "input", fileName);
  const volumeFilter = useDecibels ? `volume=${gain}dB` : `volume=${gain}`;

  console.info("Volume Filter: ", volumeFilter, "\n");

  return new Promise((resolve, reject) => {
    const command = ffmpeg({ source: video_path });

    command
      .audioFilters(volumeFilter)
      .on("start", (cmd) => console.info(`Ffmpeg command: ${cmd}`))
      .on("end", () => {
        console.info("Volume adjustment complete:", output_filename);
        resolve(output_filename);
      })
      .on("error", (error) => reject(error))
      .save(output_path);
  });
};

export default { volume };
