import video from "./processor/video.js";
import audio from "./processor/audio.js";
import dirs from "../utils/dirs.js";

const parameters = process.argv.slice(2);

const main = async () => {
  try {
    console.info("Invoked...", new Date().toISOString(), `\n`);

    const processment = parameters[0];
    const processment_params = parameters.slice(1);

    console.info(`Processment: ${processment}`);

    switch (processment) {
      case "join":
        await video.joiner(...processment_params);
        break;
      case "clear":
        dirs.clear(...processment_params);
        break;
      case "volume":
        await audio.volume(...processment_params);
        break;
      default:
        console.error("Invalid processment: " + processment);
        break;
    }
  } catch (error) {
    console.error(error);
  } finally {
    console.info("\nFinished...", new Date().toISOString());
  }
};

main();
