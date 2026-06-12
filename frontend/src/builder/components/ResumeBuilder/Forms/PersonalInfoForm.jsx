"use client";

import PropTypes from "prop-types";
import { Input } from "../../ui/Input.jsx";
import { Label } from "../../ui/Label.jsx";
import { useState } from "react";
import CropModal from "@/builder/modal/CropModal.jsx";

export function PersonalInfoForm({ data = {}, onUpdate = () => {} }) {
  const [openCropModal, setOpenCropModal] = useState(false);

  const handleCropSave = (croppedImage) => {
    handleChange("profilePhoto", {
      ...data.profilePhoto,
      url: croppedImage,
    });

    setOpenCropModal(false);
  };

  const handleChange = (field, value) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      handleChange("profilePhoto", {
        name: file.name,
        url: reader.result, // Base64 image
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <div className="space-y-2">
        <Label
          htmlFor="profilePhoto"
          className="text-gray-700 dark:text-gray-300"
        >
          Profile Photo
        </Label>
        <div className="flex gap-4 items-center">
          <Input
            id="profilePhoto"
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            className="bg-muted/30 dark:bg-gray-800 w-[50%] text-gray-800 dark:text-gray-100"
          />
          {data.profilePhoto?.url && (
            <img
              src={data.profilePhoto.url}
              alt="Profile"
              onClick={() => setOpenCropModal(true)}
              className="w-12 h-12 object-cover bg-cover rounded-full border border-gray-300 cursor-pointer"
            />
          )}
          <CropModal
            isOpen={openCropModal}
            onClose={() => setOpenCropModal(false)}
            image={data.profilePhoto?.url}
            onCropSave={handleCropSave}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="bg-muted/30 text-gray-700 dark:text-gray-300"
            >
              First Name *
            </Label>
            <Input
              id="firstName"
              value={data.firstName || ""}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="Digvijay"
              required
              className="bg-[#fefaf5] dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="bg-muted/30 text-gray-700 dark:text-gray-300"
            >
              Middle Name
            </Label>
            <Input
              id="middleName"
              value={data.middleName || ""}
              onChange={(e) => handleChange("middleName", e.target.value)}
              placeholder="Vikas"
              required
              className="bg-[#fefaf5] dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="text-gray-700 dark:text-gray-300"
            >
              Last Name *
            </Label>
            <Input
              id="lastName"
              value={data.lastName || ""}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="Mane"
              required
              className="bg-[#fefaf5] dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="digvijay.mane@email.com"
              required
              className="bg-[#fefaf5] dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="9322806612"
              required
              className="bg-[#fefaf5] dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Address
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="text-gray-700 dark:text-gray-300"
              >
                City
              </Label>
              <Input
                id="city"
                value={data.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Kolhapur"
                className="bg-[#fefaf5] dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="state"
                className="text-gray-700 dark:text-gray-300"
              >
                State
              </Label>
              <Input
                id="state"
                value={data.state || ""}
                onChange={(e) => handleChange("state", e.target.value)}
                placeholder="Maharastra"
                className="bg-[#fefaf5] dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="zipCode"
                className="text-gray-700 dark:text-gray-300"
              >
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                value={data.zipCode || ""}
                onChange={(e) => handleChange("zipCode", e.target.value)}
                placeholder="416114"
                className="bg-[#fefaf5] dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Online Presence */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Online Presence (Optional)
        </h3>
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="linkedin"
              className="text-gray-700 dark:text-gray-300"
            >
              LinkedIn Profile
            </Label>
            <Input
              id="linkedin"
              value={data.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="linkedin.com/in/digvijay"
              className="bg-[#fefaf5] dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="website"
              className="text-gray-700 dark:text-gray-300"
            >
              Personal Website
            </Label>
            <Input
              id="website"
              value={data.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="website.com"
              className="bg-[#fefaf5] dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

PersonalInfoForm.propTypes = {
  data: PropTypes.shape({
    firstName: PropTypes.string,
    middleName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    zipCode: PropTypes.string,
    linkedin: PropTypes.string,
    website: PropTypes.string,
    profilePhoto: PropTypes.any, // File object for uploaded photo
  }),
  onUpdate: PropTypes.func,
};
