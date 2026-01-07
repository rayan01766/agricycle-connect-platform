const { pool } = require('../config/db');

// @desc    Get all waste listings (companies view approved, admin views all/pending)
// @route   GET /api/waste
const getWasteListings = async (req, res) => {
    try {
        let query;
        let queryParams = [];

        // Basic filter logic
        if (req.query.all === 'true') {
            query = 'SELECT w.*, u.name as farmer_name FROM waste_listings w JOIN users u ON w.farmer_id = u.id ORDER BY w.created_at DESC';
        } else if (req.query.status) {
            query = 'SELECT w.*, u.name as farmer_name FROM waste_listings w JOIN users u ON w.farmer_id = u.id WHERE w.status = $1 ORDER BY w.created_at DESC';
            queryParams.push(req.query.status);
        } else {
            // Default public view: approved only
            query = 'SELECT w.*, u.name as farmer_name FROM waste_listings w JOIN users u ON w.farmer_id = u.id WHERE w.status = \'approved\' ORDER BY w.created_at DESC';
        }

        const result = await pool.query(query, queryParams);
        res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error('GetListings Error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching listings' });
    }
};

// @desc    Get single waste listing
// @route   GET /api/waste/:id
const getWasteListingById = async (req, res) => {
    try {
        const query = 'SELECT w.*, u.name as farmer_name, u.email as farmer_email, u.phone as farmer_phone FROM waste_listings w JOIN users u ON w.farmer_id = u.id WHERE w.id = $1';
        const result = await pool.query(query, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('GetListingById Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Create waste listing
// @route   POST /api/waste
const createWasteListing = async (req, res) => {
    const { type, quantity, price, location } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!type || !quantity || !price || !location) {
        return res.status(400).json({ success: false, message: 'Please add all required fields' });
    }

    try {
        const query = 'INSERT INTO waste_listings (farmer_id, type, quantity, price, location, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const result = await pool.query(query, [req.user.id, type, quantity, price, location, image_url]);

        res.status(201).json({ success: true, data: result.rows[0], message: 'Listing created successfully' });
    } catch (error) {
        console.error('CreateListing Error:', error);
        res.status(500).json({ success: false, message: 'Server error creating listing' });
    }
};

// @desc    Get my listings
// @route   GET /api/waste/my
const getMyListings = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM waste_listings WHERE farmer_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error('GetMyListings Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update status
// @route   PATCH /api/waste/:id/status
const updateListingStatus = async (req, res) => {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    try {
        const result = await pool.query('UPDATE waste_listings SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        res.status(200).json({ success: true, data: result.rows[0], message: `Listing ${status}` });
    } catch (error) {
        console.error('UpdateStatus Error:', error);
        res.status(500).json({ success: false, message: 'Server error updating status' });
    }
};

// @desc    Delete listing
// @route   DELETE /api/waste/:id
const deleteListing = async (req, res) => {
    try {
        // Check ownership or admin
        const check = await pool.query('SELECT farmer_id FROM waste_listings WHERE id = $1', [req.params.id]);
        if (check.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Listing not found' });
        }

        if (req.user.role !== 'admin' && check.rows[0].farmer_id !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
        }

        await pool.query('DELETE FROM waste_listings WHERE id = $1', [req.params.id]);
        res.status(200).json({ success: true, message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('DeleteListing Error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting listing' });
    }
};

module.exports = {
    getWasteListings,
    getWasteListingById,
    createWasteListing,
    getMyListings,
    updateListingStatus,
    deleteListing
};
