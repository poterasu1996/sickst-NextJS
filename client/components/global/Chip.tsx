

type ChipStatus = 'success' | 'pending' | 'failed' | 'cancel'

interface Props {
    label: string,
    status: ChipStatus
}

const Chip = ({ label, status }: Props) => {
    return (
        <>
            <span className={`chip chip-${status}`}>
                {label}
                <span className={`chip__underlay chip-${status}__underlay`}></span>
            </span>
        </>
    )
}

export default Chip;