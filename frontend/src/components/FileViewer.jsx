import React from "react";

const FileViewer = ({ filename, content }) => {
  return (
    <div className="p-2 mt-10 bg-gray-100 rounded-lg shadow-md md:max-w-[75vw] md:min-w-[75vw] mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{filename?.filename}</h2>
      <div className="bg-white border border-gray-300 rounded-lg p-4 h-80 overflow-auto">
        <pre className="whitespace-pre-wrap text-sm text-gray-700">{content}</pre>
      </div>
    </div>
  );
};

export default FileViewer;
