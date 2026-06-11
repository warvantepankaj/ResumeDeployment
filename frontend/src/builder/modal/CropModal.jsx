"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";
import PropTypes from "prop-types";

export default function CropModal({ isOpen, onClose, image, onCropSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height,
        );

        resolve(canvas.toDataURL("image/jpeg"));
      };
    });
  };

  const handleSave = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);

    onCropSave(croppedImage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-[700px] rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
        {/* Close */}
        <button onClick={onClose} className="absolute right-4 top-4 text-2xl">
          ×
        </button>

        <h2 className="mb-4 text-xl font-semibold">Crop Profile Photo</h2>

        {/* Cropper */}
        <div
          className="relative w-full"
          style={{
            height: "300px",
          }}
        >
          {image && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={true}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>

        {/* Zoom */}
        {/* <div className="mt-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full"
          />
        </div> */}

        {/* Buttons */}
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={onClose} className="rounded bg-gray-200 px-4 py-2 text-black">
            Cancel
          </button>

          <button
            className="rounded bg-purple-600 px-4 py-2 text-white"
            onClick={handleSave}
          >
            Crop & Save
          </button>
        </div>
      </div>
    </div>
  );
}

CropModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  image: PropTypes.string,
  onCropSave: PropTypes.func.isRequired,
};
