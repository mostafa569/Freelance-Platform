const { catchHandler } = require("../utils/CatchHandler");
const Question = require('../Model/Question');
const ThrowMessage = require("../utils/ThrowMessage");
const Exam = require('../Model/Exam');
const { default: mongoose } = require("mongoose");
const AttemptExam = require("../Model/AttemptExam");
const QuestionOpetion = require("../Model/QuestionOpetion");
const Answer = require("../Model/Answer");

exports.getAllQuestions = catchHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.examId)) {
        return next(new ThrowMessage(400, "Invalid examId format. Must be a 24 character hex string."));
    }

    const questions = await Question.find({ examId: req.params.examId }).populate('examId').lean();
    const questionIds = questions.map(q => q._id);

    const options = await QuestionOpetion.find({ questionId: { $in: questionIds } }).lean();

    const questionsWithOptions = questions.map(question => ({
        ...question,
        options: options.filter(option => option.questionId.toString() === question._id.toString())
    }));

    res.status(200).json({
        message: "Success Get All Questions Process",
        status: 'success',
        allQuestions: questionsWithOptions,
    });
});

exports.createQuestion = catchHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.examId)) {
        return next(new ThrowMessage(400, "Invalid examId format. Must be a 24 character hex string."));
    }

    const { questionText, questionType, points } = req.body;
    if (!questionText || !questionType) {
        return next(new ThrowMessage(400, "questionText and questionType are required."));
    }

    const question = await Question.create({ examId: req.params.examId, questionText, questionType, points });

    return res.status(201).json({
        message: "Success Created Question Process",
        status: 'success',
        question: question
    });
});

exports.updateQuestion = catchHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.examId)) {
        return next(new ThrowMessage(400, "Invalid examId format. Must be a 24 character hex string."));
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        return next(new ThrowMessage(400, "Invalid questionId format. Must be a 24 character hex string."));
    }

    const exam = await Exam.findById(req.params.examId);
    if (!exam) {
        return next(new ThrowMessage(404, "There Is No Exam"));
    }

    const questionSpesific = await Question.findOne({ _id: req.params.questionId, examId: req.params.examId });
    if (!questionSpesific) {
        return next(new ThrowMessage(404, "There Is No Questions"));
    }

    const questionUpdated = await Question.updateOne(
        { _id: req.params.questionId, examId: req.params.examId },
        { ...req.body },
        { runValidators: true }
    );

    if (questionUpdated.nModified === 0) {
        return next(new ThrowMessage(400, "No changes made to the question"));
    }

    return res.status(200).json({
        message: "Success Updated Question Process",
        status: 'success',
    });
});

exports.deleteQuestion = catchHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.examId)) {
        return next(new ThrowMessage(400, "Invalid examId format. Must be a 24 character hex string."));
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        return next(new ThrowMessage(400, "Invalid questionId format. Must be a 24 character hex string."));
    }

    const exam = await Exam.findById(req.params.examId);
    if (!exam) {
        return next(new ThrowMessage(404, "There Is No Exam"));
    }

    const questionSpesific = await Question.findOne({ _id: req.params.questionId, examId: req.params.examId });
    if (!questionSpesific) {
        return next(new ThrowMessage(404, "There Is No Questions"));
    }

    await questionSpesific.deleteOne();
    await QuestionOpetion.deleteMany({ questionId: req.params.questionId });

    return res.status(200).json({
        message: "Success Deleted Question Process",
        status: 'success',
    });
});

exports.SubmitExam = catchHandler(async (req, res, next) => {
    const { examId } = req.params;
    const { answers } = req.body;
    const userId = req.userId;

    // Validate userId from auth middleware
    if (!userId) {
        return next(new ThrowMessage(401, 'User ID is missing. Please authenticate with a valid token.'));
    }

    // Create a new attempt
    const addAttempt = await AttemptExam.create({ examId, userId });
    let totalScore = 0;

    // Process each answer
    for (let answer of answers) {
        // Validate questionId
        if (!mongoose.Types.ObjectId.isValid(answer.questionId)) {
            return next(new ThrowMessage(400, 'Invalid questionId format. Must be a 24 character hex string.'));
        }

        // Validate selectedOptionId
        if (!mongoose.Types.ObjectId.isValid(answer.selectedOptionId)) {
            return next(new ThrowMessage(400, 'Invalid selectedOptionId format. Must be a 24 character hex string.'));
        }

        // Find the question
        const question = await Question.findById(answer.questionId);
        if (!question) {
            return next(new ThrowMessage(404, 'Question not found'));
        }

        // Handle multiple_choice or true_false questions
        if (question.questionType === 'multiple_choice' || question.questionType === 'true_false') {
            let score = 0;
            const correctOption = await QuestionOpetion.findOne({ questionId: answer.questionId, isCorrect: true });
            if (correctOption && String(correctOption._id) === answer.selectedOptionId) {
                score = question.points;
                totalScore += score;
            }
            await Answer.create({
                attemptId: addAttempt._id,
                questionId: answer.questionId,
                selectedOptionId: answer.selectedOptionId,
                score: score
            });
        }
        // Handle short_answer questions
        else if (question.questionType === 'short_answer') {
            await Answer.create({
                attemptId: addAttempt._id,
                questionId: answer.questionId,
                selectedOptionId: answer.selectedOptionId,
                score: 0
            });
        }
    }

    // Update total score in the attempt
    addAttempt.totalScore = totalScore;
    await addAttempt.save();

    // Log the created attempt for debugging
    console.log('Created attempt:', addAttempt);

    // Return response with attemptId
    return res.status(200).json({
        message: 'Exam submitted successfully',
        score: totalScore,
        attemptId: addAttempt._id
    });
});