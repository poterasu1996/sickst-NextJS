import React, { useEffect, useState } from 'react'
import Product from '../HomePage/Product'
import { Checkbox, CheckboxChangeParams } from 'primereact/checkbox';


import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import axios from '../../api/axios';
import FiltersModal from '../global/FiltersModal';
import SecondaryButton from '../global/SecondaryButton';
import IProduct from '../../types/Product.interface';
const BRANDS_URL = "/brands";

type Props = {
    products: IProduct[],
    showMore: boolean,
    handleShowMore: () => void
}

type Product = {
    id: number,
    attributes: any
}

type ModalOptions = {
    basic: boolean,
    premium: boolean,
    brands: any[] | null,
    brandFilter: any[] | null,
}

export default function ProductFilterSection({ products, showMore = false, handleShowMore }: Props) {
    const [basic, setBasic] = useState<boolean>(false);
    const [premium, setPremium] = useState<boolean>(false);
    const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(null);
    const [brands, setBrands] = useState<any[] | null>(null);
    const [brandFilter, setBrandFilter] = useState<string[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalFilterType, setModalFilterType] = useState<string>("");
    const [modalOptions, setModalOptions] = useState<ModalOptions>({
        basic: false,
        premium: false,
        brands: null,
        brandFilter: null,
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
                case 'SF':      // subscription filter
                    setModalOptions({ 
                        ...defaultProps,
                        basic: basic,
                        premium: premium
                    });
                    break;
                case 'BF':      // brand filter
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
            basic: false,
            premium: false,
            brands: null,
            brandFilter: null,
        };
    }

    // filter brands
    function onBrandChange(e: CheckboxChangeParams) {
        let selectedBrands: string[] = [...brandFilter];

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
            const premiumProducts = products.filter((item: Product) => {
                return item.attributes.subscription_type.toLowerCase() === 'premium'
            }); 
            filteredProducts = [...premiumProducts]
        }
        if(brandFilter.length > 0) {
            let filteredBrandProducts: Product[] = [];
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
                            {brands && brands.map(brand => (
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
                        handleClose={(val: boolean) => setShow(val)}
                        showFilters={modalFilterType}

                        brands={modalOptions.brands}
                        brandFilter={brandFilter}
                        basic={modalOptions.basic}
                        premium={modalOptions.premium}
                        handleBrandChange={(val: any) => onBrandChange(val)}
                        handleBasic={(val: boolean) => setBasic(val)}
                        handlePremium={(val: boolean) => setPremium(val)}
                    />

                </div>
                <div className='products row'>
                    {filteredProducts?.length
                        ? filteredProducts.map(product => (<Product key={product.id} product={product}/>))
                        : <div className='no-product'>Produsul selectat nu exista!</div>
                    }
                    {showMore && <div className="more-prod">
                        <SecondaryButton onClick={handleShowMore}>Vezi mai multe produse</SecondaryButton>
                    </div>}
                </div>
            </div>
        </div>
    </>
    )
}
