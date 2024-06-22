const registerModel = require('../models/Register');
const studentModel = require('../models/Student');
const subjectModel = require('../models/Subject');

const { format } = require ('../node_modules/date-fns');
class RegisterController {
    static module = 'register';


    // hàm hiển thị danh sách
    static index = async(req, res) => {
        try {
            const search = req.query.search;
            const page = req.query.page || 1;
            const item_per_page = process.env.ITEM_PER_PAGE;

            let registers = [];
            let totalRegisters = [];
            if(search){
                // dữ liệu đã phân trang
                registers = await registerModel.getByPattern(search, page, item_per_page);
                // dữ liệu chưa phân trang
                totalRegisters = await registerModel.getByPattern(search);
            }
            else {
                registers = await registerModel.all(page, item_per_page);
                totalRegisters = await registerModel.all();
            };

            const totalPage = Math.ceil(totalRegisters.length / item_per_page)

            // gọi model để lấy dữ liệu
            // gọi từ class, không cần new Register()
            
            const message_success = req.session.message_success;
            const message_error = req.session.message_error;
            // chủ động xóa message
            delete req.session.message_success;
            delete req.session.message_error;
            //console.log(message_success, message_error)
            // gửi dữ liệu về view
            res.render('register/index', {
                registers: registers,
                format: format,
                search: search,
                message_success: message_success,
                message_error: message_error,
                totalPage: totalPage,
                page: page,
                module: this.module,
            });
            res.end()
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    static create = async (req, res) => {
        try {
            const students = await studentModel.all();
            const subjects = await subjectModel.all();
            res.render('register/create', {
                module: this.module,
                students: students,
                subjects: subjects,
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    static store = async (req, res) => {
        try {
            // lưu dữ liệu vào database
            await registerModel.save(req.body);

            const student = await studentModel.find(req.body.student_id);
            const student_name = student.name;

            const subject = await subjectModel.find(req.body.subject_id);
            const subject_name = subject.name;
            // lưu session vào req
            req.session.message_success = `Sinh viên ${student_name} đã đăng ký môn ${subject_name} thành công!`
            res.redirect('/register')
            // res.send(req.body)
            // res.end()
        } catch (error) {
            req.session.message_error = `${error.message}`
            res.redirect('/register')
        }
    }
    static edit = async(req, res) => {
        try {
            const register = await registerModel.find(req.params.id);
            res.render('register/edit', {
                register: register,
                module: this.module,
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }



    static update = async(req, res) => {
        try {
            const id = req.body.id;
            const score = req.body.score;
            //lấy register từ database lên
            const register = await registerModel.find(id);

            // cập nhật điểm
            register.score = score;
            
            // lưu xuống database
            await register.update()
            
            const student_name = register.student_name;
            const subject_name = register.subject_name;

            req.session.message_success = `Sinh viên ${student_name} thi môn ${subject_name} đạt ${score} điểm!`
            res.redirect('/register')
        } catch (error) {
            req.session.message_error = `${error.message}`
            res.redirect('/register')
        }
    }

    static destroy = async(req, res) => {
        try {
            
            //lấy register từ database lên
            const register = await registerModel.find(req.params.id);
            await register.destroy();
            req.session.message_success = `Sinh viên ${register.student_name} đã hủy đăng ký môn ${register.subject_name} thành công`
            res.redirect('/register')
        } catch (error) {
            req.session.message_error = `${error.message}`
            res.redirect('/register')
        }
    }
}

module.exports = RegisterController;