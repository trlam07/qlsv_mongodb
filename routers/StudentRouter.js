
const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController');

// hiển thị dssv
router.get('/', StudentController.index)
// hiển thị form tạo mới sinh viên
router.get('/create', StudentController.create)
// lưu form tạo sv
router.post('/store', StudentController.store)
// hiển thị form chỉnh sửa sv
router.get('/edit/:id', StudentController.edit)
// lưu form cập nhật sv
router.post('/update', StudentController.update)
// xóa sv
router.get('/destroy/:id', StudentController.destroy)
module.exports = router;
