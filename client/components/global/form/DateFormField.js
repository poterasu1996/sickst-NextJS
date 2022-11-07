import { Calendar } from "primereact/calendar"
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import { useState } from "react";

const DateFormField = (props) => {
    const [date, setDate] = useState();
    return (
        <>  
            <div className="form-field date-field">
                <div className="calendar-i">
                    <i className="pi pi-calendar" style={{'fontSize': '1.7rem', 'color': '#fff'}}></i>
                </div>
                <Calendar 
                    className="date-form-control"
                    {...props}
                    value={date}
                    onChange={e => setDate(e.value)}
                ></Calendar>
            </div>
        </>
    )
}

export default DateFormField;