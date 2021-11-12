import { Value } from 'react-native-reanimated';
import { DARK, LIGTH, SAVE_NOTE, EDIT_NOTE } from './Type';

export const darkAction = (val) => {
    return {
        type: DARK,
        value: val
    }
};

export const ligthAction = (val) => {
    return {
        type: LIGTH,
        value: val
    }
};

export const saveNoteAction = (val) => {
    return {
        type: SAVE_NOTE,
        value: val,
    }
}

export const editAction= (val) => {
    return {
        type: EDIT_NOTE,
        value: val,
    }
};