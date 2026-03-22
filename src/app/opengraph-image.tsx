import { ImageResponse } from 'next/og';
import { userConfig } from '@/config/userConfig';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const runtime = 'nodejs'; // Use nodejs runtime for fs module

async function getFont(family: string, weight: number, text: string) {
  try {
    const API = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const cssRes = await fetch(API);
    const css = await cssRes.text();
    const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
    if (resource) {
      const response = await fetch(resource[1]);
      if (response.status === 200) {
        return await response.arrayBuffer();
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to load font:', error);
    return null;
  }
}

export default async function Image() {
  const isRight = userConfig.site.heroAlignment === 'right';

  // Load Image
  let imageSrc = '';
  try {
    const imagePath = join(process.cwd(), 'public', 'images', 'hero-pc.png');
    const imageData = await readFile(imagePath);
    imageSrc = `data:image/png;base64,${imageData.toString('base64')}`;
  } catch (e) {
    console.error('hero-pc.png failed to load', e);
  }

  // Load Font
  const textCharacters = userConfig.profile.name + 'Official Site';
  let fontData = await getFont('Noto+Serif+JP', 700, textCharacters);

  const textContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '50%',
    justifyContent: 'center',
    padding: '80px',
    alignItems: 'flex-start',
    textAlign: 'left' as const,
  };

  const imageContainerStyle = {
    display: 'flex',
    width: '50%',
    justifyContent: isRight ? 'flex-start' : 'flex-end',
    alignItems: 'flex-end',
  };

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: isRight ? 'row-reverse' : 'row', width: '100%', height: '100%', background: userConfig.colors.background }}>
        <div style={textContainerStyle}>
          <h1 style={{ color: userConfig.colors.text, fontSize: '80px', margin: '0', fontWeight: 700 }}>
            {userConfig.profile.name}
          </h1>
          <p style={{ color: userConfig.colors.accent || userConfig.colors.primary, fontSize: '40px', marginTop: '20px' }}>
            Official Site
          </p>
        </div>
        <div style={imageContainerStyle}>
          {imageSrc ? <img src={imageSrc} height="630" style={{ objectFit: 'contain' }} alt="Hero" /> : null}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: 'Noto Serif JP',
              data: fontData,
              style: 'normal',
              weight: 700,
            },
          ]
        : [],
    }
  );
}
