import AdmZip from "adm-zip";
import path from "path";
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const packageFilePath = path.resolve(__dirname, "../package.json");
const packageJSON = require(packageFilePath);
const distFolderPath = path.resolve(__dirname, "../dist");

function addZero(num) {
  return num < 10 ? "0" + num : num;
}
let name = packageJSON.name;
let version = packageJSON.version;
let date = new Date();
let time =
  "" +
  date.getFullYear() +
  addZero(date.getMonth() + 1) +
  addZero(date.getDate()) +
  addZero(date.getHours()) +
  addZero(date.getMinutes());

function createZipArchive() {
  const zip = new AdmZip();
  const outputFile = `${name}-${version}.${time}.zip`;
  zip.addLocalFolder(distFolderPath);
  zip.writeZip(outputFile);
  console.log(`[info] created ${outputFile} successfully`);
}


createZipArchive();
