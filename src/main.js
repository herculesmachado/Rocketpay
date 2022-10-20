import "./css/index.css"
import IMask from "imask"

// Pegando as cores dos cartões
const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path')
const ccBgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path')

// Pegando a img dos cartões
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img')

function setTypeCard(type) {
    const colors = {
        visa: ["#436D99", "#2D57F2"],
        mastercard: ["#DF6F29", "#C69347"],
        default: ["black", "gray"],
    }  
    
    // Chamando as cores
    ccBgColor01.setAttribute('fill', colors[type][0]),
    ccBgColor02.setAttribute('fill', colors[type][1]),

    // chamando as imagens
    ccLogo.setAttribute('src', `cc-${type}.svg`)
}

globalThis.setTypeCard = setTypeCard

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

// Logica do numero do cartões
const cardNumber = document.querySelector('#card-number')
const cardNumberPattern = {
    mask: [
        {
            mask: '0000 0000 0000 0000',
            regex: /^4\d{0,15}/,
            cardtype: 'visa'
        },
        {
            mask: '0000 0000 0000 0000',
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardtype: 'mastercard'
        },
        {
            mask: '0000 0000 0000 0000',
            cardtype: 'default'
        },
    ],
    dispatch: function  (appended, dynamicMasked) {
        // Apenas aceita digitos, e não letras
        const number = (dynamicMasked.value + appended).replace(/\D/g, '')

        const foundMask = (dynamicMasked.compiledMasks.find(function (item) {
            //Ele vai me retornar algo, se for TRUE, ele me retorna algo, se for FALSE, não me retorna nada
            return number.match(item.regex)
            // Apenas pegando o item do regex
        })
        )

        setTypeCard(foundMask.cardtype)
        return foundMask
    },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

// Adicionando o button
const addButton = document.querySelector('#add-card')
addButton.addEventListener('click', () => {
    alert('cartão adicionado')
})

// Este pedaçõ de codigo, tem como evento, o STOP do reload da pagina
document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
})

// Este bloco de codico tem como função pegar os eventos de input do 'nome do titular', todo conteudo novo que eu digite no input, ele vai alterar no cardholder
const cardHolder = document.querySelector('#card-holder')
cardHolder.addEventListener('input', () => {
    const ccHolder = document.querySelector('.cc-holder .value')

    // Estou atribuindo um valor ao meu input, e caso seja true, ele escreve o nome digitado no input, caso seja false, vai aparecer o nome "FULANO DA SILVA" porque vai esta menor que 0
    ccHolder.innerText = cardHolder.value.length > 0 ? cardHolder.value : 'FULANO DA SILVA'
})

// OBS: A forma que esta sendo usada a function abaixo, é diferente, mas faz a mesma coisa da de cima, apenas exemplos diferentes com a mesma funcionalidade

// Estes blocos tem como função pegar o que esta sendo digitado no input do CVC, ou seja, a function updateSecurityCode esta fazendo a logica de, pegar o elemento do input pelo querySelector e atribuindo o no innerText. Já o securityCodeMasked esta chamando a function.
securityCodeMasked.on('accept', () => {
    updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code){
    const ccSecurity = document.querySelector('.cc-security .value')

    ccSecurity.innerText = code.length > 0 ? securityCodeMasked.value : '1234'
}

// Pegando o numero do cartão atraves dos mesmo exemplos.
// Este formato faz a mesmo coisa, apenas achei mais facil de escrever e entende a logica.
cardNumberMasked.on('accept', () => {

    // Estou acessando dentro do cardNumberMasked o masked e dentro do o currentMask escolher a melhor opção que se encaixa no tipo do cartão
    const cardType = cardNumberMasked.masked.currentMask.cardtype
    setTypeCard(cardType)

    updateCardNumber(cardNumberMasked.value)

})

function updateCardNumber(number) {
    const ccNumber = document.querySelector('.cc-number')

    ccNumber.innerText = number.length > 0 ? number : ''
}

// Bloco com função Expiraton do cartão
expirationDateMasked.on('accept', () => {

    updateExpirationDate(expirationDateMasked.value)
})
function updateExpirationDate(date) {
    const ccExpiration = document.querySelector('.cc-expiration .value')

    ccExpiration.innerText = date.length > 0 ? date : ''
}











