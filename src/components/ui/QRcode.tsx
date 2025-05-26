import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeComponentProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  bgColor?: string;
  fgColor?: string;
}

export const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  value,
  size = 200,
  level = 'M',
  includeMargin = true,
  bgColor = '#FFFFFF',
  fgColor = '#000000'
}) => {
  return (
    <div className="qr-code-container">
      <QRCodeCanvas
        value={value}
        size={size}
        level={level}
        includeMargin={includeMargin}
        bgColor={bgColor}
        fgColor={fgColor}
      />
    </div>
  );
};
