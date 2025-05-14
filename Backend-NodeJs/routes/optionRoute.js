const express = require('express');
const router = express.Router();
const { authentication } = require('../Middleware/authenticationMiddleware');
const {getAllOptions , createOption , updateOption ,deleteOption } = require('../Controller/optionController');
const { auth } = require('../Middleware/authMiddleware');
router.use(auth);
router.get('/:questionId/options',getAllOptions);
router.post('/:questionId/options',authentication("teacher"),createOption);
router.put('/:questionId/options/:optionId',authentication("teacher"),updateOption);
router.delete('/:questionId/options/:optionId',authentication("teacher"),deleteOption);


module.exports = router;