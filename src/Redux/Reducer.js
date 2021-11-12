import { DARK, LIGTH, SAVE_NOTE, EDIT_NOTE } from './Type';

const initialState = { theme: false, themeValue: {}, noteValue: [] };

function Reducer(state = initialState, action) {
    switch (action.type) {

    case LIGTH:
        return { 
            ...state,
            theme: false,
            themeValue: action.value, 
        }
    case DARK:
        return { 
            ...state,
            theme: true, 
            themeValue: action.value,
        }
    case SAVE_NOTE: 
        const noteValueIndex = state.noteValue.findIndex((item) => 
            item.title === action.value.title && item.text === action.value.text);
        if(noteValueIndex !== -1) {
            return {
                ...state,
                noteValue: state.noteValue.filter((item, index) => index !== noteValueIndex),
            };
        } else {
            return {
                ...state,
                noteValue: [...state.noteValue, action.value]
            };
        }
    case EDIT_NOTE:
        const noteValueEdit = state.noteValue.findIndex((item) => 
            item === action.value.editIem);

        if(noteValueEdit !== 1) {
            const newArr = state.noteValue.filter((item, index) => index !== noteValueEdit);
            newArr.push(action.value);
            return {
                ...state,
                noteValue: newArr,
            }
        }
    default:
        return state
    }
};

export default Reducer;