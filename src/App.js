import React, { useState, useEffect } from "react";
import { EditorState, Modifier } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./App.css";
import replaceBlockText from "./utils/replaceBlockText";
import updateDataForBlock from "./utils/updateDataForBlock";

const App = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [convertedContent, setConvertedContent] = useState(null);

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  };

  const blockRendererFn = (block) => {
    console.log("blockRendererFn");
  };

  const convertContentToHTML = () => {
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  };

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  useEffect(() => {
    console.log("RENDER");
  });

  const logState = () => {
    console.log(editorState.toJS());
  };
  const addEmoji = () => {
    const newContentState = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      "🙂"
    );

    const newState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters"
    );

    setEditorState(newState);
  };

  const handleReplaceBlockText = () => {
    const block = editorState.getCurrentContent().getBlockMap().last();

    let updatedEditorState = editorState;

    updatedEditorState = replaceBlockText(
      updatedEditorState,
      block.getKey(),
      `${Math.random()}`,
      { isInputFieldBlock: false }
    );

    setEditorState(updatedEditorState);
  };

  const handleUpdateDataForBlock = () => {
    const block = editorState.getCurrentContent().getBlockMap().last();

    let updatedEditorState = editorState;

    updatedEditorState = updateDataForBlock(
      updatedEditorState,
      block.getKey(),
      {
        value: `${Math.random()}`,
        isValid: true,
      }
    );

    setEditorState(updatedEditorState);
  };

  return (
    <div className="App">
      <header className="App-header">Rich Text Editor Example</header>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        blockRendererFn={blockRendererFn}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
      <div onClick={logState}>Log State</div>
      <div onClick={addEmoji}>AddEmoji</div>
      <div onClick={handleReplaceBlockText}>ReplaceBlockText</div>
      <div onClick={handleUpdateDataForBlock}>UpdateDataForBlock</div>
    </div>
  );
};

export default App;
