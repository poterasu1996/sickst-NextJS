import { useState, useEffect } from "react";
import {
  TextField,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  InputAdornment,
  ClickAwayListener,
  Typography,
  Box,
  Divider
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { ProductOption } from "../Header";

interface Props {
  searchSuggestions: string[];
  productSuggestions: ProductOption[];
  onSearchSelect: (text: string) => void;
  onProductSelect: (product: ProductOption) => void;
  onInputChange: (value: string) => void; 
}

export default function SearchInputWithDropdown({
  searchSuggestions,
  productSuggestions,
  onSearchSelect,
  onProductSelect,
  onInputChange
}: Props) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [filteredSearch, setFilteredSearch] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductOption[]>([]);

  useEffect(() => {
    const term = input.toLowerCase();

    const filteredSearchItems = searchSuggestions.filter((text) =>
      text.toLowerCase().includes(term)
    );
    const filteredProductItems = productSuggestions.filter((product) =>
      product.name.toLowerCase().includes(term)
    );

    setFilteredSearch(filteredSearchItems);
    setFilteredProducts(filteredProductItems);
  }, [input, searchSuggestions, productSuggestions]);

  const handleFocus = () => setOpen(true);
  const handleClickAway = () => setOpen(false);

  const handleSearchSelect = (text: string) => {
    onSearchSelect(text);
    setInput(text);
    setOpen(false);
  };

  const handleProductSelect = (product: ProductOption) => {
    onProductSelect(product);
    setInput(product.name);
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box className="searchInput" sx={{ position: "relative", width: "100%" }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search..."
          value={input}
          onFocus={handleFocus}
          onChange={(e) => {
            const value = e.target.value;
            setInput(value);
            onInputChange(value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if(e.key === 'Enter' && input.trim()) {
              handleSearchSelect(input.trim())
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: input.length > 0 && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setInput("");
                      onInputChange("");
                      setOpen(false);
                      handleSearchSelect('');
                    }}
                    size="small"
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
            ),
          }}
        />

        {open && (filteredSearch.length > 0 || filteredProducts.length > 0) && (
          <Paper
            className="searchInput--dropdown"
            elevation={3}
            sx={{
              position: "absolute",
              width: "100%",
              zIndex: 10,
              mt: 1,
              maxHeight: 300,
              overflowY: "auto",
              p: 1,
            }}
          >
            {filteredSearch.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ pl: 1, pb: 0.5, color: "text.secondary", fontSize: '1.4rem' }}>
                  Search suggestions
                </Typography>
                <List dense disablePadding>
                  {filteredSearch.map((text, idx) => (
                    <ListItemButton key={idx} onClick={() => handleSearchSelect(text)}>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  ))}
                </List>
                {filteredProducts.length > 0 && <Divider sx={{ my: 1 }} />}
              </>
            )}

            {filteredProducts.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ pl: 1, pb: 0.5, color: "text.secondary", fontSize: '1.4rem'  }}>
                  Product suggestions
                </Typography>
                <List dense disablePadding>
                  {filteredProducts.map((product) => (
                    <ListItemButton key={product.id} onClick={() => handleProductSelect(product)}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <img
                          src={`${process.env.NEXT_PUBLIC_STRAPI_ROOTURL}` + product.image}
                          alt={product.name}
                          style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
                        />
                        <ListItemText primary={product.name} />
                      </Box>
                    </ListItemButton>
                  ))}
                </List>
              </>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}