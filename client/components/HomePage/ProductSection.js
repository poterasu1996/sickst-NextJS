import image1 from "../../public/img/fougere-fragrance-family-Clive-Christian-Perfumes-1555x1100.jpg";
import image2 from "../../public/img/versace-eros.jpg";
import image3 from "../../public/img/dolce-gabbana-the-one-for-men.jpg";
import Product from "./Product";
import { Button, Spinner } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";

import axios from "../../api/axios";
const PRODUCTS_URL = "/products?populate=*";

const ProductSection = () => {
  const [maleTab, setMaleTab] = useState(true);
  const [nrOfItems, setNrOfItems] = useState(3);
  const [productList, setProductList] = useState();

  useEffect(async () => {
    const response = await axios.get(PRODUCTS_URL);
    setProductList(response.data.data);
  }, []);

  const showMore = () => {
    if (nrOfItems <= productList.length) {
      setNrOfItems(nrOfItems + 3);
    } else {
      setNrOfItems(productList.length);
    }
  }

  const itemsToShow = useMemo(() => {
    if(productList && maleTab){
      return productList
        .filter(product => product.attributes.categories.data[0].attributes.name === "Male")
        .slice(0, nrOfItems)
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
        <div className="filter-tabs">
          <div className={maleTab ? "active man" : ""} onClick={() => setMaleTab(true)}>Pentru el</div>
          <div className={!maleTab ? "active man" : ""} onClick={() => setMaleTab(false)}>Pentru ea</div>
        </div>

        <div className="products">
          <div className="row">
            {itemsToShow ? itemsToShow : <div className="d-flex justify-content-center main-spinner"><Spinner animation="grow" style={{color: "#cc3633"}}/></div>}
          </div>
        </div>
        <div className="more-prod">
          {(productList && (nrOfItems < productList.length - 1))
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
