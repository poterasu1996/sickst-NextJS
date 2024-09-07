import Button, { ButtonProps } from '@mui/material/Button';

type Props = ButtonProps & {
    children: React.ReactNode
}

const primary = '#cc3633';

const SecondaryButton = ({ children, ...props }: Props) => {
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
                textTransform: 'none',
                color: primary,
                backgroundColor: '#fff',
                border: `solid 1px ${primary}`,
                boxShadow: 'none',
                '&:hover': {
                    color: '#fff',
                    backgroundColor: primary
                }
            }} 
            variant='contained' 
            {...props}
        >{children}</Button>
    )
}

export default SecondaryButton;