import React, { useState, useEffect } from "react";
import axios from "axios";

const FileViewer = ({ filename, content, onUpdate }) => {
  const [textAreaContent, setTextAreaContent] = useState(content);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTextAreaContent(content);
  }, [content])


  const handleContentChange = (e) => {
    setTextAreaContent(e.target.value);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Replace the URL with your backend endpoint
      const response = await axios.put("/api/files/update", {
        filename: filename?.filename,
        content: textAreaContent,
      });
      if (onUpdate) {
        onUpdate(response.data); // Notify parent about the update
      }
      alert("Content updated successfully!");
    } catch (error) {
      console.error("Error updating content:", error);
      alert("Failed to update content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 mt-10 bg-gray-100 rounded-lg shadow-md md:max-w-[75vw] md:min-w-[75vw] mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{filename?.filename}</h2>
      <div className="bg-white border border-gray-300 rounded-lg p-4 h-80 overflow-auto">
        <textarea
          className="w-full h-full whitespace-pre-wrap text-sm text-gray-700 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          value={textAreaContent}
          onChange={handleContentChange}
        />
      </div>
      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-4 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default FileViewer;
