import { useContext, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import Link from "next/link";
import SideModal from "./global/SideModal";
import AuthContext from "../store/auth-context";
import { Menu, ShoppingCart, User } from "react-feather";
import CartContext from "../store/cart-context";
import { useRouter } from "next/router";
import AccountMobileSideModal from "./global/AccountMobileSideModal";
import AccountContext from "../store/account-context";

const Header = () => {
  const [accountMobileModal, setAccountMobileModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const { cartManager } = useContext(CartContext);
  const { accountManager } = useContext(AccountContext);
  const router = useRouter();

  function logOut() {
    setTimeout(() => {
      localStorage.removeItem("jwt");
      setAuth(null);
      router.push("/");
    }, 700);
  }

  return (
    <header>
      <div className="container header sticky-header">
        <div className="logo">
          <Link href={"/"}>
            {/* <a className='logo-link'>
                            <h1 className='big-s'>S</h1>
                            <div className='sickst'>
                                <h3 className='pt-1'>ickst</h3>
                                <h4 className='pt-2'>&bull;Bucharest&bull;</h4>
                            </div>
                        </a> */}
            <a className="logo-link2">
              <div className="t1">Sickst</div>
              <div className="t2">Bucharest</div>
            </a>
          </Link>
        </div>

        <ul className="nav-menu">
          <li className="nav-link">
            <Link href="/subscription/subscriptions-women">Women</Link>
          </li>
          <li className="nav-link">
            <Link href="/subscription/subscriptions-men">Men</Link>
          </li>
        </ul>

        <div className="right-side">
          {/* { auth && 
                        <Dropdown className='header-dropdown'>
                            <Dropdown.Toggle id="user-account-dd">
                                <User />
                            </Dropdown.Toggle>

                            <Dropdown.Menu className='header-dropdown-menu'>
                                <Dropdown.Item as="button">Item1</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    } */}

          {auth ? (
            // <Link href="/account">
            //     <a className='account'><User /></a>
            // </Link>
            <>
              <Dropdown className="header-dropdown">
                <Dropdown.Toggle id="user-account-dd">
                  <User stroke="#cecece" />
                </Dropdown.Toggle>

                <Dropdown.Menu className="header-dropdown-menu">
                  <Dropdown.Header>Your membership</Dropdown.Header>
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      accountManager.resetStates();
                      accountManager.setHeaderDDLink("membership");
                      router.push("/account");
                    }}
                  >
                    Manage your membership
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      accountManager.resetStates();
                      accountManager.setHeaderDDLink("order_history");
                      router.push("/account");
                    }}
                  >
                    Order tracking & history
                  </Dropdown.Item>
                  <Dropdown.Item 
                    as="button"
                    onClick={() => {
                        accountManager.resetStates();
                        accountManager.setHeaderDDLink("shipping");
                        router.push("/account");
                    }}
                  >
                    Shipping information
                  </Dropdown.Item>
                  <Dropdown.Header>Your account</Dropdown.Header>
                  <Dropdown.Item 
                    as="button"
                    onClick={() => {
                        accountManager.resetStates();
                        accountManager.setHeaderDDLink("personal_details");
                        router.push("/account");
                    }}
                  >
                    Personal details
                  </Dropdown.Item>
                  <Dropdown.Item as="button" onClick={() => logOut()}>
                    Log out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button
                className="account-mobile-btn"
                onClick={() => setAccountMobileModal(true)}
              >
                <User />
              </Button>
              {/* <Link href="/account">
                                <a className='account'><User /></a>
                            </Link> */}
            </>
          ) : (
            <Link href="/account/login">
              <a>Log in</a>
            </Link>
          )}

          <Button variant="menu" onClick={() => setShowModal(true)}>
            {auth ? (
              <div className="shopping-cart">
                <ShoppingCart />{" "}
                {cartManager.cart.length > 0 && (
                  <span className="badge">{cartManager.cart.length}</span>
                )}
              </div>
            ) : (
              <Menu />
            )}
          </Button>

          {/* mobile side modal */}
          {/* <AccountMobileSideModal
            show={accountMobileModal}
            onClick={() => setAccountMobileModal(false)}
          /> */}
          <SideModal show={showModal} onClick={() => setShowModal(false)} />
        </div>
      </div>
      <Button
        variant="menu"
        className="floating-cart"
        onClick={() => setShowModal(true)}
      >
        <div className="shopping-cart">
          <ShoppingCart />{" "}
          {cartManager.cart.length > 0 && (
            <span className="badge">{cartManager.cart.length}</span>
          )}
        </div>
      </Button>
    </header>
  );
};

export default Header;
