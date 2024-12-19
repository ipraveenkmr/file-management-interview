import React, { useState } from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { FaFile } from "react-icons/fa";

const FileList = ({ files, onSelect, onDelete, handleSortFile }) => {
  const [isSorted, setIsSorted] = useState(false);

  const sortFileName = () => {
    setIsSorted(!isSorted)
    handleSortFile(!isSorted)
  }

  return (
    <>

      <div className=" mb-4 max-h-[40px] text-center bg-blue-600 text-white p-2 max-w-[60px] rounded-md cursor-pointer" onClick={() => sortFileName()}>
        Sort
      </div>
      <ul className="file-list">
        {files.map((file) => (
          <li key={file.id} className="file-item mb-3">
            <div className="flex items-center">
              <FaFile className="mr-2" />
              <span
                onClick={() => onSelect(file)}
                className="cursor-pointer mr-2"
              >
                {file.filename}
              </span>
              <TiDeleteOutline
                onClick={() => onDelete(file)}
                className="cursor-pointer text-orange-600 text-2xl"
              />
            </div>
          </li>
        ))}
      </ul>

    </>

  );
};

export default FileList;
