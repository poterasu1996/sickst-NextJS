import React, { useEffect, useState } from 'react'
import Product from '../HomePage/Product'
import { Checkbox, CheckboxChangeParams } from 'primereact/checkbox';

// to be removed
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import FiltersModal from '../global/FiltersModal';
import SecondaryButton from '../global/SecondaryButton';
import IProduct from '../../types/Product.interface';
import { useRouter } from 'next/router';
import subscriptionService from '../../shared/services/subscriptionService';
import brandService from '../../shared/services/brandService';
import { DEFAULT_SELECTED_FILTERS } from '../../shared/types';
import HttpService from '../../shared/services/HttpService';

type Props = {
    products: IProduct[],
    showMore: boolean,
    handleShowMore: () => void,
    handleFilters: (filters: any) => void
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

type CheckboxFilterProps = {
    listValues: string[], 
    filterTitle: string, 
    selected: string | string[],
    handleAction: (value: string) => void,
    unique?: boolean,

}

export default function ProductFilterSection({ products, showMore = false, handleShowMore, handleFilters }: Props) {
    const router = useRouter();
    
    // const [basic, setBasic] = useState<boolean>(false); // to be removed
    // const [premium, setPremium] = useState<boolean>(false); // to be removed
    // const [brands, setBrands] = useState<any[] | null>(null);  // to be removed
    // const [brandFilter, setBrandFilter] = useState<string[]>([]);  // to be removed
    // const [filteredProducts, setFilteredProducts] = useState<Product[] | null>(null);  // to be removed
    
    
    // maybe to be removed
    // const [modalFilterType, setModalFilterType] = useState<string>("");
    // const [modalOptions, setModalOptions] = useState<ModalOptions>({
    //     basic: false,
    //     premium: false,
    //     brands: null,
    //     brandFilter: null,
    // });
    

    const [show, setShow] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>("");
    const [querySearch, setQuerySearch] = useState('');
    const [allBrands, setAllBrands] = useState<string[] | undefined>();
    const [allSubscriptionType, setAllSubscriptionType] = useState<string[] | undefined>();

    const [selectedFilters, setSelectedFilters] = useState(DEFAULT_SELECTED_FILTERS);   // might be used as a global filter object

    useEffect(() => {
        handleFilters(selectedFilters);
    }, [selectedFilters])

    useEffect(() => {
        if(router.query.search && router.query.search.length ) {
            const searchParam = Array.isArray(router.query.search)
                ? router.query.search[0]
                : router.query.search;
            setQuerySearch(decodeURIComponent(searchParam.replace(/\+/g, " ")));
        }
    }, [router.query.search])

    // useEffect(() => {
    //     // to be removed
    //     if(products) {
    //         applyFilteres();    // show products based on filters
    //         // we need to set additional props for filter modal (what filters to show)
    //         const defaultProps = defaultModalProps();
    //         switch (modalFilterType) {
    //             case 'SF':      // subscription filter
    //                 setModalOptions({ 
    //                     ...defaultProps,
    //                     basic: basic,
    //                     premium: premium
    //                 });
    //                 break;
    //             case 'BF':      // brand filter
    //                 setModalOptions({
    //                     ...defaultProps,
    //                     brands: brands
    //                 })
    //                 break;
    //             default:
    //                 defaultModalProps();
    //         }
    //     }
    // }, [basic, premium, brandFilter, modalFilterType])

    useEffect(() => {
        const fetchFilters = async () => {
            const brandResp = await brandService.getAllBrands();
            if (HttpService.isErrorResponse(brandResp)) {
              console.error("Failed to load brands.", brandResp.error);
            } else {
              const _parsedBrands = brandResp.data.map(b => b.attributes.brand_name);
              setAllBrands(_parsedBrands);
            }
        
            const subResp = await subscriptionService.getAllSubscriptionType();
            if (HttpService.isErrorResponse(subResp)) {
              console.error("Failed to load subscriptions.", subResp.error);
            } else {
              const _parsedSubs = subResp.data
                .filter(sub => sub.attributes.name?.trim())
                .map(sub => sub.attributes.name!);
              setAllSubscriptionType(_parsedSubs);
            }
          };
        
        fetchFilters();
    }, [])

    const handleCheckboxChange = (filterType: "subscription" | "brand", value: string) => {
        setSelectedFilters(prev => {
            switch (filterType) {
              case "subscription":
                return {
                  ...prev,
                  subscription_type: prev.subscription_type === value ? '' : value,
                };
        
              case "brand":
                const updatedBrands = prev.brand.includes(value)
                  ? prev.brand.filter(item => item !== value)
                  : [...prev.brand, value];

                const cleanedBrands = updatedBrands.filter(item => item.trim() !== '');
        
                return {
                  ...prev,
                  brand: cleanedBrands,
                };
        
              // ✅ Add more filters here in the future
              default:
                return prev;
            }
          });
    }

    const renderCheckboxes = ({
        listValues, 
        filterTitle, 
        selected,
        handleAction,
        unique = false,
    }: CheckboxFilterProps) => {
        if (!listValues.length) return null;

        return (
            <>
                <div className="filter-title">{filterTitle}</div>
                {listValues.map((type) => {
                const isChecked = unique
                    ? selected === type
                    : Array.isArray(selected) && selected.includes(type);
        
                return (
                    <div className="filter-name" key={type}>
                    <Checkbox
                        inputId={type}
                        checked={isChecked}
                        onChange={() => handleAction(type)}
                    />
                    <label htmlFor={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </label>
                    </div>);
                })}
          </>
        )
    }

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
    // function onBrandChange(e: CheckboxChangeParams) {
    //     // to be removed
    //     let selectedBrands: string[] = [...brandFilter];

    //     if(e.checked) {
    //         selectedBrands.push(e.value);
    //     } else {
    //         selectedBrands.splice(selectedBrands.indexOf(e.value), 1);
    //     }
    //     setBrandFilter(selectedBrands);
    // }

    // function applyFilteres() {
    //     //  to be removed
    //     let filteredProducts = [...products];
    //     if(basic) {
    //         const basicProducts = filteredProducts.filter(product => {
    //             return product.attributes.subscription_type.toLowerCase() === 'basic'
    //         });
    //         filteredProducts = [...basicProducts];
    //     }
    //     if(premium) {
    //         const premiumProducts = products.filter((item: Product) => {
    //             return item.attributes.subscription_type.toLowerCase() === 'premium'
    //         }); 
    //         filteredProducts = [...premiumProducts]
    //     }
    //     if(brandFilter.length > 0) {
    //         let filteredBrandProducts: Product[] = [];
    //         brandFilter.map(brand => {
    //             filteredProducts.filter(product => {
    //                 product.attributes.brand.toLowerCase() === brand.toLowerCase() && filteredBrandProducts.push(product);
    //             })
    //         })
    //         setFilteredProducts([...filteredBrandProducts]);
    //         return
    //     }
    //     setFilteredProducts([...filteredProducts]);
    // }
    
    return (
        <>
        <div className='container product-filter-section'>
            <div className='product-filter-section--header'>Catalog</div>
            <div className='product-filter-section--content'>
                <div className='filters'>
                    {/* desktop-v */}
                    <div className='filters--desktop'>
                        <div className='subscription-filter'>
                            {allSubscriptionType && renderCheckboxes({
                                listValues: allSubscriptionType, 
                                filterTitle: 'Abonament', 
                                // selected: filteredSubscription, 
                                selected: selectedFilters.subscription_type, 
                                // handleAction: handleSubscriptionCheckboxChange, 
                                handleAction: (value) => handleCheckboxChange("subscription", value), 
                                unique: true
                            })}
                        </div>
                        <div className='brand-filter'>
                            {allBrands && renderCheckboxes({
                                listValues: allBrands, 
                                filterTitle: 'Brands', 
                                // selected: filteredBrand, 
                                selected: selectedFilters.brand, 
                                // handleAction: handleBrandsSelection
                                handleAction: (value) => handleCheckboxChange("brand", value), 
                            })}
                        </div>
                    </div>
                    {/* mobile-v */}
                    {/* <div className='filters--mobile'>
                        <div className='filter-name' onClick={() => {
                            setModalTitle('Abonament');
                            setModalFilterType("SF");
                            setShow(preVal => !preVal);
                        }}>Abonament</div>
                        <div className='filter-name' onClick={() => {
                            setModalTitle('Brand');
                            setModalFilterType("BF");
                            setShow(preVal => !preVal)
                        }}>Brand</div>
                    </div> */}
                    {/* mobile-modal */}
                    {/* <FiltersModal 
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
                    /> */}

                </div>
                <div className='products row'>
                    {querySearch && <div className="products-count">10 rezultate pentru <b>{`"${querySearch}"`}</b></div>}
                    
                    {/* {console.log('products', products)} */}
                    {products?.length
                        ? products.map(product => (<Product key={product.id} product={product}/>))
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
