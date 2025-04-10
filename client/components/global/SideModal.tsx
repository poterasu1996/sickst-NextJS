import { useContext } from "react";
import { createTheme, Drawer, ThemeProvider } from "@mui/material";
import AuthContext from "../../store/auth-context";

type Props = {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
};

const customTheme = createTheme({
  palette: {
    primary: {
      main: "#cc3633",
    },
  },
});

const SideModal = ({ open, onClose, children }: Props) => {
  const { isAuth } = useContext(AuthContext);

  return (
    <ThemeProvider theme={customTheme}>
      {" "}
      {/* Explicitly apply theme */}
      <Drawer anchor="right" open={open} onClose={onClose}>
        <div
          id="side-modal"
          className={`side-modal-wrapper ${isAuth && "cart"}`}
        >
          {children}
        </div>
      </Drawer>
    </ThemeProvider>
  );
};

export default SideModal;
