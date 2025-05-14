const mongoose = require('mongoose');
const QuestionOpetion = require('../Model/QuestionOpetion');
const { catchHandler } = require('../utils/CatchHandler');
const ThrowMessage = require('../utils/ThrowMessage');
const Question = require('../Model/Question');

exports.getAllOptions = catchHandler(async (req, res, next) => {
    const { questionId } = req.params;
    const allOptions = await QuestionOpetion.find({ questionId: questionId }).populate('questionId');
    if (!allOptions || allOptions.length === 0) {
        return next(new ThrowMessage(404, "Question Not Found"));
    }
    return res.status(200).json({
        message: "Get All Options Successfully",
        status: "success",
        allOptions
    });
});

exports.createOption = catchHandler(async (req, res, next) => {
    const { questionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return next(new ThrowMessage(400, "Invalid question id format. Must be a 24 character hex string."));
    }

    const { optionText, isCorrect } = req.body;
    if (!optionText) {
        return next(new ThrowMessage(400, "optionText is required."));
    }

    const option = await QuestionOpetion.create({ questionId: questionId, optionText, isCorrect });

    return res.status(201).json({
        message: "Success Created Option Process",
        status: 'success',
        option: option
    });
});

exports.updateOption = catchHandler(async (req, res, next) => {
    const { optionId, questionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return next(new ThrowMessage(400, "Invalid question id format. Must be a 24 character hex string."));
    }

    if (!mongoose.Types.ObjectId.isValid(optionId)) {
        return next(new ThrowMessage(400, "Invalid option id format. Must be a 24 character hex string."));
    }

    const question = await Question.findById(questionId);
    if (!question) {
        return next(new ThrowMessage(404, "There Is No Question"));
    }

    const optionSpesific = await QuestionOpetion.findOne({ _id: optionId, questionId: questionId });
    if (!optionSpesific) {
        return next(new ThrowMessage(404, "There Is No Options"));
    }

    const optionUpdated = await QuestionOpetion.updateOne(
        { _id: optionId, questionId: questionId },
        { ...req.body },
        { runValidators: true }
    );

    if (optionUpdated.nModified === 0) {
        return next(new ThrowMessage(400, "No changes made to the Options"));
    }

    return res.status(200).json({
        message: "Success Updated Options Process",
        status: 'success',
        option: optionUpdated
    });
});

exports.deleteOption = catchHandler(async (req, res, next) => {
    const { questionId, optionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(optionId)) {
        return next(new ThrowMessage(400, "Invalid Option id format. Must be a 24 character hex string."));
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
        return next(new ThrowMessage(400, "Invalid questionId format. Must be a 24 character hex string."));
    }

    const question = await Question.findById(questionId);
    if (!question) {
        return next(new ThrowMessage(404, "There Is No Questions"));
    }

    const optionSpesific = await QuestionOpetion.findOne({ _id: optionId, questionId: questionId });
    if (!optionSpesific) {
        return next(new ThrowMessage(404, "There Is No Options"));
    }

    await optionSpesific.deleteOne();

    return res.status(200).json({
        message: "Success Deleted Option Process",
        status: 'success',
    });
});