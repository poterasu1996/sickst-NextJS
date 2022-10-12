import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import { AutoComplete } from 'primereact/autocomplete';
import { useState } from 'react';

// const counties = ['Alba', 'Arad', 'Arges', 'Bacau', 'Bihor', 'Bistrita-Nasaud'];
const counties = [
    { 'name': 'Alba', value: 'Alba' }, 
    { 'name': 'Arad', value: 'Arad' }, 
    { 'name': 'Arges', value: 'Arges'}, 
    { 'name': 'Bacau', value: 'Bacau'}
];

const AutocompleteFormField = (props) => {
    const [selectedCounty, setSelectedCounty] = useState(null);
    const [filteredCounties, setFilteredCounties] = useState(null);

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
                    onChange={(e) => setSelectedCounty(e.value)}
                    field="name"
                    panelClassName='county-ac-list'
                    {...props}
                />
            </div>
        </>
    )
}

export default AutocompleteFormField;