const express = require('express');
const router = express.Router();
const {
    getWasteListings,
    createWasteListing,
    getMyListings,
    getWasteListingById,
    updateListingStatus,
    deleteListing
} = require('../controllers/wasteController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getWasteListings);
router.get('/my', protect, authorize('farmer'), getMyListings);
router.get('/:id', protect, getWasteListingById);
router.post('/', protect, authorize('farmer'), upload.single('image'), createWasteListing);
router.patch('/:id/status', protect, authorize('admin'), updateListingStatus);
router.delete('/:id', protect, deleteListing); // Validation logic in controller handles permission

module.exports = router;
