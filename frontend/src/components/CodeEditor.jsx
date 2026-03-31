import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, setCode }) => {
  return (
    <Editor
      height="400px"
      defaultLanguage="python"
      theme="vs-dark"
      value={code}
      onChange={(value) => setCode(value || "")}
      options={{
        minimap: { enabled: false },
        fontSize: 14
      }}
    />
  );
};

export default CodeEditor;