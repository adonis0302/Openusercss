const indicatorElement = document.createElement('div')

indicatorElement.classList.add('loading-indicator')
indicatorElement.style.position = 'absolute'
indicatorElement.style.width = '100%'
indicatorElement.style.height = '100%'
indicatorElement.style.bottom = 0
indicatorElement.style.display = 'flex'
indicatorElement.style.justifyContent = 'center'
indicatorElement.style.alignItems = 'center'
indicatorElement.style.backgroundColor = 'black'
indicatorElement.style.zIndex = 100

indicatorElement.innerHTML = '<span style="color: white;">Loading...</span>'

document.querySelector('body').append(indicatorElement)
