import { QRCodeSVG } from 'qrcode.react';

const QRCodeDisplay = ({ url, size = 150, agent }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg">
      <QRCodeSVG
        value={url}
        size={size}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
        includeMargin={true}
      />
      {agent && (
        <div className="text-center text-black">
          <p className="font-bold">{agent.name}</p>
          <p className="text-sm text-gray-600">{agent.specialty}</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;
