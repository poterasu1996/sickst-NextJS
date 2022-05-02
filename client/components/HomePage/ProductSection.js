import image1 from "../../public/img/fougere-fragrance-family-Clive-Christian-Perfumes-1555x1100.jpg";
import image2 from "../../public/img/versace-eros.jpg";
import image3 from "../../public/img/dolce-gabbana-the-one-for-men.jpg";
import Product from "./Product";
import { Button, Spinner } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";

import axios from "../../api/axios";
const PRODUCTS_URL = "/products?populate=*";

// const list = [
//     {
//       image: image1,
//       brand: "Paco Rabanne",
//       model: "Invictus",
//       type: "Eau de toilette",
//       price: "120",
//     },
//     {
//       image: image2,
//       brand: "Dior",
//       model: "Sauvage",
//       type: "Eau de parfum",
//       price: "290",
//     },
//     {
//       image: image3,
//       brand: "Paco Rabanne",
//       model: "Phantom",
//       type: "Parfum",
//       price: "550",
//     },
//     {
//       image: image1,
//       brand: "Paco Rabanne",
//       model: "One Million",
//       type: "Eau de toilette",
//       price: "120",
//     },
//     {
//       image: image2,
//       brand: "Sauvage",
//       model: "One Million",
//       type: "Eau de parfum",
//       price: "290",
//     },
//     {
//       image: image3,
//       brand: "Paco Rabanne",
//       model: "Exclussive",
//       type: "Parfum",
//       price: "550",
//     },
//   ];
const ProductSection = () => {
  const [productList, setProductList] = useState();
  const [nrOfItems, setNrOfItems] = useState(3);

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
    if(productList){
      return productList
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
          <a className="active man" href="#">
            Pentru el
          </a>
          <a href="#">Pentru ea</a>
        </div>

        <div className="products">
          <div className="row">
            {itemsToShow ? itemsToShow : <Spinner animation="grow"/>}
          </div>
        </div>
        <div className="more-prod">
          {(productList && (nrOfItems < productList.length))
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
