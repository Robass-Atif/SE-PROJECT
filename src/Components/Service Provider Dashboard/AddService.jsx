import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";

const AddServiceMultiStepForm = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    serviceTitle: "",
    serviceCategory: "",
    servicePrice: "",
    deliveryTime: "",
    serviceDescription: "",
    coverImage: null,
    additionalFeatures: "",
    revisionCount: 1,
    serviceKeywords: "",
    serviceTags: "",
    serviceLocation: "",
    availabilityStart: "",
    availabilityEnd: "",
    detailedPricing: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      coverImage: e.target.files[0],
    });
  };

  const nextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Define the mutation using TanStack Query
  const mutation = useMutation({
    mutationFn: async (newService) => {
      for (const [key, value] of newService.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await fetch("http://localhost:8080/serviceProvider/add-service", {
        method: "POST",
        body: newService, // Send FormData directly
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: () => {
      alert("Service added successfully!");
      // Optionally reset form or navigate
    },
    onError: (error) => {
      console.error("Error adding service:", error);
      alert("Failed to add service.");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send to the backend using FormData
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.serviceTitle);
    formDataToSend.append("category", formData.serviceCategory);
    formDataToSend.append("price", formData.servicePrice);
    formDataToSend.append("delivery_time", formData.deliveryTime);
    formDataToSend.append("description", formData.serviceDescription);
    formDataToSend.append("service_images", formData.coverImage);
    const userId = "66f2c46b560c53a133c31df9"; // Replace with your hardcoded user ID
    formDataToSend.append("user_id", userId); // Include the userId in the request data

    // Use the mutation to send data
    mutation.mutate(formDataToSend);
    console.log("Form Data Submitted:", formData);
    // Submit logic without alert
  };

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Add New Service
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Service Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="serviceTitle" className="block text-gray-700 font-medium mb-2">
                  Service Title
                </label>
                <input
                  type="text"
                  id="serviceTitle"
                  name="serviceTitle"
                  value={formData.serviceTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  placeholder="Enter service title"
                />
              </div>

              <div>
                <label htmlFor="serviceCategory" className="block text-gray-700 font-medium mb-2">
                  Service Category
                </label>
                <select
                  id="serviceCategory"
                  name="serviceCategory"
                  value={formData.serviceCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                >
                  <option value="">Select Category</option>
                  <option value="webDevelopment">Web Development</option>
                  <option value="graphicDesign">Graphic Design</option>
                  <option value="seo">SEO</option>
                  <option value="contentWriting">Content Writing</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Pricing Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="servicePrice" className="block text-gray-700 font-medium mb-2">
                  Service Price (USD)
                </label>
                <input
                  type="number"
                  id="servicePrice"
                  name="servicePrice"
                  value={formData.servicePrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  placeholder="Enter service price"
                />
              </div>

              <div>
                <label htmlFor="deliveryTime" className="block text-gray-700 font-medium mb-2">
                  Delivery Time (Days)
                </label>
                <input
                  type="number"
                  id="deliveryTime"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  placeholder="Enter delivery time in days"
                />
              </div>

              <div>
                <label htmlFor="detailedPricing" className="block text-gray-700 font-medium mb-2">
                  Detailed Pricing (Optional)
                </label>
                <textarea
                  id="detailedPricing"
                  name="detailedPricing"
                  value={formData.detailedPricing}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  rows="3"
                  placeholder="Enter detailed pricing options if any"
                />
              </div>
            </div>
          )}

          {/* Step 3: Service Description */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="serviceDescription" className="block text-gray-700 font-medium mb-2">
                  Service Description
                </label>
                <textarea
                  id="serviceDescription"
                  name="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  rows="4"
                  placeholder="Enter service description"
                />
              </div>

              <div>
                <label htmlFor="additionalFeatures" className="block text-gray-700 font-medium mb-2">
                  Additional Features (Optional)
                </label>
                <textarea
                  id="additionalFeatures"
                  name="additionalFeatures"
                  value={formData.additionalFeatures}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  rows="3"
                  placeholder="Enter additional features (if any)"
                />
              </div>
            </div>
          )}

          {/* Step 4: Keywords and Tags */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="serviceKeywords" className="block text-gray-700 font-medium mb-2">
                  Service Keywords
                </label>
                <input
                  type="text"
                  id="serviceKeywords"
                  name="serviceKeywords"
                  value={formData.serviceKeywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  placeholder="Enter relevant keywords"
                />
              </div>

              <div>
                <label htmlFor="serviceTags" className="block text-gray-700 font-medium mb-2">
                  Service Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  id="serviceTags"
                  name="serviceTags"
                  value={formData.serviceTags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
          )}

          {/* Step 5: Location and Availability */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="serviceLocation" className="block text-gray-700 font-medium mb-2">
                  Service Location
                </label>
                <input
                  type="text"
                  id="serviceLocation"
                  name="serviceLocation"
                  value={formData.serviceLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                  placeholder="Enter service location"
                />
              </div>

              <div>
                <label htmlFor="availabilityStart" className="block text-gray-700 font-medium mb-2">
                  Availability Start Time
                </label>
                <input
                  type="time"
                  id="availabilityStart"
                  name="availabilityStart"
                  value={formData.availabilityStart}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="availabilityEnd" className="block text-gray-700 font-medium mb-2">
                  Availability End Time
                </label>
                <input
                  type="time"
                  id="availabilityEnd"
                  name="availabilityEnd"
                  value={formData.availabilityEnd}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Step 6: Cover Image Upload */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="coverImage" className="block text-gray-700 font-medium mb-2">
                  Upload Cover Image
                </label>
                <input
                  type="file"
                  id="coverImage"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md"
              >
                Previous
              </button>
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceMultiStepForm;
