import Product from "./Product";
import { useEffect, useMemo, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";

import productService from "../../services/productService";
import { useQuery } from "@tanstack/react-query";
import SecondaryButton from "../global/SecondaryButton";
import { CircularProgress } from "@mui/material";
import IProduct from "../../types/product";

// not used atm
const ProductSection = () => {
  const [maleTab, setMaleTab] = useState(true);
  const [fetchedProd, setFetchedProd] = useState<IProduct[]>([]);
  const [paginationList, setPaginationList] = useState<IProduct[]>([]);

  const [page, setPage] = useState(1);
  const [showMore, setShowMore] = useState(false)

  const { data } = useQuery({
    queryKey: ["products", page, maleTab],
    queryFn: () => maleTab ? productService.getMaleProducts(page) : productService.getFemaleProducts(page),
  });

  useEffect(() => {
    if(data) {
      setFetchedProd([...data.data])

      if(data.meta.pagination.page === 1) setPaginationList([...data.data])
      if(data.meta.pagination.page < data.meta.pagination.pageCount) {
        setShowMore(true);
      } else {
        setShowMore(false)
      }
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [maleTab])

  const handleShowMore = () => {
    setPage(preVal => preVal + 1)
  };

  const itemsToShow = useMemo(() => {
    const showItems = data?.meta.pagination.page === 1 ? [...paginationList] : [...paginationList, ...fetchedProd]
    return showItems
      .map((product, i) => <Product key={i} product={product} />);
  }, [fetchedProd]);

  return (
    <div className="products-section">
      <div className="container">
        <div className="title">Cele mai dorite parfumuri</div>

        <TabView
          className="filtertabs"
          activeIndex={maleTab ? 0 : 1}
          onTabChange={(e) =>
            e.index === 0 ? setMaleTab(true) : setMaleTab(false)
          }
        >
          <TabPanel header="Pentru el">
            <div className="products">
              <div className="row">
                {itemsToShow.length > 0 ? (
                  itemsToShow
                ) : (
                  <div className="d-flex justify-content-center main-spinner">
                    <CircularProgress />
                  </div>
                )}
              </div>
            </div>
          </TabPanel>
          <TabPanel header="Pentru ea">
            <div className="products">
              <div className="row">
                {itemsToShow.length > 0 ? (
                  itemsToShow
                ) : (
                  <div className="d-flex justify-content-center main-spinner">
                    <CircularProgress />
                  </div>
                )}
              </div>
            </div>
          </TabPanel>
        </TabView>

        <div className="more-prod">
          {showMore &&
            <SecondaryButton onClick={handleShowMore}>
              Vezi mai multe produse
            </SecondaryButton>
          }
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
