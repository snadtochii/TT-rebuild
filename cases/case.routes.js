const express = require('express');
const router = express.Router();

const jwtCheck = require('../configs/guards');
const wrapper = require('../configs/wrapper');
const Case = require('./case.model');

router.get('', wrapper.wrapAsync(async (req, res, next) => {
    const result = await Case.getAllCases();
    res.json(result);
}));

router.get('/by-date', wrapper.wrapAsync(async (req, res, next) => {
    const result = await Case.getUserCasesByDate(req.query.userId, req.query.start, req.query.end);
    res.json(result);
}));

router.get('/:id', wrapper.wrapAsync(async (req, res, next) => {
    const result = await Case.getCaseById(req.params.id);
    res.json(result);
}));

router.post('', wrapper.wrapAsync(async (req, res, next) => {

    const newCase = new Case({
        caseId: req.body.caseId,
        caseType: req.body.caseType,
        steps: [{
            step: req.body.step,
            time: req.body.time,
            role: req.body.role, 
            brand: req.body.brand,
            date: new Date(req.body.date),
            doneBy: req.body.doneBy
        }]
    });
    const result = await Case.addOrUpdateCase(newCase);
    console.log(result);
    
    res.json(result);
}));

module.exports = router;
