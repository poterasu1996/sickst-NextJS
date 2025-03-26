import { ReactNode } from "react";

type Props = {
    children: ReactNode
}

const AccountLayout = ({children}: Props) => {
    return (
        <div className="main-content account-page">
            {children}
        </div>
    )
}

export default AccountLayout;