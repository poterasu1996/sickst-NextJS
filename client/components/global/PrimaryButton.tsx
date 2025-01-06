import Button, { ButtonProps } from '@mui/material/Button';

type Props = ButtonProps & {
    children: React.ReactNode
}

const PrimaryButton = ({ children, ...props }: Props) => {
    return(
        <Button
            sx={{
                display: 'block',
                width: '100%',
                padding: '0 20px',
                fontSize: '1.8rem',
                lineHeight: '5.4rem',
                fontWeight: '600',
                textAlign: 'center',
                borderRadius: 0,
                textTransform: 'none'
            }} 
            variant='contained' 
            {...props}
        >{children}</Button>
    )
}

export default PrimaryButton;