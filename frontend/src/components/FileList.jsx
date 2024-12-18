import React from "react";
import { TiDeleteOutline } from "react-icons/ti";
import { FaFile } from "react-icons/fa";

const FileList = ({ files, onSelect, onDelete }) => {

  return (
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
  );
};

export default FileList;
