import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import { AutoComplete } from 'primereact/autocomplete';
import { useState, useEffect } from 'react';

const counties = [
    { 'name': 'Alba', value: 'Alba' }, 
    { 'name': 'Arad', value: 'Arad' }, 
    { 'name': 'Arges', value: 'Arges'}, 
    { 'name': 'Bacau', value: 'Bacau'},
    { 'name': 'Bihor', value: 'Bihor'},
    { 'name': 'Bistrita-Nasaud', value: 'Bistrita-Nasaud'},
    { 'name': 'Botosani', value: 'Botosani'},
    { 'name': 'Brasov', value: 'Brasov'},
    { 'name': 'Braila', value: 'Braila'},
    { 'name': 'Bucuresti', value: 'Bucuresti'},
    { 'name': 'Buzau', value: 'Buzau'},
    { 'name': 'Caras-Severin', value: 'Caras-Severin'},
    { 'name': 'Calarasi', value: 'Calarasi'},
    { 'name': 'Cluj', value: 'Cluj'},
    { 'name': 'Constanta', value: 'Constanta'},
    { 'name': 'Covasna', value: 'Covasna'},
    { 'name': 'Dambovita', value: 'Dambovita'},
    { 'name': 'Dolj', value: 'Dolj'},
    { 'name': 'Galati', value: 'Galati'},
    { 'name': 'Giurgiu', value: 'Giurgiu'},
    { 'name': 'Gorj', value: 'Gorj'},
    { 'name': 'Harghita', value: 'Harghita'},
    { 'name': 'Hunedoara', value: 'Hunedoara'},
    { 'name': 'Ialomita', value: 'Ialomita'},
    { 'name': 'Iasi', value: 'Iasi'},
    { 'name': 'Ilfov', value: 'Ilfov'},
    { 'name': 'Maramures', value: 'Maramures'},
    { 'name': 'Mehedinti', value: 'Mehedinti'},
    { 'name': 'Mures', value: 'Mures'},
    { 'name': 'Neamt', value: 'Neamt'},
    { 'name': 'Olt', value: 'Olt'},
    { 'name': 'Prahova', value: 'Prahova'},
    { 'name': 'Satu Mare', value: 'Satu Mare'},
    { 'name': 'Salaj', value: 'Salaj'},
    { 'name': 'Sibiu', value: 'Sibiu'},
    { 'name': 'Suceava', value: 'Suceava'},
    { 'name': 'Teleorman', value: 'Teleorman'},
    { 'name': 'Timis', value: 'Timis'},
    { 'name': 'Tulcea', value: 'Tulcea'},
    { 'name': 'Vaslui', value: 'Vaslui'},
    { 'name': 'Valcea', value: 'Valcea'},
    { 'name': 'Vrancea', value: 'Vrancea'},
];

const AutocompleteFormField = (props) => {
    const [selectedCounty, setSelectedCounty] = useState(null);
    const [filteredCounties, setFilteredCounties] = useState(null);

    useEffect(() => {
        props.handlecounty(selectedCounty);
    }, [selectedCounty])

    const searchCounty = (event) => {
        setTimeout(() => {
            let _filteredCountries;
            if (!event.query.trim().length) {
                _filteredCountries = [...counties];
            }
            else {
                _filteredCountries = counties.filter((county) => {
                    return county.name.toLowerCase().includes(event.query.toLowerCase());
                });
            }
            setFilteredCounties(_filteredCountries);
        }, 250);
    }

    return (
        <>  
            <div className="form-field autocomplete-field">
                <AutoComplete 
                    className='autoc-form-control'
                    value={selectedCounty}
                    suggestions={filteredCounties}
                    completeMethod={searchCounty}
                    onChange={(e) => {
                        setSelectedCounty(e.value.value);
                    }}
                    field="name"
                    panelClassName='county-ac-list'
                    {...props}
                />
            </div>
        </>
    )
}

export default AutocompleteFormField;