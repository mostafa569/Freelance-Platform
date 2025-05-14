const express = require('express');
const router = express.Router();
const {getAllQuestions , createQuestion , deleteQuestion , updateQuestion, SubmitExam} = require('../Controller/questionController');
const { validationMiddleware } = require('../Middleware/validationMiddleware');
const { questionValidation } = require('../Validation/QuestionValidation');
const { createExam, getAllExams, updateExam, deleteExam, getExamById, getResultStudent, getAllResult , getStudentAttempts } = require('../Controller/examController');
const { examValidation } = require('../Validation/examValidation');
const { auth } = require('../Middleware/authMiddleware');
const { authentication } = require('../Middleware/authenticationMiddleware');
router.use(auth);
router.get('/student/my-attempts', authentication("student"), getStudentAttempts);

router.get('/student/results/:attemptId', getResultStudent);
router.get('/admin/results/all/', getAllResult);
router.get('/',authentication("student", "teacher"),getAllExams);
router.get('/:examId',authentication("student", "teacher"),getExamById);
router.post('/create/',authentication("teacher"),validationMiddleware(examValidation),createExam);
router.put('/update/:examId',authentication("teacher"),updateExam);
router.delete('/delete/:examId',authentication("teacher"),deleteExam);

router.get('/:examId/questions/',getAllQuestions);
router.post('/:examId/questions/',authentication("teacher"),validationMiddleware(questionValidation),createQuestion);
router.put('/:examId/questions/:questionId',authentication("teacher"),updateQuestion);
router.delete('/:examId/questions/:questionId',authentication("teacher"),deleteQuestion);
router.post('/submit/:examId',SubmitExam);


module.exports = router;
