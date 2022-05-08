import valid from 'card-validator';

export default function validateInfo(values) {
    let errors = {}
    let creditCard = valid.number(values.number)

    creditCard.expirationDate = valid.expirationDate(values.expiration)
    creditCard.cardholderName = valid.cardholderName(values.name)
    creditCard.cvv = valid.cvv(values.ccvv)

    console.log(creditCard)

    errors.show = true
    errors.variant = 'danger'
    errors.message = 'An unknown error occured. Please try again later'
    errors.cname = false
    errors.cnumber = false
    errors.cexp = false
    errors.ccvv = false

    console.log('ERRORS',errors)
    return errors;
}