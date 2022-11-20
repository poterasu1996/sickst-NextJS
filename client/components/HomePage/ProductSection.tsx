import Product from "./Product";
import { Button, Spinner } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import { TabView, TabPanel } from 'primereact/tabview';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';

import axios from "../../api/axios";
import IProduct from "../../types/Product.interface";
const PRODUCTS_URL = "/products?populate=*";

interface IProductCard {
  id: number | null,
  attributes: IProduct | null
}

const ProductSection = () => {
  const [maleTab, setMaleTab] = useState<boolean>(true);
  const [nrOfItems, setNrOfItems] = useState<number>(3);
  const [productList, setProductList] = useState<IProductCard[]>([]);
  
  const nullCategory = {
    data: [
      {
        attributes: {
          name: null
        }
      }
    ]
  }

  useEffect(() => {
    const fetchData = async() => {
      const result = await axios.get(PRODUCTS_URL);
      const fetchProducts = [...result.data.data];
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
    } 

    fetchData();
  }, []);

  const showMore = () => {
    if (nrOfItems <= productList.length) {
      setNrOfItems(nrOfItems + 3);
    } else {
      setNrOfItems(productList.length);
    }
  }

  const itemsToShow = useMemo(() => {
    if(maleTab) {
      return productList
        .filter((product: any) => product.attributes.categories.data[0].attributes.name === "male")
        .map((product, i) => (
          <Product
          key={i}
          product={product}
          />
        ));
      } else {
        return productList
          .filter((product: any) => product.attributes.categories.data[0].attributes.name === "Female")
          .map((product, i) => (
            <Product
              key={i}
              product={product}
            />
          ));
      }
  }, [productList, maleTab])

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
                {itemsToShow.length > 0 ? itemsToShow.slice(0, nrOfItems) : <div className="d-flex justify-content-center main-spinner"><Spinner animation="grow" style={{color: "#cc3633"}}/></div>}
              </div>
            </div>
          </TabPanel>
        </TabView>

        <div className="more-prod">
          {(nrOfItems < itemsToShow.length)
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
