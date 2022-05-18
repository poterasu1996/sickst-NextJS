

const Account = () => {
    return(<>
        <div className="main-content">
            <div className="container account-main-body">
                <div className="nav-section">
                    <div className="user-info">
                        <div className="user-avatar"></div>
                        <div className="user-name">Sickst User</div>
                        <div className="joined-date">Joined: <b className="brand-color">21 sept 2021</b></div>
                    </div>
                    <ul className="nav-menu">
                        <li className="nav-link active"><a href="#">Manage subscription</a></li>
                        <li className="nav-link"><a href="#">Order history</a></li>
                        <li className="nav-link"><a href="#">Billing information</a></li>
                        <li className="nav-link"><a href="#">Shipping information</a></li>
                        <li className="nav-link"><a href="#">My reviews</a></li>
                        <li className="nav-link"><a href="#">Rated products</a></li>
                        <li className="nav-link"><a href="#">Personal info</a></li>
                        <li className="nav-link"><a href="#">Reset password</a></li>
                    </ul>
                </div>
                <div className="content">content</div>
            </div>
        </div>
    </>)
}

export default Account;