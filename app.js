let express = require('express')
let fetch = require('node-fetch')
let qstring = require('querystring')
let app = express()

let url = `https://api.exchangeratesapi.io/latest?base=CAD`

function sendResponse(data, res)
{
    let page = '<html><body><style>body{font:13px "Courier New";}ul{list-style-type:none}</style><form method="post">Amount (in CAD): <input name="amount"><input type="submit" value="Submit"></form>'
    
    if(data)
    {
        let rates = data.rates
        let amount = data.amount
        let base = data.base

        page += amount.toFixed(2) + ' ' + base + '<ul>'
        for (rate in rates)
        {
            if(base !== rate)
                page += '<li>' + rate + ': ' + (rates[rate] * amount).toFixed(2) + '</li>'
        }
        page += '</ul>'
    }
    
    page += '</body></html>'
    res.send(page)
    res.end()
}

function getRates(reqData, res)
{
    fetch(url, {cache: "force-cache"})  //cache fetch promise
    .then(response => response.json())
    .then(data =>
        {
            data["amount"] = parseFloat(reqData);
            console.log(data);
            sendResponse(data, res);
        })
    .catch(error => console.log(error)
    );
}

app.post("*", function(req, res)
{
    let reqData;

    req.on('data', function(chunk)
    {
        reqData += chunk;
    })

    req.on('end', ()=>
    {
        getRates(qstring.parse(reqData).undefinedamount, res);
    })
})

app.get("*", function(req, res)
{
    sendResponse(null, res)
})

app.listen(3000, (err)=>
{
    if(err)
        console.log(err)
    else
        console.log('Server up')
})
