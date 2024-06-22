
const express = require('express');
const router = express.Router();
const SubjectController = require('../controllers/SubjectController');

// hiển thị dsmh
router.get('/', SubjectController.index)
// hiển thị form tạo mới môn học
router.get('/create', SubjectController.create)
// lưu form tạo mh
router.post('/store', SubjectController.store)
// hiển thị form chỉnh sửa mh
router.get('/edit/:id', SubjectController.edit)
// lưu form cập nhật mh
router.post('/update', SubjectController.update)
// xóa mh
router.get('/destroy/:id', SubjectController.destroy)
module.exports = router;
