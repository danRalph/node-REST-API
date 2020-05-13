const express = require('express');
const router = express.Router();
const records = require('./records');

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            next(err);
        }
    };
}


router.get('/quotes', async (req, res) => {
    try {
        const quotes = await records.getQuotes();
        res.json(quotes);
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get('/quotes/:id', asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
        res.json(quote);
    } else {
        res.status(404).json({ message: "Quote not found" });
    }
}));

router.get('/quotes/quote/random', asyncHandler(async (req, res, next) => {
    const quote = await records.getRandomQuote();
    res.json(quote);
}));

router.post('/quotes', asyncHandler(async (req, res) => {
    if (req.body.author && req.body.quote) {
        const quote = await records.createQuote({
            quote: req.body.quote,
            film: req.body.film
        });
        res.status(201).json(quote);
    } else {
        res.status(400).json({ message: "Quote and author required" });
    }
}));

router.put('/quotes/:id', asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
        qoute.quote = req.body.quote;
        quote.film = req.body.film;

        await records.updateQuote(quote);
        res.status(204).end();
    } else {
        res.status(404).json({ message: "Quote not found" });
    }
}));

router.delete("/quotes/:id", asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    await records.deleteQuote(quote);
    res.status(204).end();
}));


module.exports = router;