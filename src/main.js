import "./css/index.css"
import IMask from "imask"

// Pegando as cores dos cartões
const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path')
const ccBgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path')


// Pegando a img dos cartões
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img')


function setcardType(type) {
    const colors = {
        visa: ['#2D57F2', '#436D99'],
        mastercard: ['#DF6F29', '#C69347'],
        default: ['back', 'gray'],   
    }    
    
    ccBgColor01.setAttribute('fill', colors[type][0]),
    ccBgColor02.setAttribute('fill', colors[type][1]),
    ccLogo.setAttribute('src', `cc-${type}.svg`)
}

globalThis.setcardType = setcardType

// Security Code
const securityCode = document.querySelector('#security-code')
const securityCodePattern = {
    mask: '0000'
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)


// Expiration Date
const expirationDate = document.querySelector('#expiration-date')
const expirationDatePattern = {
    // Mes e Ano
    mask: 'MM{/}YY',

    // Limitador de data
    blocks: {
        MM:{
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        },

        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date ().getFullYear()).slice(2),
            to: String(new Date ().getFullYear() + 7).slice(2)

        }
    }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector('#card-number')
const cardNumberPattern = {
    mask: [
        {
            mask: '0000 0000 0000 0000',
            RegExp: /^4\d{0, 15}/,
            cardType: 'visa'
        },
        {
            mask: '0000 0000 0000 0000',
            RegExp: /(5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardType: 'mastercard'
        },
        {
            mask: '0000 0000 0000 0000',
            cardType: 'Default'
        },
    ],
    dispatch: function (appended, dynamicMasked) {
        // Apenas aceita digitos, e não letras
        const number = (dynamicMasked.value + appended).replace(/\D/g, '')
    }
}








