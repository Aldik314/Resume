document.addEventListener('DOMContentLoaded', function() {
    const takeNumberBtn = document.getElementById('take-number-btn');
    const ticketInfo = document.getElementById('ticket-info');
    const ticketNumberSpan = document.getElementById('ticket-number');
    
    if (!takeNumberBtn) return;
    
    let serviceType = takeNumberBtn.getAttribute('data-service');
    
    if (!serviceType) {
        serviceType = document.body.getAttribute('data-service');
    }

    if (!serviceType) {
        const pageTitle = document.title.toLowerCase();
        if (pageTitle.includes('deposit')) serviceType = 'deposit';
        else if (pageTitle.includes('insurance')) serviceType = 'insurance';
        else serviceType = 'bank_account';
    }

    const storageKey = `goliathCounter_${serviceType}`;
    
    let ticketCounter = localStorage.getItem(storageKey);
    
    if (ticketCounter === null) {
        ticketCounter = 1;
        console.log(`Starting new counter for ${serviceType} at 001`);
    } else {
        ticketCounter = parseInt(ticketCounter);
        console.log(`Continuing ${serviceType} from ticket:`, ticketCounter.toString().padStart(3, '0'));
    }
    
    let serviceNameDisplay = document.getElementById('service-name-display');
    if (!serviceNameDisplay) {
        const serviceParagraphs = ticketInfo.querySelectorAll('p');
        for (let p of serviceParagraphs) {
            if (p.textContent.includes('Service:')) {
                serviceNameDisplay = p.querySelector('span') || p;
                break;
            }
        }
    }
    
    let serviceName;
    switch(serviceType) {
        case 'bank_account':
            serviceName = 'Opening a bank account';
            break;
        case 'deposit':
            serviceName = 'Opening a deposit account';
            break;
        case 'insurance':
            serviceName = 'Getting insurance';
            break;
        default:
            serviceName = 'Bank service';
    }
    
    if (serviceNameDisplay) {
        if (serviceNameDisplay.tagName === 'SPAN') {
            serviceNameDisplay.textContent = serviceName;
        } else {
            serviceNameDisplay.innerHTML = `Service: ${serviceName}`;
        }
    }
    
    ticketInfo.style.display = 'none';
   
    takeNumberBtn.addEventListener('click', function() {
        console.log(`Customer requesting ${serviceName} ticket...`);
        
        if (ticketCounter > 999) {
            console.log(`Reached 999 for ${serviceType}, resetting to 001`);
            ticketCounter = 1;
        }
        
        const displayNumber = ticketCounter.toString().padStart(3, '0');
        
        takeNumberBtn.style.display = 'none';
        
        ticketNumberSpan.textContent = displayNumber;
        ticketInfo.style.display = 'block';
        
        ticketCounter++;
        
        if (ticketCounter > 999) {
            ticketCounter = 1;
        }
        
        localStorage.setItem(storageKey, ticketCounter);
        
        alert(`TICKET ISSUED\n\nService: ${serviceName}\nNumber: ${displayNumber}\n\nPlease wait for your number to be called.`);
        
        console.log(`${serviceName} ticket issued:`, displayNumber);
        console.log(`Next ${serviceName} ticket:`, ticketCounter.toString().padStart(3, '0'));
    });
    
    console.log(`${serviceName} counter:`, ticketCounter.toString().padStart(3, '0'));
});

