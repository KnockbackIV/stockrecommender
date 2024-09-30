document.getElementById('fetchButton').addEventListener('click', function() {
    const stockName = document.getElementById('stockInput').value.trim();
    if (stockName) {
        fetchStockData(stockName);
    } else {
        alert('Please enter a stock name.');
    }
});

function fetchStockData(stockName) {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function () {
        if (this.readyState === this.DONE) {
            const response = JSON.parse(this.responseText);
            if (response.futureOverviewData) {
                displayStockData(response.futureOverviewData, response.stockTechnicalData);
            } else {
                alert('Stock not found. Please try another stock name.');
            }
        }
    });

    xhr.open('GET', `https://indian-stock-exchange-api2.p.rapidapi.com/stock?name=${encodeURIComponent(stockName)}`);
    xhr.setRequestHeader('x-rapidapi-key', '7b8d0b1457msh354695b5207e5ccp19f79ajsna739d5153255');
    xhr.setRequestHeader('x-rapidapi-host', 'indian-stock-exchange-api2.p.rapidapi.com');

    xhr.send(null);
}

function displayStockData(data, technicalData) {
    document.getElementById('stockName').textContent = data.displayName;
    document.getElementById('currentPrice').textContent = `₹${data.price}`;
    document.getElementById('percentChange').textContent = `${data.percentChange}%`;
    document.getElementById('bid').textContent = `₹${data.bid}`;
    document.getElementById('ask').textContent = `₹${data.ask}`;
    document.getElementById('high').textContent = `₹${data.high}`;
    document.getElementById('low').textContent = `₹${data.low}`;
    document.getElementById('volume').textContent = data.volume;
    document.getElementById('date').textContent = data.date;

    displayTechnicalData(technicalData);
    displayRecommendation(data);
    document.getElementById('stockCard').style.display = 'block';
}

function displayTechnicalData(data) {
    const technicalDataContainer = document.getElementById('technicalData');
    technicalDataContainer.innerHTML = ''; // Clear previous data

    const technicalDetails = [
        { days: 5, bsePrice: data[0].bsePrice, nsePrice: data[0].nsePrice },
        { days: 10, bsePrice: data[1].bsePrice, nsePrice: data[1].nsePrice },
        { days: 20, bsePrice: data[2].bsePrice, nsePrice: data[2].nsePrice },
        { days: 50, bsePrice: data[3].bsePrice, nsePrice: data[3].nsePrice },
        { days: 100, bsePrice: data[4].bsePrice, nsePrice: data[4].nsePrice },
        { days: 300, bsePrice: data[5].bsePrice, nsePrice: data[5].nsePrice }
    ];

    technicalDetails.forEach(detail => {
        const techDetailDiv = document.createElement('div');
        techDetailDiv.className = 'tech-detail';
        techDetailDiv.innerHTML = `<span>${detail.days} Days</span><span>BSE: ₹${detail.bsePrice}, NSE: ₹${detail.nsePrice}</span>`;
        technicalDataContainer.appendChild(techDetailDiv);
    });

    // Show year high and low
    const yearHighLowDiv = document.createElement('div');
    yearHighLowDiv.className = 'tech-detail';
    yearHighLowDiv.innerHTML = `<span>Year High:</span><span>₹${data.yearHigh}</span>`;
    technicalDataContainer.appendChild(yearHighLowDiv);

    const yearLowDiv = document.createElement('div');
    yearLowDiv.className = 'tech-detail';
    yearLowDiv.innerHTML = `<span>Year Low:</span><span>₹${data.yearLow}</span>`;
    technicalDataContainer.appendChild(yearLowDiv);
}

function displayRecommendation(data) {
    const currentPrice = parseFloat(data.price);
    const prevClose = parseFloat(data.prevClose);
    const percentChange = parseFloat(data.percentChange);

    let recommendation = 'Hold';
    let marketStatus = 'Market is stable';

    if (percentChange > 1) {
        recommendation = 'Buy';
        marketStatus = 'Market is up';
    } else if (percentChange < -1) {
        recommendation = 'Sell';
        marketStatus = 'Market is down';
    } else if (currentPrice < prevClose) {
        recommendation = 'Sell';
        marketStatus = 'Market is down';
    } else if (currentPrice > prevClose) {
        recommendation = 'Buy';
        marketStatus = 'Market is up';
    }

    document.getElementById('recommendationValue').textContent = recommendation;
    document.getElementById('marketStatusValue').textContent = marketStatus;
}
