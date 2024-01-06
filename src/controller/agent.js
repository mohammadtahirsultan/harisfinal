const Agent = require('../model/agent');
// Import nodemailer or any other email service if required

exports.createAgentRequest = async (req, res) => {
    try {
        const agent = new Agent(req.body);
        await agent.save();
        // Send email to admin for approval
        res.status(201).json(agent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveAgent = async (req, res) => {
    try {
        const agent = await Agent.findById(req.params.id);
        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }
        agent.status = 'approved';
        await agent.save();
        // Send email to agent about approval
        res.status(200).json(agent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAgents = async (req, res) => {
    try {
        const agents = await Agent.find();
        res.status(200).json(agents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getSingleAgent = async (req, res) => {
    const agent = await Agent.findById(req.params.id).select('+password');
    if (!agent) {
        return res.status(404).json({
            message: 'No agent with this id was found.'
        })
    }
    res.status(200).json(agent);
};

// Middleware that checks if the user is an admin before allowing access to routes
exports.createNewAgent = async (req, res) => {
    let agentExist = await Agent.findOne({
        email: req.body.email,
    })
    if (!agentExist) {
        return res.status(400).json({ error: "Agent Already Exist" })
    }
    const newAgent = new Agent({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        status: "pending"
    })
    try {
        const savedAgent = await newAgent.save();
        // Save reference of created agent in db
        process.env.NODE_ENV === 'production' ?
            EmailService.sendEmail(savedAgent.email, `Your account has been created successfully!
        Please log into your account using the following credentials:
        Username: ${savedAgent.email}
        Password: ${savedAgent.password}`) : '';
    }
    catch (err) {
        console.log(err.code);
        if (err.code == 11000) {
            // Duplicate key error
            return res.status(400).json({ error: "Email already exists." });
        } else {
            return res.status(500).json({ error: err });
        }
    }
    res.status(201).json(savedAgent);
};

exports.deleteAgent = async (req, res) => {
    try {
        const agentId = req.params.id;
        const agent = await Agent.findById(agentId);

        if (!agent) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        // Optionally, add an authorization check here
        // to make sure only an admin or the agent themselves can delete the record

        await agent.deleteOne(agent);
        res.status(200).json({ message: 'Agent deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};