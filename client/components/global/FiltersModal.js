import { RadioButton } from 'primereact/radiobutton';
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { Checkbox } from 'primereact/checkbox';

const FiltersModal = (props) => {
    const [search, setSearch] = useState("");
    const {
        show, 
        title, 
        showFilters,
        handleClose, 
        brands,
        brandFilter,
        handleBrandChange,
        basic,
        premium,
        handleBasic,
        handlePremium
    } = props;
    
    return (
        <Modal
            className="filters-modal"
            isOpen={show}
            fullscreen={true}
            toggle={() => handleClose(!show)}
        >
            <ModalHeader toggle={() => handleClose(!show)}>
                <div className='title'>{title}</div>
            </ModalHeader>
            <ModalBody>
                <div className='p-input-icon-left'>
                    <i className='pi pi-search'/>
                    <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cauta"/>
                </div>
                <div className='modal-body--filters'>
                    {showFilters === 'SF' &&
                        <>
                            <div className='field-cb'>
                                <Checkbox inputId='basic-rb' checked={basic} onChange={ () => {
                                    handleBasic(preVal => !preVal);
                                    premium && handlePremium(preVal => !preVal);
                                }} />
                                <label htmlFor='basic-rb'>Basic</label>
                            </div>
                            <div className='field-cb'>
                                <Checkbox inputId='premium-rb' checked={premium} onChange={() => {
                                    handlePremium(preVal => !preVal);
                                    basic && handleBasic(preVal => !preVal);
                                }} />
                                <label htmlFor='premium-rb'>Premium</label>
                            </div>
                        </>
                    }
                    {(showFilters === 'BF' && brands) && brands.map(brand => (
                            <div className='field-cb' key={brand.id}>
                                <Checkbox 
                                    inputId={`${brand.attributes.brand_name}-${brand.id}`} 
                                    value={brand.attributes.brand_name.toLowerCase()} 
                                    checked={brandFilter.indexOf(brand.attributes.brand_name.toLowerCase()) !== -1} 
                                    onChange={handleBrandChange}/>
                                <label htmlFor={`${brand.attributes.brand_name}-${brand.id}`}>{brand.attributes.brand_name}</label>
                            </div>
                        ))
                    }
                </div>
            </ModalBody>
        </Modal>
    )
}

export default FiltersModal