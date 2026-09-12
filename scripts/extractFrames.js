const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');

const inputVideo = path.join(__dirname, '../public/media/bg-video.mp4');
const outputDir = path.join(__dirname, '../public/media/frames');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Extracting video frames from:', inputVideo);
console.log('Target output directory:', outputDir);

// Extract frames at 24 FPS into WebP images for web rendering
const command = `"${ffmpegPath}" -i "${inputVideo}" -vf "fps=24" -q:v 85 "${path.join(outputDir, 'frame_%04d.webp')}" -y`;

try {
  execSync(command, { stdio: 'inherit' });
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.webp'));
  console.log(`🎉 Successfully extracted ${files.length} frame assets into ${outputDir}`);
} catch (err) {
  console.error('Error during frame extraction:', err);
  process.exit(1);
}
