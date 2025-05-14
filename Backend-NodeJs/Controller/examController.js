const mongoose = require("mongoose");
const Exam = require("../Model/Exam");
const ThrowMessage = require("../utils/ThrowMessage");
const { catchHandler } = require("../utils/CatchHandler");
const Answer = require("../Model/Answer");
const AttemptExam = require("../Model/AttemptExam");

exports.createExam = catchHandler(async (req, res, next) => {
    console.log(req.id);
    const { title, description } = req.body;
    const userId = req.userId;

    const exam = await Exam.create({
        title,
        description,
        created_by: userId,
    });

    return res.status(201).json({
        message: "Exam created successfully",
        status: "success",
        data: exam,
    });
});

exports.getAllExams = catchHandler(async (req, res, next) => {
    const exams = await Exam.find().populate("created_by", "username email");

    const examsWithEditableFlag = exams.map(exam => ({
        ...exam._doc,
        isEditable: req.userId && exam.created_by && req.userId.toString() === exam.created_by._id.toString()
    }));

    return res.status(200).json({
        message: "Exams fetched successfully",
        status: "success",
        exams: examsWithEditableFlag,
    });
});

exports.getExamById = catchHandler(async (req, res, next) => {
    const { examId } = req.params;

    console.log(`Received exam ID: ${examId}`); // Log لمعرفة الـ id اللي بيتبعت

    if (!mongoose.Types.ObjectId.isValid(examId)) {
        console.log(`Invalid exam ID format: ${examId}`);
        return next(new ThrowMessage(400, "Invalid Exam ID format"));
    }

    const exam = await Exam.findById(examId).populate("created_by", "username");

    if (!exam) {
        return next(new ThrowMessage(404, "Exam not found"));
    }

    return res.status(200).json({
        message: "Exam fetched successfully",
        status: "success",
        data: exam,
    });
});

exports.updateExam = catchHandler(async (req, res, next) => {
    const id = req.params.examId;
    console.log(req.params);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ThrowMessage(400, "Invalid Exam ID format"));
    }

    const exam = await Exam.findById(id);

    if (!exam) {
        return next(new ThrowMessage(404, "Exam not found"));
    }

    if (exam.created_by.toString() !== req.userId) {
        return next(new ThrowMessage(403, "Not authorized to update this exam"));
    }

    const { title, description } = req.body;
    if (title) exam.title = title;
    if (description) exam.description = description;

    await exam.save();

    return res.status(200).json({
        message: "Exam updated successfully",
        status: "success",
        data: exam,
    });
});

exports.deleteExam = catchHandler(async (req, res, next) => {
    const id = req.params.examId;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ThrowMessage(400, "Invalid Exam ID format"));
    }

    const exam = await Exam.findOneAndDelete({
        _id: id,
        created_by: req.userId,
    });

    if (!exam) {
        return next(new ThrowMessage(404, "Exam not found or not authorized"));
    }

    return res.status(200).json({
        message: "Exam deleted successfully",
        status: "success",
    });
});


exports.getResultStudent = catchHandler(async (req, res, next) => {
    const { attemptId } = req.params;

    const attempt = await AttemptExam.findById(attemptId).populate('examId userId');
    if (!attempt) return next(new ThrowMessage(404, "Attempt not found"));

    const answers = await Answer.find({ attemptId })
        .populate('questionId selectedOptionId');

    const result = {
        exam: attempt.examId,
        student: attempt.userId,
        totalScore: attempt.totalScore,
        answers: answers.map(ans => ({
            question: ans.questionId?.questionText,
            selectedOption: ans.selectedOptionId?.optionText,
            score: ans.score
        }))
    };

    res.status(200).json({ status: 'success', result });
})

exports.getAllResult = catchHandler(async (req, res, next) => {
    console.log(req.userId);
    const teacherId = req.userId;

    const exams = await Exam.find({ created_by: teacherId });
    const examIds = exams.map(e => e._id);

    const attempts = await AttemptExam.find({ examId: { $in: examIds } })
        .populate('examId userId');

    const results = await Promise.all(
        attempts.map(async (attempt) => {
            const answers = await Answer.find({ attemptId: attempt._id }).populate('questionId selectedOptionId');
            return {
                examTitle: attempt.examId.title,
                student: attempt.userId,
                totalScore: attempt.totalScore,
                answers: answers.map(ans => ({
                    question: ans.questionId?.questionText,
                    selectedOption: ans.selectedOptionId?.optionText,
                    score: ans.score
                }))
            };
        })
    );

    res.status(200).json({ status: 'success', results });
});
exports.getStudentAttempts = async (req, res) => {
    try {
        const studentId = req.userId;

        const attempts = await AttemptExam.find({ userId: studentId }).select('examId _id');

        const formatted = attempts.map(a => ({
            examId: a.examId.toString(),
            attemptId: a._id.toString()
        }));

        res.status(200).json(formatted);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error while fetching student attempts.' });
    }
};