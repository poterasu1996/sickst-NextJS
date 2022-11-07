import React, { useEffect, useState } from 'react'
import Product from '../HomePage/Product'
import { Checkbox } from 'primereact/checkbox';


import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import axios from '../../api/axios';
import FiltersModal from '../global/FiltersModal';
const BRANDS_URL = "/brands";

export default function ProductFilterSection({ products }) {
    const [basic, setBasic] = useState(false);
    const [premium, setPremium] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [brandFilter, setBrandFilter] = useState([]);
    const [show, setShow] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalFilterType, setModalFilterType] = useState("");
    const [modalOptions, setModalOptions] = useState({
        basic: undefined,
        premium: undefined,
        brands: undefined,
        brandFilter: undefined,
    });

    useEffect(() => {
        if(products) {
            setFilteredProducts([...products]);
        }
    }, [products])

    useEffect(() => {
        if(products) {
            applyFilteres();    // show products based on filters
            // we need to set additional props for filter modal (what filters to show)
            const defaultProps = defaultModalProps();
            switch (modalFilterType) {
                case 'SF':
                    setModalOptions({ 
                        ...defaultProps,
                        basic: basic,
                        premium: premium
                    });
                    break;
                case 'BF':
                    setModalOptions({
                        ...defaultProps,
                        brands: brands
                    })
                    break;
                default:
                    defaultModalProps();
            }
        }
    }, [basic, premium, brandFilter, modalFilterType])

    useEffect(() => {
        axios.get(BRANDS_URL).then(resp => {
            setBrands([...resp.data.data])
        })
    }, [])

    function defaultModalProps() {
        // default state of filters / reset filters
        return {
            basic: undefined,
            premium: undefined,
            brands: undefined,
            brandFilter: undefined,
        };
    }

    // filter brands
    function onBrandChange(e) {
        let selectedBrands = [...brandFilter];

        if(e.checked) {
            selectedBrands.push(e.value);
        } else {
            selectedBrands.splice(selectedBrands.indexOf(e.value), 1);
        }
        setBrandFilter(selectedBrands);
    }

    function applyFilteres() {
        let filteredProducts = [...products];
        if(basic) {
            const basicProducts = filteredProducts.filter(product => {
                return product.attributes.subscription_type.toLowerCase() === 'basic'
            });
            filteredProducts = [...basicProducts];
        }
        if(premium) {
            const premiumProducts = products.filter(product => {
                return product.attributes.subscription_type.toLowerCase() === 'premium'
            }); 
            filteredProducts = [...premiumProducts]
        }
        if(brandFilter.length > 0) {
            let filteredBrandProducts = [];
            brandFilter.map(brand => {
                filteredProducts.filter(product => {
                    product.attributes.brand.toLowerCase() === brand.toLowerCase() && filteredBrandProducts.push(product);
                })
            })
            setFilteredProducts([...filteredBrandProducts]);
            return
        }
        setFilteredProducts([...filteredProducts]);
    }
    
    return (<>
        <div className='container product-filter-section'>
            <div className='product-filter-section--header'>Catalog</div>
            <div className='product-filter-section--content'>
                <div className='filters'>
                    {/* desktop-v */}
                    <div className='filters--desktop'>
                        <div className='subscription-filter'>
                            <div className='filter-title'>Abonament</div>
                            <div className='filter-name'>
                                <Checkbox inputId='basic' checked={basic} onChange={() => {
                                    setBasic(preVal => !preVal);
                                    premium && setPremium(preVal => !preVal);
                                }}/>
                                <label htmlFor='basic'>Basic</label>
                            </div>
                            <div className='filter-name'>
                                <Checkbox inputId='premium' checked={premium} onChange={() => {
                                    setPremium(preVal => !preVal);
                                    basic && setBasic(preVal => !preVal);
                                }}/>
                                <label htmlFor='premium'>Premium</label>
                            </div>
                        </div>
                        <div className='brand-filter'>
                            <div className='filter-title'>Brand</div>
                            {brands.length > 0 && brands.map(brand => (
                                <div className='filter-name' key={brand.id}>
                                    <Checkbox 
                                        inputId={`${brand.attributes.brand_name}-${brand.id}`} 
                                        value={brand.attributes.brand_name.toLowerCase()} 
                                        checked={brandFilter.indexOf(brand.attributes.brand_name.toLowerCase()) !== -1} 
                                        onChange={onBrandChange}/>
                                    <label htmlFor={`${brand.attributes.brand_name}-${brand.id}`}>{brand.attributes.brand_name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* mobile-v */}
                    <div className='filters--mobile'>
                        <div className='filter-name' onClick={() => {
                            setModalTitle('Abonament');
                            setModalFilterType("SF");
                            // subscriptionFilterOptions();
                            setShow(preVal => !preVal);
                        }}>Abonament</div>
                        <div className='filter-name' onClick={() => {
                            setModalTitle('Brand');
                            setModalFilterType("BF");
                            // subscriptionFilterOptions();
                            setShow(preVal => !preVal)
                        }}>Brand</div>
                    </div>
                    {/* mobile-modal */}
                    <FiltersModal 
                        show={show} 
                        title={modalTitle} 
                        handleClose={val => setShow(val)}
                        showFilters={modalFilterType}

                        brands={modalOptions.brands}
                        brandFilter={brandFilter}
                        basic={modalOptions.basic}
                        premium={modalOptions.premium}
                        handleBrandChange={(val) => onBrandChange(val)}
                        handleBasic={(val) => setBasic(val)}
                        handlePremium={(val) => setPremium(val)}
                    />

                </div>
                <div className='products row'>
                    {filteredProducts.length > 0 
                        ? filteredProducts.map(product => (<Product key={product.id} product={product}/>))
                        : <div className='no-product'>Produsul selectat nu exista!</div>
                    }
                </div>
            </div>
        </div>
    </>
    )
}
