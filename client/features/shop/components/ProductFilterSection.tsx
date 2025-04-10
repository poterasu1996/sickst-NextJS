import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';

// Components
import SideModal from '../../../components/global/SideModal';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Checkbox, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

import Product from '../../../components/HomePage/Product'
import SecondaryButton from '../../../components/global/SecondaryButton';

// Services
import subscriptionService from '../../../shared/services/subscriptionService';
import brandService from '../../../shared/services/brandService';
import HttpService from '../../../shared/services/HttpService';

// Utils & Constants
import IProduct from '../../../types/Product.interface';
import { DEFAULT_SELECTED_FILTERS } from '../../../shared/types';

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

type CheckboxFilterProps = {
    listValues: string[], 
    filterTitle: string, 
    selected: string | string[],
    handleAction: (value: string) => void,
    unique?: boolean,
}

export default function ProductFilterSection({ products, showMore = false, handleShowMore, handleFilters }: Props) {
    const router = useRouter();
    
    const [showFiltersMobile, setShowFiltersMobile] = useState(false);
    const [querySearch, setQuerySearch] = useState('');
    const [allBrands, setAllBrands] = useState<string[] | undefined>();
    const [allSubscriptionType, setAllSubscriptionType] = useState<string[] | undefined>();
    const [selectedFilters, setSelectedFilters] = useState(DEFAULT_SELECTED_FILTERS); 

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
                        <FormGroup key={type}>
                            <FormControlLabel 
                                control={<Checkbox checked={isChecked} onChange={() => handleAction(type)}/>} 
                                label={`${type.charAt(0).toUpperCase()}${type.slice(1)}`} 
                            /> 
                        </FormGroup>
                    </div>);
                })}
          </>
        )
    }

    const handleToggleFiltersModal = () => {
        setShowFiltersMobile(preVal => !preVal);
    }

    return (
        <>
        <div className='container product-filter-section'>
            <div className='product-filter-section--header'>Catalog</div>
            <div className='product-filter-section--content'>
                <div className='filters--desktop'>
                    {/* desktop-v */}
                    <div className='filters'>
                        <div className='subscription-filter'>
                            {allSubscriptionType && renderCheckboxes({
                                listValues: allSubscriptionType, 
                                filterTitle: 'Abonament', 
                                selected: selectedFilters.subscription_type, 
                                handleAction: (value) => handleCheckboxChange("subscription", value), 
                                unique: true
                            })}
                        </div>
                        <div className='subscription-filter'>
                            {allBrands && renderCheckboxes({
                                listValues: allBrands, 
                                filterTitle: 'Brands', 
                                selected: selectedFilters.brand, 
                                handleAction: (value) => handleCheckboxChange("brand", value), 
                            })}
                        </div>
                    </div>

                </div>
                {/* mobile-v */}
                <div className='filters--mobile'>
                    <div className='filter-name' onClick={ handleToggleFiltersModal }>Abonament</div>
                    <div className='filter-name' onClick={ handleToggleFiltersModal }>Brand</div>
                </div>
                {/* mobile-modal */}
                <SideModal
                    open={showFiltersMobile}
                    onClose={handleToggleFiltersModal}
                >
                    <>
                        <div className="side-modal-header">
                            <span className="text">Filters</span>
                            <IconButton onClick={handleToggleFiltersModal} size="medium"><CloseIcon /></IconButton>
                        </div>
                        <div className="side-modal-body">
                            <div className="filters">
                                <div className="subscription-filter">
                                    {allSubscriptionType && renderCheckboxes({
                                        listValues: allSubscriptionType, 
                                        filterTitle: 'Abonament', 
                                        selected: selectedFilters.subscription_type, 
                                        handleAction: (value) => handleCheckboxChange("subscription", value), 
                                        unique: true
                                    })}
                                </div>
                                <div className="subscription-filter">
                                    {allBrands && renderCheckboxes({
                                        listValues: allBrands, 
                                        filterTitle: 'Brands', 
                                        selected: selectedFilters.brand, 
                                        handleAction: (value) => handleCheckboxChange("brand", value), 
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                </SideModal>
                <div className='products row'>
                    {querySearch && <div className="products-count">10 rezultate pentru <b>{`"${querySearch}"`}</b></div>}
                    
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
