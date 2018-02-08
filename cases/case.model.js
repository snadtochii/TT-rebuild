const mongoose = require('mongoose');
const User = require('../users/user.model');


const CaseSchema = mongoose.Schema({
    caseId: {
        type: String,
        required: true
    },
    caseType: {
        type: String,
        required: true
    },
    steps: [{
        step: {
            type: String,
            required: true
        },
        time: {
            type: Number,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        brand: {
            type: String
        },
        date: {
            type: Date,
            required: true
        },
        doneBy: {
            type: String,
            required: true
        }
    }]
});

const Case = module.exports = mongoose.model('Case', CaseSchema);

module.exports.getAllCases = async () => {
    const cases = await Case.find({});
    console.log(cases);
    if (cases) {
        return cases;
    } else {
        throw new Error('Something went wrong');
    }
}


module.exports.getUserCases = async (userId) => {
    const cases = await Case.find({ "steps.doneBy": userId });
    userSteps = cases.map(el => {
        const steps = el.steps.filter(step => step.doneBy === userId);
        return { id: el._id, caseId: el.caseId, caseType: el.caseType, steps };
    });
    console.log(userSteps, userId);
    if (userSteps) {
        return userSteps;
    } else {
        throw new Error('Steps not found');
    }
}

module.exports.getUserCasesByDate = async (userId, startDate, endDate) => {
    let userSteps;
    if (startDate && endDate) {
        const cases = await Case.find({ "steps.doneBy": userId, "steps.date": { "$gte": new Date(parseInt(startDate, 10)), "$lte": new Date(parseInt(endDate, 10)) } });
        userSteps = cases.map(el => {
            const steps = el.steps.filter(step => step.doneBy === userId && step.date >= new Date(parseInt(startDate, 10)) && step.date <= new Date(parseInt(endDate, 10)));
            return { id: el._id, caseId: el.caseId, caseType: el.caseType, steps };
        });
    } else {
        const cases = await Case.find({ "steps.doneBy": userId });
        userSteps = cases.map(el => {
            const steps = el.steps.filter(step => step.doneBy === userId);
            return { id: el._id, caseId: el.caseId, caseType: el.caseType, steps };
        });
    }

    if (userSteps) {
        return userSteps;
    } else {
        throw new Error('Steps not found');
    }
}

module.exports.getCaseById = async (caseId) => {
    const createdCase = await Case.findOne({ id: caseId });
    if (createdCase) {
        return createdCase;
    } else {
        throw new Error('Case');
    }
}

module.exports.addOrUpdateCase = async (newCase) => {
    const savedCase = await Case.findOne({ caseId: newCase.caseId });

    if (savedCase) {
        savedCase.steps.push(...newCase.steps);
        return await savedCase.save();
    } else {
        return await newCase.save();
    }
}