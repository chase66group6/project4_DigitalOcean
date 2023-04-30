// Authors Dillon Vaughan && Chase Sisson
// File: login.js
// Class: COP 3813
// Project 4
const mongoose = require("mongoose");
const User = mongoose.model("User");
const searchResults = [];
const bcrypt = require('bcrypt');
//const popup = require('popups');


const main = {
    root: async (req, res) => {
        // if the user session exisits, show 
        // every entry created by the user
        // currently signed in
        if (req.session.user) {
            // Use this user info to look up their reports 
            const reportsSearch = await Reports.find({
                reportMadeBy: req.session.user.username
            }
            ).lean();
            // Show secret stuff 
            res.render('home', { reports: reportsSearch });
        } else {
            res.render('home');
        }
    },

    report: async (req, res) => {
        // Get the disaters from the DB
        const newVar = await Disaster.find({}).lean();
        // Show the disasters in the drop down
        res.render('report', { disasters: newVar });
    },

    processReport: async (req, res) => {

        // This method of creating a new object will return a report to 
        // be saved to the database 
        const data = Object.keys(req.body).reduce((obj, key) => {
            if (req.body[key]) {
                obj[key] = req.body[key];
            }
            return obj;
        }, {});

        //   // waiting on the database
        const newReport = await new Reports(data);
        // appending the object to be uploaded to the db
        newReport["reportMadeBy"] = req.session.user.username;

        // Saving the report to the db
        const variableHere = await newReport.save();

        // Showing the report page once again 
        res.render('report');
    },

    // Search shows the user the search page
    search: (req, res) => {
        // rendering the basic search page
        res.render('search');
    },

    // Post search processes the info given by ther user 
    postSearch: async (req, res) => {
        // reports Search will return an array of 
        // all results that match the search 
        // criteria 
        const reportsSearch = await Reports.find({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            areaCode: req.body.areaCode,
            exchange: req.body.exchange,
            extension: req.body.extension
        }
        ).lean();
        // Displaying the results of the search
        res.render('search', { reports: reportsSearch });
    },

    admin: async (req, res) => {
        const currentDisasters = await Disaster.find({}).lean();
        const currentReports = await Reports.find({}).lean();

        //an array with all the disaster IDs
        //starting with a count of 0 for reports
        let disasterReport = [
            { _id: "642a12c05ee66a25a18ea0d4", name: "", count: 0 },
            { _id: "642a12c15ee66a25a18ea0da", name: "", count: 0 },
            { _id: "642a12c15ee66a25a18ea0de", name: "", count: 0 },
            { _id: "642a12c25ee66a25a18ea0e4", name: "", count: 0 }

        ];

        //this counts the number of reports for each disaster
        for (let i = 0; i < currentReports.length; i++) {
            const ID = currentReports[i].disaster;

            for (let i = 0; i < disasterReport.length; i++) {
                if (disasterReport[i]._id == ID) {
                    disasterReport[i].count += 1;
                }
            }
        }

        const IDsObject = disasterReport;

        for (let i = 0; i < disasterReport.length; i++) {
            currentID = disasterReport[i]._id;

            for (let j = 0; j < currentDisasters.length; j++) {
                if (currentDisasters[j]._id == currentID) {

                    disasterReport[i].name = currentDisasters[j].name;

                }
            }
        }
        //filtering out any disasters with no active reports
        disasterReport = disasterReport.filter(e => e.count > 0);
        //displays all disasters with active reports
        //and the number of those reports
        res.render('dashboard', { disasters: disasterReport });
    },

    disasterDetails: async (req, res) => {
        const param_id = req.params._id;
        // console.log(param_id);
        const disastersClicked = await Reports.find({
            disaster: param_id
        }).lean();



        res.render('detail', { reports: disastersClicked });
    },


    //deletes reports from the database
    adminDeleteReports: async (req, res) => {

        const param_id = req.params._id;
        const disastersForDeletion = await Reports.deleteOne({
            _id: param_id
        }).lean();

        res.render('home');
    },

    AddUsers: async (req, res) => {
        //This encrypts the new users password
        //before it enters the database
        if (req.body.password === req.body.re_password) {
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(req.body.password, salt);

            const newUser = await User.create({
                username: req.body.username,
                password: hash,
            });
            // console.log(newUser);
            res.render('login');
        }else{console.log("Passwords don't match!!")
      /* popup.alert({
        content: "Passwords do not match"
       })*/
        res.render('login');
    }
    },
};

module.exports = main;