import { FaFileExport } from "react-icons/fa";

const AuthHero = () => {
  return (
    <div className="bg-black p-8 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="p-2 mr-2 rounded-sm bg-white">
            <FaFileExport className="text-lg text-blue-600" />
          </span>
          <span className="text-white text-xl font-semibold">
            University File Tracking
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthHero;
