
const express = require('express');
const router = express.Router();
const RegisterController = require('../controllers/RegisterController');

// hiển thị dsmh
router.get('/', RegisterController.index)
// hiển thị form tạo mới môn học
router.get('/create', RegisterController.create)
// lưu form tạo mh
router.post('/store', RegisterController.store)
// hiển thị form chỉnh sửa mh
router.get('/edit/:id', RegisterController.edit)
// lưu form cập nhật mh
router.post('/update', RegisterController.update)
// xóa mh
router.get('/destroy/:id', RegisterController.destroy)
module.exports = router;
