import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";
import QRCode from "qrcode";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const publicDir = join(repoRoot, "public");

const targetUrl = "https://projarch-demo-piyn.vercel.app/";
const titleLineOne = "Scan the below code";
const titleLineTwo = "to know more about Project Arch";

const svgPath = join(publicDir, "qr-code.svg");
const pngPath = join(publicDir, "qr-code.png");
const jpgPath = join(publicDir, "qr-code.jpg");
const cardJpgPath = join(publicDir, "project-arch-qr-card.jpg");
const cardVideoPath = join(publicDir, "project-arch-qr-card-5s.mp4");

const qrOptions = {
  errorCorrectionLevel: "H",
  margin: 2,
  width: 1200,
  color: {
    dark: "#111111",
    light: "#FFFFFF",
  },
};

function escapeFilterPath(filePath) {
  return filePath.replaceAll("\\", "/").replace(":", "\\:");
}

function runFfmpeg(args) {
  execFileSync("ffmpeg", ["-hide_banner", ...args], {
    cwd: repoRoot,
    stdio: "inherit",
  });
}

async function main() {
  mkdirSync(publicDir, { recursive: true });

  await QRCode.toFile(svgPath, targetUrl, {
    ...qrOptions,
    type: "svg",
  });

  await QRCode.toFile(pngPath, targetUrl, {
    ...qrOptions,
    type: "png",
  });

  runFfmpeg([
    "-y",
    "-i",
    pngPath,
    "-frames:v",
    "1",
    "-update",
    "1",
    "-q:v",
    "2",
    jpgPath,
  ]);

  const boldFont = escapeFilterPath("C:\\Windows\\Fonts\\arialbd.ttf");

  runFfmpeg([
    "-y",
    "-f",
    "lavfi",
    "-i",
    "color=c=white:s=1920x1080:r=30",
    "-i",
    pngPath,
    "-filter_complex",
    [
      "[1:v]scale=700:700:flags=neighbor[qr]",
      "[0:v][qr]overlay=(W-w)/2:300",
      `drawtext=fontfile='${boldFont}':text='${titleLineOne}':fontcolor=0x0B255F:fontsize=58:x=(w-text_w)/2:y=92`,
      `drawtext=fontfile='${boldFont}':text='${titleLineTwo}':fontcolor=0x0B255F:fontsize=58:x=(w-text_w)/2:y=168`,
    ].join(","),
    "-frames:v",
    "1",
    "-update",
    "1",
    "-q:v",
    "2",
    cardJpgPath,
  ]);

  runFfmpeg([
    "-y",
    "-loop",
    "1",
    "-framerate",
    "30",
    "-i",
    cardJpgPath,
    "-t",
    "5",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    cardVideoPath,
  ]);

  console.log(`Generated QR assets for ${targetUrl}`);
  console.log(svgPath);
  console.log(pngPath);
  console.log(jpgPath);
  console.log(cardJpgPath);
  console.log(cardVideoPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
