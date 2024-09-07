import { Autocomplete, TextField, AutocompleteProps } from "@mui/material";

interface CustomProps<T> extends Omit<AutocompleteProps<T, boolean, boolean, false>, 'renderInput'> {
    error?: string | undefined,
    label: string,
}

const AutocompleteSelect = <T,>({ error, label, multiple=false, ...autocompleteProps}: CustomProps<T>) => {

    return <>
        <Autocomplete
            {...autocompleteProps}
            className={`custom-autocomplete ${
                error ? "invalid-field" : ""
            }`}
            renderInput={(params) => <TextField 
                {...params} 
                label={label}
                sx={{
                    '.MuiOutlinedInput-root .MuiAutocomplete-input': {
                        'padding': '0',
                        'paddingTop': '3px'
                    },
                    '.MuiFormLabel-root': {
                        'fontSize': '1.8rem',
                        'padding': '0 1.2rem',
                        'top': '-4px', 
                        'fontWeight': 600,
                        'color': '#959ba6'
                    },
                    '.MuiInputBase-root': {
                        'fontSize': '1.8rem',
                        'backgroundColor': '#fff'
                    },
                    '.MuiInputBase-root fieldset': {
                        'borderColor': '#ced4da'
                    },
                    '.MuiInputBase-root:hover fieldset': {
                        'borderColor': '#ced4da',
                    },
                    '.MuiInputBase-root fieldset legend': {
                        'marginLeft': '8px'
                    },
                    '.MuiInputBase-root fieldset legend span': {
                        'fontSize': '1.4rem',
                    }
                }} 
            />}
        />
        <div className="invalid-field">{error}</div>
    </>
}

export default AutocompleteSelect