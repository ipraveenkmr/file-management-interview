import React, { useState, useEffect } from "react";
import { getFiles, getFileContent, deleteFile, uploadFile } from "./api";
import FileList from "./components/FileList";
import FileViewer from "./components/FileViewer";
import FileUpload from "./components/FileUpload";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from "axios";

const App = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [isSorted, setIsSorted] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSortFile = (val) => {
    console.log('clicked ', val);
    setIsSorted(val)
  }

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // const handlePageChange = (pag) => {
  //   console.log('page clicked ', pag);
  //   setPage(pag)
  // }

  useEffect(() => {
    fetchFiles(isSorted, currentPage);
  }, [isSorted, currentPage]);

  const fetchFiles = async (sorted, page) => {
    try {
      try {
        const response = await fetch(
          `${API_BASE_URL}/documents/files/?isSorted=${sorted}&page=${page}`
        );
        const data = await response.json();
        console.log('response data ', data);
        setFiles(data.files);
        setCurrentPage(data.current_page);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // const fetchFiles = async () => {
  //   try {
  //     try {
  //       const response = await axios.get(`${API_BASE_URL}/documents/files/?isSorted=${isSorted}`);
  //       setFiles(response.data?.files);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
                  handleSortFile={handleSortFile}
                // handlePageChange={handlePageChange}
                />


                <div className="flex items-center justify-center space-x-4 mt-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${currentPage === 1
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    Page <span className="font-bold">{currentPage}</span> of{" "}
                    <span className="font-bold">{totalPages}</span>
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${currentPage === totalPages
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                  >
                    Next
                  </button>
                </div>


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
