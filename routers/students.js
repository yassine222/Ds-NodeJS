const router = require('express').Router();
const {Student, student_schema, student_update_schema} = require('../models/student');
const fs = require("fs");
const Joi = require("joi");

// reading data
const studentsData = fs.readFileSync("./students.json");
const students = JSON.parse(studentsData);


// endpoint all students
router.get("/get_all", (req, res) => {
    res.send(students.map((student) => student));
  });


  
// endpoint add 
router.post("/add", (req, res) => {
 
    let validation_results=student_schema.validate(req.body);
    
    if (validation_results.error) {
        return res.status(400).send(validation_results.error.message);
    }
  
    
    let student = {
        nom: req.body.nom,
        classe: req.body.classe,
        modules : req.body.modules
    }
    student.moyenne = calculateAverage(student.modules);
    students.push(student);
    saveStudentsData(students);
  
    res.send(student);
  });
  
  // endpoint student
  router.get("/get/:nom", 
  (req, res) => {
    const student = students.find ( (Student) => Student["nom"] === req.params.nom );
  
    if (!student) {
      res.status(404).send("student not found");
      return;
    }
  
    res.send(student);
  });

  // endpoint edit
  router.put('/put/:nom', function(req, res) {
    let validation_results=student_update_schema.validate(req.body);
    if(validation_results.error)
        return res.status(400).send(validation_results.error.message);
   
    
    const nom = req.params.nom;
    const student = req.body;
  
 
    const data = fs.readFileSync('students.json');
    const students = JSON.parse(data);
  

    const index = students.findIndex(Student => Student.nom === nom);
    if (index !== -1) {
      students[index] = student;
      student.moyenne = calculateAverage(student.modules);


      fs.writeFileSync('students.json', JSON.stringify(students));
  
      res.send(`Student ${nom} updated successfully.`);
    } else {
      res.status(404).send(`Student ${nom} not found.`);
    }
  });
  
  // endpoint delete
  router.delete("/del/:nom", (req, res) => {
    const Index = students.findIndex((Student) => Student["nom"] === req.params.nom);
    const name = req.params.nom
    if (Index === -1) {
      res.status(404).send("Student not found");
      return;
    }
    students.splice(Index, 1);
    saveStudentsData(students);
  
    res.send(`student ${name} deleted`);
  });
  
  // enpoint maxmin
  router.get("/maxmin", (req, res) => {
    const maxminnote = students.map((student) => {
      const max = Math.max(...student.modules.map((m) => m["note"]));
      const min = Math.min(...student.modules.map((m) => m["note"]));
      return {
        nom: student.nom,
        max: max,
        min: min,
      };
    });
  
    res.send(maxminnote);
  });
// endpoint moyenne each
  router.get("/moyenne", (req, res) => {
    const nbr_students = students.length
  
    const moyennes = students.reduce((acc, student) => {
      return (
        acc +
        student["moyenne"]
      );
    }, 0);
  
    const moyenne = moyennes / nbr_students;
  
    res.send({ moyenne });
  });
  
  

// functions
  function calculateAverage(modules) {
    const totalNotes = modules.reduce((acc, module) => {
      return acc + module["note"];
    }, 0);
  
    return totalNotes / modules.length;
  }
  
  function saveStudentsData(data) {
    fs.writeFileSync("./students.json", JSON.stringify(data));
  }



module.exports=router;