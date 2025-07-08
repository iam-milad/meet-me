import { useState } from 'react';
import { LuCircleCheck, LuCopy } from 'react-icons/lu';

const CopyableText = ({ text }) => {
      const [copied, setCopied] = useState(false);

    const copyTextHandler = () => {
        navigator.clipboard && navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[300px] bg-blue-500 text-white flex justify-between p-3 rounded-b-xl z-20">
        <span className="truncate">{text}</span>
        <button
          onClick={copyTextHandler}
          className="bg-transparent rounded-full cursor-pointer hover:text-gray-100"
        >
          {copied ? <LuCircleCheck size={20} /> : <LuCopy size={20} />}
        </button>
      </div>
    </div>
  );
};

export default CopyableText;
