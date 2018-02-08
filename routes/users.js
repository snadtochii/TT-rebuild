"use strict";
const express = require("express");
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

const User = require('../models/user');


// Register
router.post('/register', (req, res, next) => {
	User.findOne({
		'username': req.body.username
	}, (err, user) => {
		if (err) throw err;
		if (user) {
			res.json({ success: false, msg: 'This username is already registered. Please try another' });
		} else {
			let newUser = new User({
				name: req.body.name,
				email: req.body.email,
				username: req.body.username,
				password: req.body.password
			});

			User.addUser(newUser, (err, user) => {
				if (err) {
					res.json({ success: false, msg: 'Failed to register user' });
				}
				else {
					res.json({ success: true, msg: 'User registered' });
				}
			});
		}
	})
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	User.getUserByUsername(username, (err, user) => {
		if (err) {
			return res.json({ success: false, msg: err });
		}//throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) throw err;
			if (isMatch) {
				res.json({
					success: true,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}
				});
			} else {
				return res.json({ success: false, msg: 'Wrong password' });
			}
		});
	});
});

// Profile
router.post('/profile', (req, res, next) => {
	const username = req.body.username;
	User.getUserByUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });
		} else {
			return res.json({ user: req.user });
		}
	});
});

// Add case
router.post('/cases/write', (req, res, next) => {
	const username = req.body.username;

	User.getUserByUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });
		}
		let newCase = {
			caseID: req.body.caseID,
			step: req.body.step,
			caseType: req.body.caseType,
			time: req.body.time,
			role: req.body.role,
			isOBL: req.body.isOBL,
			brand: req.body.brand,
			date: new Date()
		};
		console.log(newCase)
		User.update({ username: username }, { $push: { cases: newCase } }, () => { res.json({ success: true, msg: 'User was updated' }) });
	});
});


// Get time per day 
router.post('/cases/read', (req, res, next) => {
	const username = req.body.username;
	const dateObj = req.body.date;
	const role = req.body.role;
	const date = new Date(dateObj.y, dateObj.m - 1, dateObj.d);
	let todaysCases = [];
	let timeSynthes = 0, timeObl = 0;
	let separatedStep = 'images qc';

	User.getUserByUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });
		} else {

			user.cases.forEach((selectedCase, index, arr) => {
				if (selectedCase.date && selectedCase.time) {
					let selectedDate = new Date(selectedCase.date.getFullYear(), selectedCase.date.getMonth(), selectedCase.date.getDate());
					if (selectedDate.getTime() == date.getTime()) {
						if (role.toLowerCase() == separatedStep.toLowerCase()) {
							if (selectedCase.step && (selectedCase.step.toLowerCase() == separatedStep.toLowerCase())) {
								if (selectedCase.isOBL || (selectedCase.brand && selectedCase.brand.toLowerCase() === 'obl')) {
									timeObl += selectedCase.time;
								} else {
									timeSynthes += selectedCase.time;
								}
							}
						} else {
							if (selectedCase.step && (selectedCase.step.toLowerCase() != separatedStep)) {
								if (selectedCase.isOBL || (selectedCase.brand && selectedCase.brand.toLowerCase() === 'obl')) {
									timeObl += selectedCase.time;
								} else {
									timeSynthes += selectedCase.time;
								}
							}
						}
					}
				}
			});
			return res.json({ success: true, caseTime: { timeSynthes: timeSynthes, timeObl: timeObl } });
		}
	});
});

// Get all cases
router.post('/cases', (req, res, next) => {
	const username = req.body.username;

	User.getUserByUsername(username, (err, user) => {
		if (err) return res.json({ success: false, msg: err });// throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });
		} else {
			return res.json({ success: true, cases: user.cases });
		}
	});
});

// get cases per week
router.post('/cases/weekly', (req, res, next) => {
	const username = req.body.username;
	const startDate = new Date(req.body.startDate);
	const endDate = new Date(req.body.endDate);

	User.getUserByUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });
		} else {
			let weekCases = [];
			user.cases.forEach((el, i, arr) => {
				if (el.date && el.date >= startDate && el.date <= endDate) {
					weekCases.push(el);
				}
			});
			return res.json({ success: true, weekCases: weekCases });
		}
	});
});

// get time per week
router.post('/cases/weekly/time', (req, res, next) => {
	const username = req.body.username;
	const startDate = new Date(req.body.startDate);
	const endDate = new Date(req.body.endDate);

	const surgicasePattern = /^(OO).+/;

	User.getUserByUsername(username, (err, user) => {
		// console.log(user)
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });
		} else {
			let weekCasesTime = {
				weeklyTimeMM: [0, 0, 0, 0, 0, 0, 0],
				weeklyTimeCEMM: [0, 0, 0, 0, 0, 0, 0],
				weeklyTimeQEMM: [0, 0, 0, 0, 0, 0, 0],
				weeklyTimeOblCEMM: [0, 0, 0, 0, 0, 0, 0],
				weeklyTimeOblQEMM: [0, 0, 0, 0, 0, 0, 0],
				weeklyTimeImagesQCSynthesMM: [0, 0, 0, 0, 0, 0, 0],
				weeklyTimeImagesQCOblMM: [0, 0, 0, 0, 0, 0, 0],
				weeklyTimeImagesQCSurgicaseMM: [0, 0, 0, 0, 0, 0, 0],
				weeklyTimeImagesQCShoulderMM: [0, 0, 0, 0, 0, 0, 0],
				weeklyTimeImagesQCOtherMM: [0, 0, 0, 0, 0, 0, 0],
				totalWeeklyTimeMM: 0
			};

			user.cases.forEach((el, i, arr) => {
				if (el.date && el.date >= startDate && el.date <= endDate) {

					let ind = new Date(el.date).getDay();

					weekCasesTime.weeklyTimeMM[ind] += el.time;
					weekCasesTime.totalWeeklyTimeMM += el.time;

					if (el.role.toLowerCase() === 'ce') {
						(el.isOBL || (el.brand && el.brand.toLowerCase() === 'obl')) ? weekCasesTime.weeklyTimeOblCEMM[ind] += el.time : weekCasesTime.weeklyTimeCEMM[ind] += el.time;
					}
					if (el.role.toLowerCase() === 'qe') {
						if (el.step.toLowerCase() !== 'images qc') {
							(el.isOBL || (el.brand && el.brand.toLowerCase() === 'obl')) ? weekCasesTime.weeklyTimeOblQEMM[ind] += el.time : weekCasesTime.weeklyTimeQEMM[ind] += el.time;
						} else {
							if (!el.brand) {
								surgicasePattern.test(el.caseID) ? weekCasesTime.weeklyTimeImagesQCSurgicaseMM[ind] += el.time : weekCasesTime.weeklyTimeImagesQCSynthesMM[ind] += el.time;
							} else {
								switch (el.brand.toLowerCase()) {
									case 'synthes': {
										weekCasesTime.weeklyTimeImagesQCSynthesMM[ind] += el.time;
										break;
									}
									case 'obl': {
										weekCasesTime.weeklyTimeImagesQCOblMM[ind] += el.time;
										break;
									}
									case 'materialise osteotomies': {
										weekCasesTime.weeklyTimeImagesQCSurgicaseMM[ind] += el.time;
										break;
									}
									case 'djo':
									case 'lima':
									case 'mathys':
									case 'stryker': {
										weekCasesTime.weeklyTimeImagesQCShoulderMM[ind] += el.time;
										break;
									}
									default: {
										weekCasesTime.weeklyTimeImagesQCOtherMM[ind] += el.time;
										break;
									}
								}
							}
						}
					}
				}
			});
			for (var prop in weekCasesTime) {
				if (weekCasesTime.hasOwnProperty(prop)) {
					if (Array.isArray(weekCasesTime[prop]) && weekCasesTime[prop].every((el, i, arr) => { return el === 0; })) {
						weekCasesTime[prop] = null;
					} else if (prop === 0) {
						weekCasesTime[prop] = null;
					}
				}
			}
			return res.json({ success: true, weekCasesTime: weekCasesTime });
		}
	});
});

// get cases per day
router.post('/cases/details', (req, res, next) => {
	const username = req.body.username;
	const date = new Date(req.body.date);

	User.getUserByUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });
		} else {
			let cases = [];
			user.cases.forEach((el, i, arr) => {
				if (el.date && (el.date >= date && el.date <= new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1))) {
					cases.push(el);
				}
			});
			return res.json({ success: true, cases: cases });
		}
	});

})

// Add task
router.post('/tasks/new', (req, res, next) => {
	const username = req.body.username;
	User.getUserByUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });
		}

		let newTask = {
			title: req.body.title,
			description: req.body.desc,
			time: req.body.time,
			date: req.body.date
		}
		User.update({ username: username }, { $push: { tasks: newTask } }, () => { res.json({ success: true, msg: 'User was updated', task: newTask }) });
	});
});

// get tasks per week
router.post('/tasks/weekly', (req, res, next) => {
	const username = req.body.username;
	const startDate = new Date(req.body.startDate);
	const endDate = new Date(req.body.endDate);

	User.getUserByUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });
		} else {
			let weekTasks = [];
			user.tasks.forEach((el, i, arr) => {
				if (el.date && el.date >= startDate && el.date <= endDate) {
					weekTasks.push(el);
				}
			});
			return res.json({ success: true, weekTasks: weekTasks });
		}
	});
});

router.post('/tasks', (req, res, next) => {
	const username = req.body.username;

	User.getUserByUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });
		} else {
			return res.json({ success: true, weekTasks: user.tasks });
		}
	});
});
router.post('/tasks/weekly/time', (req, res, next) => {
	const username = req.body.username;
	const startDate = new Date(req.body.startDate);
	const endDate = new Date(req.body.endDate);

	User.getUserByUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });
		} else {
			let weekTasksTime = [0, 0, 0, 0, 0, 0, 0];

			if (user.tasks) {
				user.tasks.forEach((el, i, arr) => {
					if (el.date && el.date >= startDate && el.date <= endDate) {
						let ind = new Date(el.date).getDay();
						weekTasksTime[ind] += el.time;
					}
				});
			}
			weekTasksTime.every((el, i, arr) => { return el === 0; }) && (weekTasksTime = null);

			return res.json({ success: true, weekTasksTime: weekTasksTime });
		}
	});
});

module.exports = router;