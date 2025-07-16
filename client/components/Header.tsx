import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

// Components
import { Menu as MenuIcon, ShoppingCart, User } from "react-feather";
import Button from '@mui/material/Button';
import ListSubheader from '@mui/material/ListSubheader';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Cart from "./global/cart";
import SideModal from "./global/SideModal";
import AccountMobileSideModal from "./global/AccountMobileSideModal";

// publics
import logo from "../public/logo-white.svg";
// import logo from "../public/logo.svg";

// Storage & services
import AuthContext from "../store/auth-context";
import AccountContext from "../store/account-context";

import useGetJWT from "../hooks/auth/useGetJWT";
import SearchInputWithDropdown from "./global/SearchInputWithDropdown";
import { useDebounce } from "../hooks/useDebounce";
import { useSearch } from "../hooks/useSearch";
import { useCart } from "../features/cart/hooks/useCart";
import { AccountTabView } from "../types/account";

const LOGOUT_URL = 'http://localhost:3000/api/v1/logout';

export type ProductOption = {
  id: string;
  name: string;
  image: string;
};

const Header = () => {
  const [accountMobileModal, setAccountMobileModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput);
  const openSubMenu = Boolean(anchorEl);

  const { isAuth, setIsAuth } = useContext(AuthContext);
  const accountManager = useContext(AccountContext);
  const router = useRouter();

  const { cartLength } = useCart();


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleLogOut() {
    const response = await axios.post(LOGOUT_URL);

    handleClose();

    if(response.status === 200) {
      localStorage.getItem('jwt') && localStorage.removeItem('jwt');
      setIsAuth(false);
      router.push("/");
    }
  }

  function addBodyhiddenOverflow() {
    document.body.classList.add("overflow-hidden")
  }

  function removeBodyhiddenOverflow() {
    document.body.classList.remove("overflow-hidden")
  }

  function handleCloseSideModal() {
    setShowModal(false);
  }

  const handleQueryFilter = (query: string) => {
    const encodedQuery = encodeURIComponent(query.trim())
    router.push(
      {
        pathname: router.pathname,
        query: { search: encodedQuery },
      },
      undefined,
      { shallow: false, scroll: false }
    )
  }

  const handleProductRedirect = (product: ProductOption) => {
    router.push(`/product/${product.id}`)
  }

  const handleAccountRedirect = (tabView: AccountTabView) => {
    accountManager!.setAccountPageState(tabView);
    handleClose();
    router.push("/account");
  }

  // dummy data
  const searchSuggestionsDUMMY = [
    "Nike sneakers",
    "Nike hoodie",
    "Adidas tracksuit",
    "Running shoes",
    "Black boots"
  ];
  const productSuggestionsDUMMY = [
    { id: "1", name: "Nike Air Max 90", image: "/nike1.jpg" },
    { id: "2", name: "Nike Blazer Mid", image: "/nike2.jpg" },
    { id: "3", name: "Adidas Ultraboost", image: "/adidas1.jpg" },
    { id: "4", name: "Nike Dri-FIT Tee", image: "/nike3.jpg" },
    { id: "5", name: "Converse Chuck Taylor", image: "/converse.jpg" }
  ];

  const { searchSuggestions, productSuggestions } = useSearch(debouncedSearch);

  return (
    <header className="print">
      <div className="header sticky-header">
        <button
            className="account-mobile-btn"
            onClick={() => {
              addBodyhiddenOverflow();
              setAccountMobileModal(true);
            }}
          >
            <MenuIcon />
        </button>
        <div className="logo">
          <Link href="/shop">
            <a className="logo-link">
              <img src={logo.src}/>
            </a>
          </Link>
        </div>

        <ul className="nav-menu">
          <li className="nav-link">
            <Link href="/shop/shop-for-her">Women</Link>
          </li>
          <li className="nav-link">
            <Link href="/shop/shop-for-him">Men</Link>
          </li>
          <li className="nav-link">
            <Link href="/shop/arrabian">Arrabian</Link>
          </li>
        </ul>
        <SearchInputWithDropdown
          searchSuggestions={searchSuggestions.length > 0 ? searchSuggestions : searchSuggestionsDUMMY}
          productSuggestions={productSuggestions.length > 0 ? productSuggestions : productSuggestionsDUMMY}
          // if clicked on text, add query param as filter in url
          onSearchSelect={handleQueryFilter}
          // if clicked on product, redirect to product 
          onProductSelect={handleProductRedirect}
          onInputChange={(val) => {
            setSearchInput(val);
          }}
        />
        <div className="right-side">
          {isAuth ? (
            <>
              <Button 
                id="user-account-dd"
                aria-controls={openSubMenu ? 'grouped-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openSubMenu ? 'true' : undefined}
                onClick={handleClick}  
              ><User stroke="#cecece" /></Button>
              <Menu
                id="user-account-dd-menu"
                anchorEl={anchorEl}
                open={openSubMenu}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                MenuListProps={{
                  'aria-labelledby': 'user-account-dd',
                }}
              >
                <ListSubheader>Your membership</ListSubheader>
                <MenuItem 
                  onClick={() => handleAccountRedirect("subscription")}
                >Manage your membership</MenuItem>
                <MenuItem 
                  onClick={() => handleAccountRedirect("orderHistory")}
                >Order tracking & history</MenuItem>
                <MenuItem 
                  onClick={() => handleAccountRedirect("shippingInfo")}
                >Shipping information</MenuItem>
                <ListSubheader>Your account</ListSubheader>
                <MenuItem 
                  onClick={() => handleAccountRedirect("personalInfo")}
                >Personal details</MenuItem>
                <MenuItem onClick={handleLogOut}>Log out</MenuItem>
              </Menu>

              <Link href="/account">
                <a className="mobile-user-account"><User /></a>
              </Link>
            </>
          ) : (
            <Link href="/auth/login">
              <a>Log in</a>
            </Link>
          )}
          
          <button 
            className="btn btn-menu"
            onClick={() => setShowModal(true)}
          >
            {isAuth ? (
              <div className="shopping-cart">
                <ShoppingCart />{" "}
                <span className="badge">{cartLength}</span>
              </div>
            ) : (
              <MenuIcon />
            )}
          </button>

          {/* mobile side modal */}
          <AccountMobileSideModal
            show={accountMobileModal}
            onClick={() => {
              setAccountMobileModal(false);
              removeBodyhiddenOverflow();
            }}
          />

          <SideModal
            open={showModal}
            onClose={() => setShowModal(false)}
          >
            {isAuth 
              ? <Cart onClick={handleCloseSideModal} />
              : <>
                 <div className="side-modal-header">
                    <span className="text">Menu</span>
                    <IconButton onClick={handleCloseSideModal} size="medium"><CloseIcon /></IconButton>
                </div>
                 <div className="side-modal-body">
                  <div className="mid-menu">
                      <Link href="#">
                          <a onClick={handleCloseSideModal}>Cum functioneaza</a>
                      </Link>
                      <Link href="#">
                          <a onClick={handleCloseSideModal}>Gifts</a>
                      </Link>
                      <Link href="#">
                          <a onClick={handleCloseSideModal}>Despre noi</a>
                      </Link>
                  </div>
                  
                  <Link href="/account/login">
                      <a className="button-second d-block d-sm-none" onClick={handleCloseSideModal}>Log in</a>
                  </Link>
                  <Link href="/account/register">
                      <a className="button-second mt-24" onClick={handleCloseSideModal}>Autentificare</a>
                  </Link>
              </div>
              </>
            }
          </SideModal>
          
        </div>
      </div>

      <button
        className="floating-cart"
        onClick={() => {
          setShowModal(true);
          addBodyhiddenOverflow();
        }}
      >
        <div className="shopping-cart">
          <ShoppingCart />{" "}
        </div>
      </button>
    </header>
  );
};

export default Header;
