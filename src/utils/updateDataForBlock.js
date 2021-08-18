import { EditorState, SelectionState } from "draft-js";
import modifyBlockForContentState from "draft-js/lib/modifyBlockForContentState";
import _ from "lodash";

function updateDataForBlock(editorState, blockKey, data) {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();

  const insertionTarget = SelectionState.createEmpty(blockKey);

  // We use `modifyBlockForContentState` to ensure native JS objects are not
  // transformed to Immutable.js maps.
  const newContentState = modifyBlockForContentState(
    contentState,
    insertionTarget,
    (block) => {
      let updatedBlock = block;

      _.forEach(data, (value, key) => {
        const isBlank = value === null || value === undefined;

        if (isBlank) {
          updatedBlock = updatedBlock.deleteIn(["data", key]);
        } else {
          updatedBlock = updatedBlock.setIn(["data", key], value);
        }
      });

      return updatedBlock;
    }
  );

  let newEditorState = EditorState.push(
    editorState,
    newContentState,
    "change-block-data"
  );

  newEditorState = EditorState.acceptSelection(newEditorState, selection);

  return newEditorState;
}

export default updateDataForBlock;
