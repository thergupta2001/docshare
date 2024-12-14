import { useRef, useState } from "react";

function TextEditor() {
  const [bold, setBold] = useState<boolean>(false);
  const [italics, setItalics] = useState<boolean>(false);
  const [underline, setUnderline] = useState<boolean>(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const formatArray = [
    {
      key: "bold",
      value: bold,
      symbol: "B"
    },
    {
      key: "italic",
      value: italics,
      symbol: "I"
    },
    {
      key: "underline",
      value: underline,
      symbol: "U"
    }
  ]

  const handleCommand = (command: string, value: string = "") => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncFormatState();
  };

  const syncFormatState = () => {
    setBold(document.queryCommandState("bold"));
    setItalics(document.queryCommandState("italic"));
    setUnderline(document.queryCommandState("underline"));
  };

  return (
    <div className="w-full h-screen bg-gray-100">
      <div className="flex justify-between items-center gap-2 p-4 bg-white shadow-lg w-full">
        <div className="text-3xl font-bold text-gray-800">
          DocShare
        </div>
        <div className="flex items-center gap-2">
          {
            formatArray.map((formatOption) => (
              <button
                key={formatOption.symbol}
                className={`px-4 py-2 rounded text-xl hover:bg-gray-200 ${formatOption.value
                  ? "bg-gray-300 text-black underline"
                  : "bg-gray-50 text-black"
                  }`}
                onClick={() => {
                  handleCommand(formatOption.key);
                }}
              >
                {formatOption.symbol == "B" ? <b>{formatOption.symbol}</b> : formatOption.symbol == "I" ? <i>{formatOption.symbol}</i> : <u>{formatOption.symbol}</u>}
              </button>
            ))
          }
          <select
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded"
            onChange={(e) => handleCommand("fontSize", e.target.value)}
            defaultValue="3"
          >
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select>
        </div>
      </div>

      <div
        contentEditable
        className="w-full h-[calc(100vh-64px)] p-4 border-t border-gray-300 focus:outline-none text-lg bg-white overflow-auto"
      ></div>
    </div>
  );
}

export default TextEditor;


