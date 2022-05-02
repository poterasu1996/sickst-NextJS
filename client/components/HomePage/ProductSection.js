import image1 from '../../public/img/fougere-fragrance-family-Clive-Christian-Perfumes-1555x1100.jpg';
import image2 from "../../public/img/versace-eros.jpg";
import image3 from "../../public/img/dolce-gabbana-the-one-for-men.jpg";
import Product from './Product';
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';

import axios from '../../api/axios';
const PRODUCTS_URL = '/products?populate=*'

const ProductSection = () => {
    const list = [
        {
          image: image1,
          brand: "Paco Rabanne",
          model: "Invictus",
          type: "Eau de toilette",
          price: "120",
        },
        {
          image: image2,
          brand: "Dior",
          model: "Sauvage",
          type: "Eau de parfum",
          price: "290",
        },
        {
          image: image3,
          brand: "Paco Rabanne",
          model: "Phantom",
          type: "Parfum",
          price: "550",
        },
        {
          image: image1,
          brand: "Paco Rabanne",
          model: "One Million",
          type: "Eau de toilette",
          price: "120",
        },
        {
          image: image2,
          brand: "Sauvage",
          model: "One Million",
          type: "Eau de parfum",
          price: "290",
        },
        {
          image: image3,
          brand: "Paco Rabanne",
          model: "Exclussive",
          type: "Parfum",
          price: "550",
        },
      ];

      useEffect(async() => {
        const response = await axios.get(PRODUCTS_URL);
        console.log('response',response.data.data);
      }, [])
    
      const size = 3;
      const items = list.slice(0, size);

    return <div className="products-section">
        <div className="container">
            <div className="title">Cele mai dorite parfumuri</div>
            <div className="filter-tabs">
                <a className="active man" href="#">Pentru el</a>
                <a  href="#">Pentru ea</a>
            </div>

            <div className="products">
                <div className="row">
                    {items.map((product, i) => (
                        <Product 
                          key={i}
                          image={product.image}
                          brand={product.brand}
                          model={product.model}
                          type={product.type}
                          price={product.price}
                        />
                    ))}
                </div>
            </div>
            <div className='more-prod'>
              <Button className='button-second-empty'>Vezi mai multe produse</Button>
            </div>
        </div>
    </div>
}

export default ProductSection;