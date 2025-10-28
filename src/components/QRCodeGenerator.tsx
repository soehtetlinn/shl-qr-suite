import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Tab, Tabs } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import CustomQRCode from './CustomQRCode';

const QRCodeGenerator: React.FC = () => {
  const [destinationUrl, setDestinationUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [qrStyle, setQrStyle] = useState<'squares' | 'dots' | 'rounded' | 'heart' | 'circles' | 'triangles' | 'hexagons' | 'stars'>('squares');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [frameStyle, setFrameStyle] = useState('none');
  const [frameColor, setFrameColor] = useState('#6366f1');
  const [frameName, setFrameName] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const frames = [
    { id: 'none', name: 'No Frame', preview: '□' },
    { id: 'heart', name: 'Heart Frame', preview: '♥' },
    { id: 'round', name: 'Round Frame', preview: '○' },
    { id: 'badge', name: 'Badge Frame', preview: '⬟' },
    { id: 'square', name: 'Square Frame', preview: '▢' },
    { id: 'diamond', name: 'Diamond Frame', preview: '♦' },
    { id: 'star', name: 'Star Frame', preview: '★' },
  ];

  const patterns = [
    { id: 'squares', name: 'Squares', preview: '■' },
    { id: 'dots', name: 'Dots', preview: '●' },
    { id: 'rounded', name: 'Rounded', preview: '●' },
    { id: 'heart', name: 'Heart', preview: '♥' },
    { id: 'circles', name: 'Circles', preview: '○' },
    { id: 'triangles', name: 'Triangles', preview: '▲' },
    { id: 'hexagons', name: 'Hexagons', preview: '⬡' },
    { id: 'stars', name: 'Stars', preview: '★' },
  ];


  const colorPresets = [
    { name: 'Classic', fg: '#000000', bg: '#ffffff' },
    { name: 'Blue', fg: '#3b82f6', bg: '#ffffff' },
    { name: 'Purple', fg: '#8b5cf6', bg: '#ffffff' },
    { name: 'Pink', fg: '#ec4899', bg: '#ffffff' },
    { name: 'Green', fg: '#10b981', bg: '#ffffff' },
    { name: 'Red', fg: '#ef4444', bg: '#ffffff' },
    { name: 'Dark', fg: '#ffffff', bg: '#1f2937' },
    { name: 'Gradient', fg: '#6366f1', bg: '#f0f9ff' },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateQRCode = async () => {
    if (!destinationUrl) {
      toast.error('Please enter a destination URL');
      return;
    }

    try {
      new URL(destinationUrl);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setLoading(true);

    try {
      const metadata = {
        fgColor,
        bgColor,
        size,
        level,
        includeMargin,
        qrStyle,
        frameStyle,
        frameColor,
        frameName: frameName || title,
        ...(logo && {
          imageSettings: {
            src: logo,
            height: 40,
            width: 40,
            excavate: true,
          },
        }),
      };

      const response = await api.post('/api/qr/dynamic', {
        destinationUrl,
        title: title || `QR Code ${Date.now()}`,
        description,
        metadata,
      });

      toast.success('QR Code created successfully!');
      navigate(`/dashboard/qr/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrRef.current) return;

    // If no frame, just download the QR canvas directly
    if (frameStyle === 'none') {
      const qrCanvas = qrRef.current.querySelector('canvas');
      if (!qrCanvas) return;
      
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = qrCanvas.toDataURL('image/png');
      link.click();
      return;
    }

    // For frames, render the SVG to canvas
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Create a new canvas for the final image with frame
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match SVG
    canvas.width = 600;  // 2x for better quality
    canvas.height = 640;
    
    const qrCanvas = qrRef.current.querySelector('canvas');
    if (!qrCanvas) return;

    // Calculate proper canvas size based on frame
    const padding = 60;
    const qrSize = size;
    const frameOffset = frameStyle !== 'none' ? 50 : 0;
    const textHeight = (frameName || title) ? 60 : 20;
    
    canvas.width = qrSize + padding * 2 + frameOffset * 2;
    canvas.height = qrSize + padding * 2 + frameOffset * 2 + textHeight;

    // Serialize SVG to image
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      // Draw the SVG image onto canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Download
      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      // Fallback: render manually if SVG to image fails
      renderFrameManually(ctx, canvas.width, canvas.height, qrCanvas);
    };

    img.src = url;
  };

  const renderFrameManually = (ctx: CanvasRenderingContext2D, width: number, height: number, qrCanvas: HTMLCanvasElement) => {
    const centerX = width / 2;
    const centerY = (height - 60) / 2;
    const qrSize = size;

    // Fill background with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw frame based on style
    if (frameStyle !== 'none') {
      ctx.fillStyle = frameColor;
      
      if (frameStyle === 'round') {
        ctx.beginPath();
        ctx.arc(centerX, centerY, qrSize / 2 + 40, 0, Math.PI * 2);
        ctx.fill();
      } else if (frameStyle === 'heart') {
        const heartWidth = qrSize + 80;
        const heartHeight = qrSize + 80;
        const topCurveHeight = heartHeight * 0.3;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - heartHeight / 2 + topCurveHeight);
        // Left top curve
        ctx.bezierCurveTo(
          centerX, centerY - heartHeight / 2,
          centerX - heartWidth / 2, centerY - heartHeight / 2,
          centerX - heartWidth / 2, centerY - heartHeight / 2 + topCurveHeight
        );
        // Left bottom curve
        ctx.bezierCurveTo(
          centerX - heartWidth / 2, centerY,
          centerX, centerY + heartHeight / 3,
          centerX, centerY + heartHeight / 2
        );
        // Right bottom curve
        ctx.bezierCurveTo(
          centerX, centerY + heartHeight / 3,
          centerX + heartWidth / 2, centerY,
          centerX + heartWidth / 2, centerY - heartHeight / 2 + topCurveHeight
        );
        // Right top curve
        ctx.bezierCurveTo(
          centerX + heartWidth / 2, centerY - heartHeight / 2,
          centerX, centerY - heartHeight / 2,
          centerX, centerY - heartHeight / 2 + topCurveHeight
        );
        ctx.fill();
      } else if (frameStyle === 'badge') {
        const badgeSize = qrSize + 80;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - badgeSize / 2);
        for (let i = 0; i < 16; i++) {
          const angle = (i * Math.PI * 2) / 16 - Math.PI / 2;
          const radius = i % 2 === 0 ? badgeSize / 2 : badgeSize / 2.2;
          ctx.lineTo(
            centerX + radius * Math.cos(angle),
            centerY + radius * Math.sin(angle)
          );
        }
        ctx.closePath();
        ctx.fill();
      } else if (frameStyle === 'square') {
        const squareSize = qrSize + 80;
        const cornerRadius = 15;
        ctx.beginPath();
        ctx.roundRect(
          centerX - squareSize / 2,
          centerY - squareSize / 2,
          squareSize,
          squareSize,
          cornerRadius
        );
        ctx.fill();
      } else if (frameStyle === 'diamond') {
        const diamondSize = qrSize + 80;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(Math.PI / 4);
        const cornerRadius = 15;
        ctx.beginPath();
        ctx.roundRect(-diamondSize / 2, -diamondSize / 2, diamondSize, diamondSize, cornerRadius);
        ctx.fill();
        ctx.restore();
      } else if (frameStyle === 'star') {
        const starSize = qrSize + 90;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          const radius = i % 2 === 0 ? starSize / 2 : starSize / 4;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw white background for QR code
    ctx.fillStyle = bgColor;
    const qrPadding = 15;
    ctx.beginPath();
    ctx.roundRect(
      centerX - qrSize / 2 - qrPadding,
      centerY - qrSize / 2 - qrPadding,
      qrSize + qrPadding * 2,
      qrSize + qrPadding * 2,
      10
    );
    ctx.fill();

    // Draw QR code from the preview canvas
    ctx.drawImage(qrCanvas, centerX - qrSize / 2, centerY - qrSize / 2, qrSize, qrSize);

    // Draw frame text
    if (frameName || title) {
      ctx.fillStyle = frameStyle !== 'none' ? '#333333' : '#000000';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(frameName || title, centerX, height - 30);
    }

    // Download
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = ctx.canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <Container className="py-5">
      <Row>
        <Col lg={7}>
          <Card className="shadow-lg border-0 mb-4 fade-in">
            <Card.Body className="p-4">
              <h3 className="gradient-text mb-4">Create Your QR Code</h3>

              <Tabs defaultActiveKey="content" className="mb-4">
                <Tab eventKey="content" title="📝 Content">
                  <Form.Group className="mb-3">
                    <Form.Label>Destination URL *</Form.Label>
                    <Form.Control
                      type="url"
                      placeholder="https://example.com"
                      value={destinationUrl}
                      onChange={(e) => setDestinationUrl(e.target.value)}
                      required
                    />
                    <Form.Text className="text-muted">
                      The URL where users will be redirected after scanning
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>QR Code Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="My QR Code"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Add a description for your QR code"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                </Tab>

                <Tab eventKey="style" title="🎨 Style">
                  <Form.Group className="mb-3">
                    <Form.Label>Color Presets</Form.Label>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {colorPresets.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setFgColor(preset.fg);
                            setBgColor(preset.bg);
                          }}
                          style={{
                            background: `linear-gradient(135deg, ${preset.fg}, ${preset.bg})`,
                            color: 'white',
                            border: 'none',
                          }}
                        >
                          {preset.name}
                        </Button>
                      ))}
                    </div>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Foreground Color</Form.Label>
                        <div className="d-flex align-items-center gap-2">
                          <Form.Control
                            type="color"
                            value={fgColor}
                            onChange={(e) => setFgColor(e.target.value)}
                            style={{ width: '60px', height: '40px' }}
                          />
                          <Form.Control
                            type="text"
                            value={fgColor}
                            onChange={(e) => setFgColor(e.target.value)}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Background Color</Form.Label>
                        <div className="d-flex align-items-center gap-2">
                          <Form.Control
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            style={{ width: '60px', height: '40px' }}
                          />
                          <Form.Control
                            type="text"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>QR Pattern</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {patterns.map((pattern) => (
                        <Button
                          key={pattern.id}
                          variant={qrStyle === pattern.id ? 'primary' : 'outline-secondary'}
                          onClick={() => setQrStyle(pattern.id as any)}
                          style={{ minWidth: '80px' }}
                        >
                          <div style={{ fontSize: '20px' }}>{pattern.preview}</div>
                          <div style={{ fontSize: '12px' }}>{pattern.name}</div>
                        </Button>
                      ))}
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Size: {size}px</Form.Label>
                    <Form.Range
                      min="128"
                      max="512"
                      step="32"
                      value={size}
                      onChange={(e) => setSize(parseInt(e.target.value))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Error Correction Level</Form.Label>
                    <Form.Select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Higher levels allow the QR code to be read even if partially damaged
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Include Margin"
                      checked={includeMargin}
                      onChange={(e) => setIncludeMargin(e.target.checked)}
                    />
                  </Form.Group>
                </Tab>

                <Tab eventKey="frame" title="🖼️ Frame">
                  <Form.Group className="mb-3">
                    <Form.Label>Frame Style</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {frames.map((frame) => (
                        <Button
                          key={frame.id}
                          variant={frameStyle === frame.id ? 'primary' : 'outline-secondary'}
                          onClick={() => setFrameStyle(frame.id)}
                          style={{ minWidth: '100px' }}
                        >
                          <div style={{ fontSize: '24px' }}>{frame.preview}</div>
                          <div style={{ fontSize: '12px' }}>{frame.name}</div>
                        </Button>
                      ))}
                    </div>
                  </Form.Group>

                  {frameStyle !== 'none' && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Frame Color</Form.Label>
                        <div className="d-flex align-items-center gap-2">
                          <Form.Control
                            type="color"
                            value={frameColor}
                            onChange={(e) => setFrameColor(e.target.value)}
                            style={{ width: '60px', height: '40px' }}
                          />
                          <Form.Control
                            type="text"
                            value={frameColor}
                            onChange={(e) => setFrameColor(e.target.value)}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Frame Text (Optional)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Scan Me!"
                          value={frameName}
                          onChange={(e) => setFrameName(e.target.value)}
                        />
                      </Form.Group>
                    </>
                  )}
                </Tab>

                <Tab eventKey="logo" title="🖼️ Logo">
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Logo (Optional)</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleLogoUpload} />
                    <Form.Text className="text-muted">
                      Add your logo to the center of the QR code. Recommended size: 40x40px
                    </Form.Text>
                  </Form.Group>

                  {logo && (
                    <div className="text-center">
                      <img
                        src={logo}
                        alt="Logo preview"
                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                      />
                      <div className="mt-2">
                        <Button variant="danger" size="sm" onClick={() => setLogo(null)}>
                          Remove Logo
                        </Button>
                      </div>
                    </div>
                  )}
                </Tab>
              </Tabs>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={generateQRCode}
                  disabled={loading || !destinationUrl}
                >
                  {loading ? 'Creating...' : '✨ Generate Dynamic QR Code'}
                </Button>
                <Button variant="outline-secondary" size="lg" onClick={downloadQRCode}>
                  ⬇️ Download Preview
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className="shadow-lg border-0 sticky-top" style={{ top: '20px' }}>
            <Card.Body className="p-4">
              <h4 className="text-center mb-4">Live Preview</h4>
              <div className="qr-preview-container text-center" ref={qrRef}>
                {frameStyle === 'none' ? (
                  <div style={{ display: 'inline-block' }}>
                    <CustomQRCode
                      value={destinationUrl || 'https://example.com'}
                      size={Math.min(size, 200)}
                      bgColor={bgColor}
                      fgColor={fgColor}
                      level={level}
                      includeMargin={includeMargin}
                      qrStyle={qrStyle}
                      logo={logo || undefined}
                    />
                  </div>
                ) : (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <svg
                      width="300"
                      height="320"
                      viewBox="0 0 300 320"
                      style={{ display: 'block' }}
                    >
                      {/* Frame shapes */}
                      {frameStyle === 'round' && (
                        <circle cx="150" cy="140" r="130" fill={frameColor} />
                      )}
                      {frameStyle === 'heart' && (
                        <path
                          d="M150,260 C150,260 40,180 40,110 C40,70 60,40 90,40 C110,40 130,50 150,70 C170,50 190,40 210,40 C240,40 260,70 260,110 C260,180 150,260 150,260 Z"
                          fill={frameColor}
                        />
                      )}
                      {frameStyle === 'badge' && (
                        <path
                          d="M150,20 L170,50 L205,40 L215,75 L250,80 L245,115 L275,135 L250,160 L245,195 L210,200 L200,235 L165,225 L150,260 L135,225 L100,235 L90,200 L55,195 L50,160 L25,135 L50,115 L45,80 L80,75 L90,40 L125,50 Z"
                          fill={frameColor}
                        />
                      )}
                      {frameStyle === 'square' && (
                        <rect x="30" y="30" width="240" height="240" rx="15" fill={frameColor} />
                      )}
                      {frameStyle === 'diamond' && (
                        <rect
                          x="80"
                          y="80"
                          width="180"
                          height="180"
                          rx="10"
                          fill={frameColor}
                          transform="rotate(45 150 140)"
                        />
                      )}
                      {frameStyle === 'star' && (
                        <path
                          d="M150,20 L175,95 L255,95 L190,145 L215,220 L150,175 L85,220 L110,145 L45,95 L125,95 Z"
                          fill={frameColor}
                        />
                      )}
                      
                      {/* White background for QR code */}
                      <rect
                        x="65"
                        y="55"
                        width="170"
                        height="170"
                        rx="8"
                        fill={bgColor}
                      />
                      
                      {/* QR Code positioned in center */}
                      <foreignObject x="75" y="65" width="150" height="150">
                        <div style={{ width: '150px', height: '150px' }}>
                          <CustomQRCode
                            value={destinationUrl || 'https://example.com'}
                            size={150}
                            bgColor={bgColor}
                            fgColor={fgColor}
                            level={level}
                            includeMargin={includeMargin}
                            qrStyle={qrStyle}
                            logo={logo || undefined}
                          />
                        </div>
                      </foreignObject>
                      
                      {/* Frame text */}
                      {frameName && (
                        <text
                          x="150"
                          y="295"
                          textAnchor="middle"
                          fill="#333"
                          fontSize="18"
                          fontWeight="bold"
                        >
                          {frameName}
                        </text>
                      )}
                    </svg>
                  </div>
                )}
              </div>
              <div className="text-center mt-3 text-muted">
                <small>Customize your QR code on the left</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QRCodeGenerator;

