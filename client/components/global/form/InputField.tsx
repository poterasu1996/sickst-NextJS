import { TextField } from "@mui/material";


const InputField = (props: any) => {

    return (<>
        <TextField 
            sx={{
                'label+ .MuiInput-underline': {
                    marginTop: '0px'
                },
                ' .MuiFormLabel-root': {
                    fontSize: '1.8rem',
                    lineHeight: '0.9em',
                    padding: '0 1rem',
                    fontWeight: '600',
                    color: '#959ba6'
                },
                '.MuiInputBase-root': {
                    padding: '.7rem',
                    borderRadius: '.25rem',
                    border: 'unset'
                },
                '.MuiInputBase-root:hover:not(.Mui-disabled, .Mui-error):before': {
                    borderBottom: '2px solid #cc3633',
                },
                '.MuiInputBase-root .MuiInputBase-input': {
                    fontSize: '1.8rem',
                    fontWeight: '400',
                    padding: '0.55rem .4rem 0 .6rem'
                },
                '.MuiInputBase-root .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #ced4da'
                },
                '.MuiInputBase-root .MuiOutlinedInput-notchedOutline legend': {
                    fontSize: '1.3rem',
                    margin: '.3rem',
                },
                '.MuiFormHelperText-root': {
                    fontSize: '1.4rem'
                }
            }}
            {...props}
            variant="standard"
        />
    </>);
}

export default InputField;