// Import each role class
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

// Import dependencies
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");


const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { CLIENT_RENEG_LIMIT } = require("tls");

var teamMembers = [];

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)


const managerQuestions = [

    // {
    //     type: "input",
    //     name: "teamName",
    //     message: "Please enter team name",
    // },

    {
        type: "input",
        name: "name",
        message: "Please enter manager name",
        validate: answer => (answer.length < 1) ? console.log("Your input is required") : true
    },

    {
        type: "input",
        name: "id",
        message: "Please enter employee ID",
        // Todo: Need to add test here to make sure the input is number
        validate: answer => (answer.length < 1) ? console.log("Your input is required") : true
    },

    {
        type: "input",
        name: "email",
        message: "Please enter manager's email address",

        // Todo: Need to add test here to make sure the input is email
        validate: answer => (answer.length < 1) ? console.log("Your input is required") : true
    },


    {
        type: "input",
        name: "officeNumber",
        message: "Please enter manager office number",
        // Todo: Need to add test here to make sure the input is number

    },

    {
        type: "confirm",
        name: "mgrAddMember",
        message: "Would you like to add a team member?",
        // choices: ["Yes", "No"]

    },
]

const employeeQuestions = [

    {
        type: "input",
        name: "name",
        message: "Please enter employee name",

        validate: answer => (answer.length < 1) ? console.log("Your input is required") : true
    },
    {
        type: "input",
        name: "id",
        message: "Please enter employee ID",
        // Todo: Need to add test here to make sure the input is number
        validate: answer => (answer.length < 1) ? console.log("Your input is required") : true
    },
    {
        type: "input",
        name: "email",
        message: "Please enter email address",

        // Todo: Need to add test here to make sure the input is email
        validate: answer => (answer.length < 1) ? console.log("Your input is required") : true
    },
    {
        type: "list",
        name: "role",
        message: "What is job role of this team member?",
        choices: ["Engineer", "Intern"]

    },
    {
        when: answer => (answer.role) === "Engineer",
        type: "input",
        name: "github",
        message: "Please enter your github username",
        validate: answer => (answer.length < 1) ? console.log("Your input is required") : true

    },
    {
        when: answer => (answer.role) === "Intern",
        type: "input",
        name: "school",
        message: "Please enter your school name",
        validate: answer => (answer.length < 1) ? console.log("Your input is required") : true

    },
    {
        type: "confirm",
        name: "addMore",
        message: "Would you like to add another member?",
    }

]


function addTeamMembers() {

    inquirer
        .prompt(managerQuestions)
        .then(answer => {

            var teamManager = new Manager(answer.name, answer.id, answer.email, answer.officeNumber);
            teamMembers.push(teamManager);
            console.log(teamMembers);

            // console.log(answer.mgrAddMember);
            if (answer.mgrAddMember === true) {
                addMoreTeamMembers();
            } else {
                renderTeamHtml(teamMembers);
            }

        })

}

function addMoreTeamMembers() {

    inquirer
        .prompt(employeeQuestions)
        .then(answer => {

            // console.log(answer.role);
            if (answer.role === "Engineer") {
                var newMember = new Engineer(answer.name, answer.id, answer.email, answer.github);
            } else if (answer.role === "Intern") {
                var newMember = new Intern(answer.name, answer.id, answer.email, answer.school);
            }

            teamMembers.push(newMember);
            console.log(teamMembers);

            // console.log(answer.addMore);
            if (answer.addMore === true) {
                addMoreTeamMembers();
            } else {
                renderTeamHtml(teamMembers);
            }
        })

}

function useTemplate(role, name, id, email, specialInfo) {

    let card =fs.readFileSync(`./templates/${role}.html`,'utf8')
    card = card.replace("name", name);
    card = card.replace("role", role);
    card = card.replace("id", id);
    card = card.replace("emailLink", email);
    card = card.replace("emailAddress", email);
    card = card.replace("officeNumber",specialInfo);
    card = card.replace("gitHubLink",specialInfo);
    card = card.replace("gitHubAccount",specialInfo);
    card = card.replace("school",specialInfo);

    fs.appendFileSync(outputPath, card, err => {if (err) throw err;})
    console.log ("card appended");
}

function renderTeamHtml(teamMembers) {

    let main = fs.readFileSync("./templates/main.html");
    fs.writeFileSync(outputPath, main, function (err) {
        if (err) throw (err);
    });

    for (member of teamMembers) {
        if (member.getRole() === "Manager") {
            useTemplate("Manager", member.getName(), member.getId(), member.getEmail(), member.getOfficeNumber());
        }
        else if (member.getRole() == "Engineer") {
            useTemplate("Engineer", member.getName(), member.getId(), member.getEmail(), member.getGithub());
        }
        else if (member.getRole() == "Intern") {
            useTemplate("Intern", member.getName(), member.getId(), member.getEmail(), member.getSchool());
        }
    }

    fs.appendFileSync(outputPath, "</div></div></body></html>", function (err) {
        if (err) throw err;
    });
}


// EXECUTION
addTeamMembers();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
