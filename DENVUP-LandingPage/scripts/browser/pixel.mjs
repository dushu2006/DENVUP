import sharp from 'sharp';
export async function sample(page, points, clip = { x: 0, y: 0, width: 420, height: 400 }) {
  const buf = await page.screenshot({ clip });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return points.map(([x, y]) => data[(y * info.width + x) * 3]);
}
