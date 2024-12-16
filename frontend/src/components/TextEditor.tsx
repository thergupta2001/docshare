import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:8080");

function TextEditor() {
  const { roomId } = useParams<{ roomId: string }>();

  // const [bold, setBold] = useState<boolean>(false);
  // const [italics, setItalics] = useState<boolean>(false);
  // const [underline, setUnderline] = useState<boolean>(false);
  const [userFormats, setUserFormats] = useState({
    bold: false,
    italic: false,
    underline: false
  });
  const editorRef = useRef<HTMLDivElement>(null);

  const formatArray = [
    { key: "bold", symbol: "B" },
    { key: "italic", symbol: "I" },
    { key: "underline", symbol: "U" }
  ]

  const handleCommand = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command);
    syncFormatState();

    const htmlContent = editorRef.current?.innerHTML || "";
    socket.emit("text-update", { roomId, htmlContent });

    // console.log(userFormats);
  };

  const syncFormatState = () => {
    setUserFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline")
    });
  };

  const handleInput = () => {
    if (editorRef.current) {
      const htmlContent = editorRef.current.innerHTML;
      socket.emit("text-update", { roomId, htmlContent });
    }

    // console.log(userFormats);
  }

  useEffect(() => {
    if (roomId) {
      socket.emit("join-room", roomId);

      socket.on("initialize-content", (htmlContent: string) => {
        if (editorRef.current) {
          editorRef.current.innerHTML = htmlContent;
        }
      });

      socket.on("text-update", (data: { htmlContent: string; source: string }) => {
        if (data.source !== socket.id && editorRef.current) {
          editorRef.current.innerHTML = data.htmlContent;
        }
      });
    }

    return () => {
      socket.off("initialize-content");
      socket.off("text-update");
      console.log(userFormats);
    };
  }, [roomId, userFormats]);

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
                key={formatOption.key}
                className={`px-4 py-2 rounded text-xl hover:bg-gray-200`}
                onClick={() => {
                  handleCommand(formatOption.key);
                }}
              >
                {formatOption.symbol == "B" ? <b>{formatOption.symbol}</b> : formatOption.symbol == "I" ? <i>{formatOption.symbol}</i> : <u>{formatOption.symbol}</u>}
              </button>
            ))
          }
          {/* <select
            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded"
            onChange={(e) => handleCommand("fontSize", e.target.value)}
            defaultValue="3"
          >
            <option value="1">Small</option>
            <option value="3">Normal</option>
            <option value="5">Large</option>
            <option value="7">Huge</option>
          </select> */}
        </div>
      </div>

      <div
        ref={editorRef}
        onInput={handleInput}
        contentEditable
        className="w-full h-[calc(100vh-64px)] p-4 border-t border-gray-300 focus:outline-none text-lg bg-white overflow-auto"
      ></div>
    </div>
  );
}

export default TextEditor;
