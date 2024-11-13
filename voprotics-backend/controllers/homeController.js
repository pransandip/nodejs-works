const homeController = (req, res) => {
    // res.render('index', { title: 'Express' });    
    res.send(`<h1>Voptrics</h1><p>Welcome to Voptrics</p>`)
}

module.exports = {
    homeController
}