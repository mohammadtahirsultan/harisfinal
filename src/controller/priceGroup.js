const PriceGroup = require('../model/pricegroup');

// Create a new PriceGroup
async function createPriceGroup(req, res) {
    try {
        const priceGroup = new PriceGroup(req.body);
        let nameExist = await PriceGroup.findOne({ name: req.body.name })
        if (nameExist) {
            return res.status(400).json({
                success: false,
                error: 'Name already exist, try with new Name'
            })
        }
        await priceGroup.save();
        res.status(201).json(priceGroup);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Get all PriceGroups
async function getAllPriceGroups(req, res) {
    try {
        const priceGroups = await PriceGroup.find();
        res.status(200).json(priceGroups);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

// Get a specific PriceGroup by ID
async function getPriceGroupById(req, res) {
    const { id } = req.params;
    try {
        const priceGroup = await PriceGroup.findById(id);
        if (!priceGroup) {
            return res.status(404).json({ error: 'PriceGroup not found' });
        }
        res.status(200).json(priceGroup);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

// Update a PriceGroup by ID
async function updatePriceGroup(req, res) {
    const { id } = req.params;
    try {
        const updatedPriceGroup = await PriceGroup.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!updatedPriceGroup) {
            return res.status(404).json({ error: 'PriceGroup not found' });
        }
        res.status(200).json(updatedPriceGroup);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

// Delete a PriceGroup by ID
async function deletePriceGroup(req, res) {
    const { id } = req.params;
    try {
        const deletedPriceGroup = await PriceGroup.findByIdAndDelete(id);
        if (!deletedPriceGroup) {
            return res.status(404).json({ error: 'PriceGroup not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createPriceGroup,
    getAllPriceGroups,
    getPriceGroupById,
    updatePriceGroup,
    deletePriceGroup,
};
