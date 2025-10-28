import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface CustomQRCodeProps {
  value: string;
  size: number;
  bgColor: string;
  fgColor: string;
  level: 'L' | 'M' | 'Q' | 'H';
  includeMargin: boolean;
  qrStyle: 'squares' | 'dots' | 'rounded' | 'heart' | 'circles' | 'triangles' | 'hexagons' | 'stars';
  logo?: string;
}

const CustomQRCode: React.FC<CustomQRCodeProps> = ({
  value,
  size,
  bgColor,
  fgColor,
  level,
  includeMargin,
  qrStyle,
  logo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate QR code data
    QRCode.toCanvas(
      canvas,
      value,
      {
        errorCorrectionLevel: level,
        margin: includeMargin ? 4 : 0,
        width: size,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      },
      (error: Error | null | undefined) => {
        if (error) {
          console.error('QR Code generation error:', error);
          return;
        }

        // If custom style is selected, redraw with custom shapes
        if (qrStyle !== 'squares') {
          try {
            const qrCode = QRCode.create(value, { errorCorrectionLevel: level });
            const margin = includeMargin ? 4 : 0;
            const modules = qrCode.modules;
            const moduleCount = modules.size;
            const cellSize = size / (moduleCount + margin * 2);

            // Clear canvas
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, size, size);

            // Draw custom styled modules
            ctx.fillStyle = fgColor;
            for (let row = 0; row < moduleCount; row++) {
              for (let col = 0; col < moduleCount; col++) {
                if (modules.get(row, col)) {
                  const x = (col + margin) * cellSize;
                  const y = (row + margin) * cellSize;
                  drawCustomModule(ctx, x, y, cellSize, qrStyle);
                }
              }
            }

            // Draw logo if provided
            if (logo) {
              const logoSize = size * 0.2;
              const logoX = (size - logoSize) / 2;
              const logoY = (size - logoSize) / 2;

              // Draw white background for logo
              ctx.fillStyle = bgColor;
              ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

              const logoImg = new Image();
              logoImg.onload = () => {
                ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
              };
              logoImg.src = logo;
            }
          } catch (err) {
            console.error('QR Code creation error:', err);
          }
        } else if (logo) {
          // Draw logo on squares style
          const logoSize = size * 0.2;
          const logoX = (size - logoSize) / 2;
          const logoY = (size - logoSize) / 2;

          // Draw white background for logo
          ctx.fillStyle = bgColor;
          ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

          const logoImg = new Image();
          logoImg.onload = () => {
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          };
          logoImg.src = logo;
        }
      }
    );
  }, [value, size, bgColor, fgColor, level, includeMargin, qrStyle, logo]);

  return <canvas ref={canvasRef} width={size} height={size} />;
};

const drawCustomModule = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  style: string
) => {
  const centerX = x + size / 2;
  const centerY = y + size / 2;
  const radius = size / 2;

  switch (style) {
    case 'dots':
    case 'circles':
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.9, 0, Math.PI * 2);
      ctx.fill();
      break;

    case 'rounded':
      ctx.beginPath();
      ctx.roundRect(x + size * 0.1, y + size * 0.1, size * 0.8, size * 0.8, size * 0.25);
      ctx.fill();
      break;

    case 'heart':
      // Draw heart shape
      const heartSize = size * 0.8;
      const heartX = centerX;
      const heartY = centerY - heartSize * 0.1;
      
      ctx.save();
      ctx.translate(heartX, heartY);
      ctx.scale(heartSize / 40, heartSize / 40);
      
      ctx.beginPath();
      ctx.moveTo(0, 8);
      // Left top curve
      ctx.bezierCurveTo(0, 0, -12, 0, -12, 8);
      // Left bottom curve
      ctx.bezierCurveTo(-12, 16, 0, 24, 0, 28);
      // Right bottom curve
      ctx.bezierCurveTo(0, 24, 12, 16, 12, 8);
      // Right top curve
      ctx.bezierCurveTo(12, 0, 0, 0, 0, 8);
      ctx.fill();
      
      ctx.restore();
      break;

    case 'triangles':
      ctx.beginPath();
      ctx.moveTo(centerX, y + size * 0.1);
      ctx.lineTo(x + size * 0.9, y + size * 0.9);
      ctx.lineTo(x + size * 0.1, y + size * 0.9);
      ctx.closePath();
      ctx.fill();
      break;

    case 'hexagons':
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = centerX + radius * 0.85 * Math.cos(angle);
        const hy = centerY + radius * 0.85 * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      break;

    case 'stars':
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        const r = i % 2 === 0 ? radius * 0.9 : radius * 0.4;
        const sx = centerX + r * Math.cos(angle);
        const sy = centerY + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      break;

    default:
      ctx.fillRect(x, y, size, size);
  }
};

export default CustomQRCode;

