import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clipPath: 'inset(50%)',
  fontSize: '1.8rem',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  color: 'black',
  height: 1,
  bottom: 0,
  left: 0,
  width: 1,
});

const InputFileUpload = (props: any) => {
    const { className, error } = props;

  return (
    <>
        <div className={`flex items-center ${className}`}>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon sx={{ color: 'white'}}/>}
                sx={[
                    {':hover': {backgroundColor: '#d24f4d'}},
                    {
                    fontSize: '1.2rem',
                    lineHeight: '2.2rem',
                    padding: '1rem 2.5rem',
                    backgroundColor: '#cc3633',
                    boxShadow: 'none',
                    border: 'solid 1px #cc3633',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderRadius: '0'
                }]}
            >
                Upload file
                <VisuallyHiddenInput 
                    type="file" 
                    id='file-input' 
                    {...props} 
                />
            </Button>
            <span id='file-name' className='input-file-name' style={{
                display: 'flex',
                textTransform: 'none',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                lineHeight: '4rem',
                color: '#959ba6',
                paddingLeft: '2rem',
                width: '75%',
                height: '44px',
                border: 'solid 1px #ced4da',
                borderLeft: 'none',
                borderRadius: '0 .25rem .25rem 0'
            }}>No file chosen</span>
        </div>
        <div className="invalid-file">{error}</div>
    </>
  );
}

export default InputFileUpload;
