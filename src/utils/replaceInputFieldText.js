import { SelectionState, Modifier } from 'draft-js';

function replaceInputFieldText(contentState, blockKey, text) {
  const block = contentState.getBlockForKey(blockKey);

  // We insert the entire text first and then remove the old text.
  // We need to do that in order to retain more than one entity
  // in the text.
  const insertionTarget = SelectionState.createEmpty(blockKey);
  const removalTarget = insertionTarget
    .set('focusOffset', block.get('text').length + text.length)
    .set('anchorOffset', text.length);

  const characterList = block.getCharacterList();
  const entities = characterList
    .map(char => char.get('entity'))
    .filter(entity => entity !== null)
    .toSet()
    .sort()
    .toJS();

  const lastEntityIndex = entities.length - 1;
  let newContentState = contentState;

  if (entities.length === 0) {
    newContentState = Modifier.insertText(
      newContentState,
      insertionTarget,
      text
    );
  } else {
    const reversedText = text
      .split('')
      .reverse()
      .join('');

    // We ignore the original entity range and simply retain
    // the entity in one character because for input fields
    // the specific range is not used anywhere to do anything.
    entities.forEach((entity, index) => {
      newContentState = Modifier.insertText(
        newContentState,
        insertionTarget,
        index === lastEntityIndex
          ? text.substring(0, text.length - index)
          : reversedText[index],
        null,
        entity
      );
    });
  }

  newContentState = Modifier.replaceText(newContentState, removalTarget, '');

  return newContentState;
}

export default replaceInputFieldText;
