const dotenv = require('dotenv');
dotenv.config();
const Host = process.env.DATABASE_HOST;
const User = process.env.DATABASE_USER;
const Password = process.env.DATABASE_PASSWORD;
const Database = process.env.DATABASE_NAME;

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: Host,
        user: User,
        password: Password,
        database: Database
    }
});
//asign models

//register api
exports.register = (req, res) => {
    //validator
    if(!req.body.teacher || typeof req.body.teacher != 'string'){
        return res.status(400).send("Teacher's is required and must be string email");
    }

    if(!req.body.students || typeof req.body.students != 'object'){
        return res.status(400).send("Students' email are required ");
    }

    let students = req.body.students;
    let teacher = req.body.teacher;
    let course_name = 'test';

    try{
        knex.from('students').whereIn('email', students).pluck('id').distinct().then((student_ids) => {
            knex.from('teachers').where('email', teacher).first('id').then((teacher_id) => {
                student_ids.forEach((id) => {
                    knex.from('enrolls')
                    .where('teacher_id', teacher_id.id)
                    .where('student_id', id)
                    .where('status', 'A')
                    .where('course_name', course_name)
                    .pluck('id').distinct().then((found) => {
                        //to avoid duplicate
                        if(found.length == 0){
                            knex('enrolls').insert({teacher_id: teacher_id.id, student_id: id, status: 'A', course_name: 'test'}).catch(()=>{});
                        }
                    });
                });
            });
        });
    }catch(err){
        return res.status(500).send('Server Error!');
    }
    return res.status(204).send('Registered');
};

//get commons students
exports.common_student = (req, res) => {
    //validator
    if(!req.query.teacher){
        return res.status(300).send("Teacher's email is required!");
    }

    let teachers = req.query.teacher;
    
    try{
        if(typeof req.query.teacher == 'string'){
            knex('enrolls').select('students.email')
                .leftJoin('teachers', 'teachers.id', 'enrolls.teacher_id')
                .leftJoin('students', 'students.id', 'enrolls.student_id')
                .where('teachers.email', teachers)
                .distinct()
                .pluck('students.email')
                .then((data) => {
                    return res.status(200).json({'students':data});
                });
        }else{
            knex('enrolls').select('students.email').count('* as counter')
                .leftJoin('teachers', 'teachers.id', 'enrolls.teacher_id')
                .leftJoin('students', 'students.id', 'enrolls.student_id')
                .whereIn('teachers.email', teachers)
                .groupBy('students.email')
                .having('counter', '>', 1)
                .pluck('students.email')
                .then((data) => {
                    return res.status(200).json({'students':data});
                });
        }
    }catch(err){
        return res.status(500).send('Server Error!');
    }
};

//suspend student
exports.suspend = (req, res) => {
    if(!req.body.student || typeof req.body.student != 'string'){
        return res.status(300).send("Student's email is required and must be valid email!");
    }

    let student = req.body.student;

    try{
        knex('students').where('email', student).first('id').then((student_id) => {
            if(student_id.id){
                knex('enrolls').where('student_id', '=', student_id.id)
                .update({
                    status: 'S'
                }).then(() => {});
            }
        });
    }catch(err){
        return res.status(500).send('Server Error!');
    }

    return res.status(204).send('Suspend student:' + student);
};

exports.retrieve_for_notification = (req, res) => {
    //validate
    if(!req.body.teacher | typeof req.body.teacher != 'string'){
        return res.status(400).send("Teacher's email is required and must be string email");
    }

    if(!req.body.notification || typeof req.body.notification != 'string'){
        return res.status(400).send("Notification is not allow empty");
    }

    let teacher = req.body.teacher;
    let notification = req.body.notification;

    //get notification email
    let notification_emails = notification.split(' @').filter((dt) => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(dt);
    });

    try{
        knex('enrolls').where('teacher_id', function(){
            this.select('id').from('teachers').where('email', teacher);
        }).pluck('student_id').then((student_ids) => {
            knex('students').whereIn('id', student_ids).pluck('email').then((emails) => {
                let combined = emails.concat(notification_emails);
                let result = combined.filter((item, pos) => {return combined.indexOf(item) == pos});
                return res.status(200).json({'recipients': result});
            });
        });
    }catch(err){
        return res.status(500).send('Server Error!');
    }
};