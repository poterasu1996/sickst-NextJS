import Product from "./Product";
import { Button, Spinner } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';

import axios from "../../api/axios";
const PRODUCTS_URL = "/products?populate=*";

const ProductSection = () => {
  const [maleTab, setMaleTab] = useState(true);
  const [nrOfItems, setNrOfItems] = useState(3);
  const [productList, setProductList] = useState([]);
  const nullCategory = {
    data: [
      {
        attributes: {
          name: null
        }
      }
    ]
  }

  useEffect(async () => {
    const response = await axios.get(PRODUCTS_URL);
    const fetchProducts = [...response.data.data];

    // if product doesn't have a category, we set it to null
    const productsList = fetchProducts.map(prod => {
      if(prod.attributes.categories.data.length <= 0) {
        const addedCategory = {
          id: prod.id,
          attributes: { ...prod.attributes, categories: nullCategory }
        }
        return addedCategory;
      }
      return prod;
    })
    setProductList([...productsList]);
  }, []);

  const showMore = () => {
    if (nrOfItems <= productList.length) {
      setNrOfItems(nrOfItems + 3);
    } else {
      setNrOfItems(productList.length);
    }
  }

  const itemsToShow = useMemo(() => {
    if(productList && maleTab) {
      return productList
        .filter(product => product.attributes.categories.data[0].attributes.name === "Male")
        // .slice(0, nrOfItems)
        .map((product, i) => (
          <Product
            key={i}
            product={product}
          />
        ));
      } else if (productList && !maleTab){
      return productList
        .filter(product => product.attributes.categories.data[0].attributes.name === "Female")
        .slice(0, nrOfItems)
        .map((product, i) => (
          <Product
            key={i}
            product={product}
          />
        ));
      }
  })

  return (
    <div className="products-section">
      <div className="container">
        <div className="title">Cele mai dorite parfumuri</div>

        <TabView className="filtertabs" activeIndex={maleTab ? 0 : 1} onTabChange={(e) => e.index === 0 ? setMaleTab(true) : setMaleTab(false)}>
          <TabPanel header="Pentru el">
          <div className="products">
            <div className="row">
              {itemsToShow.length > 0 ? itemsToShow.slice(0, nrOfItems) : <div className="d-flex justify-content-center main-spinner"><Spinner animation="grow" style={{color: "#cc3633"}}/></div>}
            </div>
          </div>
          </TabPanel>
          <TabPanel header="Pentru ea">
            <div className="products">
              <div className="row">
                {itemsToShow.length > 0 ? itemsToShow : <div className="d-flex justify-content-center main-spinner"><Spinner animation="grow" style={{color: "#cc3633"}}/></div>}
              </div>
            </div>
          </TabPanel>
        </TabView>

        <div className="more-prod">
          {(itemsToShow && (nrOfItems < itemsToShow.length))
            && <Button className="button-second-empty" onClick={showMore}>
              Vezi mai multe produse
            </Button>
          }
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
