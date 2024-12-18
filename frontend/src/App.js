import React, { useState, useEffect } from "react";
import { getFiles, getFileContent, deleteFile, uploadFile } from "./api";
import FileList from "./components/FileList";
import FileViewer from "./components/FileViewer";
import FileUpload from "./components/FileUpload";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const App = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const data = await getFiles();
      setFiles(data.files);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectFile = async (filename) => {
    const data = await getFileContent(filename);
    setSelectedFile(filename);
    setFileContent(data.content);
  };

  const confirmDeleteFile = async (filename) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to delte this file.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDeleteFile(filename)
        },
        {
          label: 'No',
          // onClick: () => alert('Click No')
        }
      ]
    });

  };

  const handleDeleteFile = async (filename) => {
    try {
      await deleteFile(filename);
      setSelectedFile(null);
      setFileContent("");
      fetchFiles();
    } catch (error) {
      console.error(error);
    }
  }

  const handleUpload = async (file) => {
    if (file) {
      try {
        await uploadFile(file);
        fetchFiles();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="mt-4 flex justify-center">
      <div>
        <h1 className="text-center">File Manager</h1>
        <FileUpload onUpload={handleUpload} />

        {files?.length > 0 && (
          <div className="md:grid md:grid-cols-10 gap-4 h-[50vw] p-4">
            <div className="md:col-span-2">
              <div className="bg-gray-100 p-4 rounded-lg shadow-md overflow-auto pt-5">
                <FileList
                  files={files}
                  onSelect={handleSelectFile}
                  onDelete={confirmDeleteFile}
                />
              </div>
            </div>
            <div className="md:col-span-8">
              {selectedFile ? (
                <div className="bg-gray-100 p-4 rounded-lg shadow-md overflow-auto">
                  <FileViewer filename={selectedFile} content={fileContent} />
                </div>
              ) : (
                <div className="bg-gray-100 p-4 rounded-lg shadow-md overflow-auto min-h-[100px]">
                  <p>Please select file to view content here.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
