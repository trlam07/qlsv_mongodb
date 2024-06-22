const db = require("./db");
const collection = db.collection('students');

class Student {
  // hàm xây dựng đối tượng
  constructor(id, name, birthday, gender) {
    this.id = id;
    this.name = name;
    this.birthday = birthday;
    this.gender = gender;
  }

  
  // hàm lấy tất cả dữ liệu trong bảng
  // trả về danh sách chứa các đối tượng student
  // static là gọi từ class, vd: Student.all, không cần phải new Student(...).all()
  static all = async (page = null, item_per_page = null) => {
    try {
      let rows = [];
      // xây dựng phân trang
      if(page && item_per_page) {
        item_per_page = Number(item_per_page);
        const skip_number = (page - 1) * item_per_page;
        rows = await collection.find().skip(skip_number).limit(item_per_page).toArray();
      } else {
        rows = await collection.find().toArray();
      }
      
      return this.convertArrayToObject(rows);
    } catch (error) {
      throw new Error(error);
    }
  }

  static convertArrayToObject = (rows) => {
    const students = rows.map(
      (row) => new Student(row.student_id, row.name, row.birthday, row.gender)
    );
    return students;
  };

  static getByPattern = async (search, page = null, item_per_page = null) => {
    try {
      // xây dựng phân trang
      //options: 'i' là không phân biệt chữ hoa, thường
      //$options & $regex là toán tử trong database nên có dấu $
      //$regex là tìm mặc định gần đúng (có chứa ký tự đó)
      let rows = [];
      const query = {name: {$regex: search, $options: 'i'}};
      // xây dựng phân trang
      if(page && item_per_page) {
        item_per_page = Number(item_per_page);
        const skip_number = (page - 1) * item_per_page;
        rows = await collection.find(query).skip(skip_number).limit(item_per_page).toArray();
      } else {
        rows = await collection.find(query).toArray();
      }
      
      //db.students.find({name: {$regex: 't', $options: 'i'}})
      return this.convertArrayToObject(rows);
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  };

  static save = async (data) => {
    try {
      //tìm hết, sắp xếp lại, lấy 1 sv đầu tiên
      const row = await collection.findOne({}, {sort:{student_id: -1}});
      const newInsertId = row ? row.student_id + 1 : 1

      await collection.insertOne({
        student_id: newInsertId,
        name: data.name,
        birthday: data.birthday,
        gender: data.gender
      })
      return newInsertId;
    } catch (error) {
      throw new Error(error);
    }
  };
  // tìm 1 dòng student
  static find = async (id) => {
    try {
      const query = {student_id: Number(id)};
      const row = await collection.findOne(query)
      //db.students.findOne(query)
      // check nếu không có dòng nào thỏa mãn trong bảng student
      if (!row) {
        return null;
      }
      const rows = [row];
      const students = this.convertArrayToObject(rows);
      const student = students[0]
      return student;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
  update = async () => {
    try {
        const query = {student_id: this.id};
        const set = {
          $set: {
                name: this.name, 
                birthday: this.birthday, 
                gender: this.gender
              }
        }
        await collection.updateOne(query, set)
        //db.students.updateOne({gender: "nam"}, {$set: {name: "Tèo"}})
      
      return true;
    } catch (error) {
      throw new Error(error);
    }
  };
  destroy = async () => {
    try {
      const query = {student_id: this.id}
      await collection.deleteOne(query)
      //db.student.deleteOne({gender: "khác"})
      return true;
    } catch (error) {
      throw new Error(error);
    }
  };
}

module.exports = Student;
