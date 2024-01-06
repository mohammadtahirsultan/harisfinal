const express = require('express');
const { approveAgent, getAgents, getSingleAgent, createNewAgent, createAgentRequest, deleteAgent } = require('../controller/agent');
const router = express.Router();

router.post('/create-request', createAgentRequest);

router.put('/:id', approveAgent);

router.get('/list', getAgents);

router.get('/:id', getSingleAgent);

router.post('/new', createNewAgent);

router.delete('/:id', deleteAgent);

module.exports = router;
