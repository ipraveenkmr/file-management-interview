import React, { useState, useRef } from "react";
import { FiUploadCloud } from "react-icons/fi";

export default function FileUpload({ onUpload }) {
    const [file, setFile] = useState(null);
    const hiddenFileInput = useRef(null);

    const handleUpload = async () => {
        if (file) {
            try {
                onUpload(file)
                setFile(null);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    return (
        <div className="flex justify-center mt-4">
            <div>
                <div
                    onClick={handleClick}
                    className="flex justify-center cursor-pointer mx-3 mb-1"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    <div className="border-2 border-blue-500 border-dashed rounded-lg p-8 md:min-w-[600px]">
                        <div>
                            <div className="flex justify-center">
                                <FiUploadCloud style={{ color: 'blue', fontSize: '30px' }} />
                                <input
                                    type="file"
                                    accept=".txt"
                                    onChange={handleFileChange}
                                    className="mb-3 border p-2"
                                    ref={hiddenFileInput}
                                    data-testid="file-input"
                                    style={{ display: 'none' }}
                                />
                            </div>
                            {file ? (
                                <p className="text-gray-500 text-md mx-10 mt-3 text-center">
                                    <span className="text-blue-700">{file?.name}</span>
                                </p>
                            ) : (
                                <p className="text-gray-500 text-md mx-10 mt-3 text-center">
                                    Drag your document here,
                                    <span className="text-blue-700">or browse your files</span>
                                </p>
                            )}
                            <div className="flex justify-center">
                                <div>
                                    <p className="text-gray-500 text-sm mx-10 text-center mb-4">Supported format .txt</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-2">
                    <button
                        onClick={() => handleUpload()}
                        className={`px-4 py-1 text-center rounded-md max-w-[100px] 
      ${file ? 'bg-blue-600 text-white hover:bg-blue-400 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        disabled={!file}
                    >
                        Upload
                    </button>
                </div>
            </div>
        </div>
    );

}
