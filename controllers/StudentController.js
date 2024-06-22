const studentModel = require('../models/Student');
const registerModel = require('../models/Register');

const { format } = require ('../node_modules/date-fns');
class StudentController {
    static module = 'student';
    // hàm hiển thị danh sách
    static index = async(req, res) => {
        try {
            const search = req.query.search;
            const page = Number(req.query.page || 1);
            const item_per_page = process.env.ITEM_PER_PAGE;

            let students = [];
            let totalStudents = [];
            if(search){
                // dữ liệu đã phân trang
                students = await studentModel.getByPattern(search, page, item_per_page);
                // dữ liệu chưa phân trang
                totalStudents = await studentModel.getByPattern(search);
            }
            else {
                students = await studentModel.all(page, item_per_page);
                totalStudents = await studentModel.all();
            };

            const totalPage = Math.ceil(totalStudents.length / item_per_page)

            // gọi model để lấy dữ liệu
            // gọi từ class, không cần new Student()
            
            const message_success = req.session.message_success;
            const message_error = req.session.message_error;
            // chủ động xóa message
            delete req.session.message_success;
            delete req.session.message_error;
            //console.log(message_success, message_error)
            // gửi dữ liệu về view
            res.render('student/index', {
                students: students,
                format: format,
                search: search,
                message_success: message_success,
                message_error: message_error,
                totalPage: totalPage,
                page: page,
                module: this.module
            });
            res.end()
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    static create = (req, res) => {
        try {
            res.render('student/create', {
                module: this.module
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    static store = async (req, res) => {
        try {
            // lưu dữ liệu vào database
            await studentModel.save(req.body);
            // lưu session vào req
            req.session.message_success = `Đã tạo sinh viên ${req.body.name} thành công!`
            res.redirect('/')
            // res.send(req.body)
            // res.end()
        } catch (error) {
            req.session.message_error = `${error.message}`
            res.redirect('/')
        }
    }
    static edit = async(req, res) => {
        try {
            const student = await studentModel.find(req.params.id);
            res.render('student/edit', {
                student: student,
                module: this.module,
                format: format,
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    static update = async(req, res) => {
        try {
            const id = req.body.id;
            const name = req.body.name;
            const birthday = req.body.birthday;
            const gender = req.body.gender;
            //lấy student từ database lên
            const student = await studentModel.find(id);

            // cập nhật giá trị mới từ người dùng
            student.name = name;
            student.birthday = birthday;
            student.gender = gender;
            // lưu xuống database
            await student.update()
            req.session.message_success = `Đã cập nhật sinh viên ${req.body.name} thành công!`
            res.redirect('/')
        } catch (error) {
            req.session.message_error = `${error.message}`
            res.redirect('/')
        }
    }

    static destroy = async(req, res) => {
        try {
            //lấy student từ database lên
            const student = await studentModel.find(req.params.id);
            // kiểm tra sv đã đăng ký MH chưa, nếu đăng ký rồi thì không thể xóa
            const registers = await registerModel.getByStudentId(req.params.id)
            if(registers.length > 0) {
                //lưu session vào req
                req.session.message_error = `KHÔNG THỂ XÓA do sinh viên ${student.name} đã đăng ký ${registers.length} môn.`
                res.redirect('/'); //điều hướng đến trang dssv
                return; //không cho chạy code xuống dưới
            }
            
            await student.destroy();
            req.session.message_success = (`Đã xóa sinh viên ${student.name} thành công`)
            res.redirect('/')
        } catch (error) {
            req.session.message_error = `${error.message}`
            res.redirect('/')
        }
    }
}

module.exports = StudentController;