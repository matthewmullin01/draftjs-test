import { EditorState } from "draft-js";
import replaceInputFieldText from "./replaceInputFieldText";
import { SelectionState, Modifier } from "draft-js";

function _replaceBlockText(contentState, blockKey, text) {
  const block = contentState.getBlockForKey(blockKey);

  let insertionTarget = SelectionState.createEmpty(blockKey);
  insertionTarget = insertionTarget.set(
    "focusOffset",
    block.get("text").length
  );

  const newContentState = Modifier.replaceText(
    contentState,
    insertionTarget,
    text
  );

  return newContentState;
}

function replaceBlockText(editorState, blockKey, text, options = {}) {
  const contentState = editorState.getCurrentContent();
  let newContentState = options.isInputFieldBlock
    ? replaceInputFieldText(contentState, blockKey, text)
    : _replaceBlockText(contentState, blockKey, text);

  if (editorState.getSelection().getFocusKey() !== blockKey) {
    // We're replacing text in a different block than the current selection.
    // Ensure we don't mess with the selection state.
    newContentState = newContentState.merge({
      selectionBefore: editorState.getSelection(),
      selectionAfter: editorState.getSelection(),
    });
  }

  return EditorState.push(editorState, newContentState, "insert-characters");
}

export default replaceBlockText;
