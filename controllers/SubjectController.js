const subjectModel = require('../models/Subject');
const registerModel = require('../models/Register');

const { format } = require ('../node_modules/date-fns');
class SubjectController {
    static module = 'subject';


    // hàm hiển thị danh sách
    static index = async(req, res) => {
        try {
            const search = req.query.search;
            const page = req.query.page || 1;
            const item_per_page = process.env.ITEM_PER_PAGE;

            let subjects = [];
            let totalSubjects = [];
            if(search){
                // dữ liệu đã phân trang
                subjects = await subjectModel.getByPattern(search, page, item_per_page);
                // dữ liệu chưa phân trang
                totalSubjects = await subjectModel.getByPattern(search);
            }
            else {
                subjects = await subjectModel.all(page, item_per_page);
                totalSubjects = await subjectModel.all();
            };

            const totalPage = Math.ceil(totalSubjects.length / item_per_page)

            // gọi model để lấy dữ liệu
            // gọi từ class, không cần new Subject()
            
            const message_success = req.session.message_success;
            const message_error = req.session.message_error;
            // chủ động xóa message
            delete req.session.message_success;
            delete req.session.message_error;
            //console.log(message_success, message_error)
            // gửi dữ liệu về view
            res.render('subject/index', {
                subjects: subjects,
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
    static create = (req, res) => {
        try {
            res.render('subject/create', {
                module: this.module
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    static store = async (req, res) => {
        try {
            // lưu dữ liệu vào database
            await subjectModel.save(req.body);
            // lưu session vào req
            req.session.message_success = `Đã tạo môn học ${req.body.name} thành công!`
            res.redirect('/subject')
            // res.send(req.body)
            // res.end()
        } catch (error) {
            req.session.message_error = `${error.message}`
            res.redirect('/subject')
        }
    }
    static edit = async(req, res) => {
        try {
            const subject = await subjectModel.find(req.params.id);
            res.render('subject/edit', {
                subject: subject,
                module: this.module,
            })
        } catch (error) {
            res.status(500).send(error.message)
        }
    }
    static update = async(req, res) => {
        try {
            const id = req.body.id;
            const name = req.body.name;
            const number_of_credits = req.body.number_of_credits;
            //lấy subject từ database lên
            const subject = await subjectModel.find(id);

            // cập nhật giá trị mới từ người dùng
            subject.name = name;
            subject.number_of_credits = number_of_credits;
            // lưu xuống database
            await subject.update()
            req.session.message_success = `Đã cập nhật môn học ${req.body.name} thành công!`
            res.redirect('/subject')
        } catch (error) {
            req.session.message_error = `${error.message}`
            res.redirect('/subject')
        }
    }

    static destroy = async(req, res) => {
        try {
            
            //lấy subject từ database lên
            const subject = await subjectModel.find(req.params.id);
            // kiểm tra MH đã đăng ký chưa, nếu đăng ký rồi thì không thể xóa
            const registers = await registerModel.getBySubjectId(req.params.id)
            if(registers.length > 0) {
                //lưu session vào req
                req.session.message_error = `KHÔNG THỂ XÓA do môn học ${subject.name} đã được ${registers.length} sinh viên đăng ký.`
                res.redirect('/subject'); //điều hướng đến trang dsmh
                return; //không cho chạy code xuống dưới
            }
            await subject.destroy();
            req.session.message_success = (`Đã xóa môn học ${subject.name} thành công`)
            res.redirect('/subject')
        } catch (error) {
            req.session.message_error = `${error.message}`
            res.redirect('/subject')
        }
    }
}

module.exports = SubjectController;