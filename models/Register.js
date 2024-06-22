const db = require("./db");
const collection = db.collection('registers');
class Register {
  // hàm xây dựng đối tượng
  constructor(id, student_id, subject_id, score, student_name, subject_name) {
    this.id = id;
    this.student_id = student_id;
    this.subject_id = subject_id;
    this.score = score;
    this.student_name = student_name;
    this.subject_name = subject_name;
  }

  
  // hàm lấy tất cả dữ liệu trong bảng
  // trả về danh sách chứa các đối tượng register
  // static là gọi từ class, vd: Register.all, không cần phải new Register(...).all()
  static all = async (page = null, item_per_page = null) => {
    const pipeline = [
          {$lookup: {
              from: "students",
              localField: "student_id",
              foreignField: "student_id",
              as: "student_info"
              }},
          {$lookup: {
              from: "subjects",
              localField: "subject_id",
              foreignField: "subject_id",
              as: "subject_info"
          }},
          {$project:{
              _id: 0,
              register_id: 1,
              student_id: 1,
              subject_id: 1,
              score: 1,
              "student_info.name": 1,
              "subject_info.name": 1
          }}
      ]
    try {
      let rows = [];
      // xây dựng phân trang
      if(page && item_per_page) {
        item_per_page = Number(item_per_page);
        const skip_number = (page - 1) * item_per_page;
        rows = await collection.aggregate(pipeline).skip(skip_number).limit(item_per_page).toArray();

      } else {
        rows = await collection.aggregate(pipeline).toArray();
      }
      
      return this.convertArrayToObject(rows);
    } catch (error) {
      throw new Error(error);
    }
  }

  static convertArrayToObject = (rows) => {
    const registers = rows.map(
      (row) => new Register(row.register_id, row.student_id, row.subject_id, row.score != null ? row.score.toFixed(2) : null, row.student_info[0].name, row.subject_info[0].name)
    );
    return registers;
  };
  

  static getByPattern = async (search, page = null, item_per_page = null) => {
    const pipeline = [
      {$lookup: {
          from: "students",
          localField: "student_id",
          foreignField: "student_id",
          as: "student_info"
          }},
      {$lookup: {
          from: "subjects",
          localField: "subject_id",
          foreignField: "subject_id",
          as: "subject_info"
      }},
      {$project:{
          _id: 0,
          register_id: 1,
          student_id: 1,
          subject_id: 1,
          score: 1,
          "student_info.name": 1,
          "subject_info.name": 1
      }},
      {
        $match: {$or: [{
          "student_info.name": {$regex: search, $options: 'i'}
        }, {
          "subject_info.name": {$regex: search, $options: 'i'}
        }]}
      }
  ]
try {
  let rows = [];
  // xây dựng phân trang
  if(page && item_per_page) {
    item_per_page = Number(item_per_page);
    const skip_number = (page - 1) * item_per_page;
    rows = await collection.aggregate(pipeline).skip(skip_number).limit(item_per_page).toArray();

  } else {
    rows = await collection.aggregate(pipeline).toArray();
  }
  
  return this.convertArrayToObject(rows);
} catch (error) {
  throw new Error(error);
}
  };
// lấy danh sách đăng ký mh của 1 sv
  static getByStudentId = async (student_id, page = null, item_per_page = null) => {
    const pipeline = [
      {$lookup: {
          from: "students",
          localField: "student_id",
          foreignField: "student_id",
          as: "student_info"
          }},
      {$lookup: {
          from: "subjects",
          localField: "subject_id",
          foreignField: "subject_id",
          as: "subject_info"
      }},
      {$project:{
          _id: 0,
          register_id: 1,
          student_id: 1,
          subject_id: 1,
          score: 1,
          "student_info.name": 1,
          "subject_info.name": 1
      }},
      {
        $match: {student_id: Number(student_id)}
      }
  ]
try {
  let rows = [];
  // xây dựng phân trang
  if(page && item_per_page) {
    item_per_page = Number(item_per_page);
    const skip_number = (page - 1) * item_per_page;
    rows = await collection.aggregate(pipeline).skip(skip_number).limit(item_per_page).toArray();

  } else {
    rows = await collection.aggregate(pipeline).toArray();
  }
  
  return this.convertArrayToObject(rows);
} catch (error) {
  throw new Error(error);
}
  };

  // lấy danh sách đăng ký mh của 1 sv
  static getBySubjectId = async (subject_id, page = null, item_per_page = null) => {
    const pipeline = [
      {$lookup: {
          from: "students",
          localField: "student_id",
          foreignField: "student_id",
          as: "student_info"
          }},
      {$lookup: {
          from: "subjects",
          localField: "subject_id",
          foreignField: "subject_id",
          as: "subject_info"
      }},
      {$project:{
          _id: 0,
          register_id: 1,
          student_id: 1,
          subject_id: 1,
          score: 1,
          "student_info.name": 1,
          "subject_info.name": 1
      }},
      {
        $match: {subject_id: Number(subject_id)}
      }
  ]
  try {
    let rows = [];
    // xây dựng phân trang
    if(page && item_per_page) {
      item_per_page = Number(item_per_page);
      const skip_number = (page - 1) * item_per_page;
      rows = await collection.aggregate(pipeline).skip(skip_number).limit(item_per_page).toArray();
  
    } else {
      rows = await collection.aggregate(pipeline).toArray();
    }
    
    return this.convertArrayToObject(rows);
  } catch (error) {
    throw new Error(error);
  }
  };

  static save = async (data) => {
    try {
      const row = await collection.findOne({}, {sort:{register_id: -1}});
      const newInsertId = row ? row.register_id + 1 : 1

      await collection.insertOne({
        register_id: newInsertId,
        student_id: Number(data.student_id),
        subject_id: Number(data.subject_id),
        score: data.score ? Number(data.score) : null
      })
      return newInsertId;
    } catch (error) {
      throw new Error(error);
    }
  };
  // tìm 1 dòng register
  static find = async (id) => {
    const pipeline = [
      {$lookup: {
          from: "students",
          localField: "student_id",
          foreignField: "student_id",
          as: "student_info"
          }},
      {$lookup: {
          from: "subjects",
          localField: "subject_id",
          foreignField: "subject_id",
          as: "subject_info"
      }},
      {$project:{
          _id: 0,
          register_id: 1,
          student_id: 1,
          subject_id: 1,
          score: 1,
          "student_info.name": 1,
          "subject_info.name": 1
      }},
      {
        $match: {
          register_id: Number(id)
        }
      }
  ]
    try {
      const rows = await collection.aggregate(pipeline).toArray()
      if (!rows || rows.length === 0) {
        return null;
      }
      const registers = this.convertArrayToObject(rows);
      const register = registers[0]
      return register;

    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
  
  update = async () => {
        try {
          await collection.updateOne(
            { register_id: this.id },
            { $set: { score: Number(this.score) } }
          );
          return true;
        } catch (error) {
          throw new Error(error);
        }
      };

      destroy = async () => {
        try {
          const query = {register_id: this.id}
          await collection.deleteOne(query)
          return true;
        } catch (error) {
          throw new Error(error);
        }
      };
    }

module.exports = Register;



// const db = require("./db");
// const collection = db.collection('registers');

// class Register {
//   // hàm xây dựng đối tượng
//   constructor(id, student_id, subject_id, score, student_name, subject_name) {
//     this.id = id;
//     this.student_id = student_id;
//     this.subject_id = subject_id;
//     this.score = score;
//     this.student_name = student_name;
//     this.subject_name = subject_name;
//   }

//   // hàm lấy tất cả dữ liệu trong bảng
//   // trả về danh sách chứa các đối tượng register
//   // static là gọi từ class, vd: Register.all, không cần phải new Register(...).all()
//   static all = async (page = null, item_per_page = null) => {
//     const pipeline = [
//       { $lookup: { from: "students", localField: "student_id", foreignField: "student_id", as: "student_info" } },
//       { $lookup: { from: "subjects", localField: "subject_id", foreignField: "subject_id", as: "subject_info" } },
//       { $project: { _id: 0, register_id: 1, student_id: 1, subject_id: 1, score: 1, "student_info.name": 1, "subject_info.name": 1 } }
//     ];
//     try {
//       let rows = [];
//       // xây dựng phân trang
//       if (page && item_per_page) {
//         item_per_page = Number(item_per_page);
//         const skip_number = (page - 1) * item_per_page;
//         rows = await collection.aggregate(pipeline).skip(skip_number).limit(item_per_page).toArray();
//       } else {
//         rows = await collection.aggregate(pipeline).toArray();
//       }
//       return this.convertArrayToObject(rows);
//     } catch (error) {
//       throw new Error(error);
//     }
//   }

//   static convertArrayToObject = (rows) => {
//     const registers = rows.map((row) => {
//       const studentName = row.student_info && row.student_info[0] ? row.student_info[0].name : null;
//       const subjectName = row.subject_info && row.subject_info[0] ? row.subject_info[0].name : null;
//       const score = row.score !== null && row.score !== undefined ? Number(row.score).toFixed(2) : null;

//       return new Register(
//         row.register_id,
//         row.student_id,
//         row.subject_id,
//         score,
//         studentName,
//         subjectName
//       );
//     });
//     return registers;
//   };

//   static getByPattern = async (search, page = null, item_per_page = null) => {
//     try {
//       const pipeline = [
//         { $lookup: { from: "students", localField: "student_id", foreignField: "student_id", as: "student_info" } },
//         { $lookup: { from: "subjects", localField: "subject_id", foreignField: "subject_id", as: "subject_info" } },
//         { $match: { $or: [ { "student_info.name": { $regex: search, $options: "i" } }, { "subject_info.name": { $regex: search, $options: "i" } } ] } },
//         { $project: { _id: 0, register_id: 1, student_id: 1, subject_id: 1, score: 1, "student_info.name": 1, "subject_info.name": 1 } }
//       ];

//       if (page && item_per_page) {
//         item_per_page = Number(item_per_page);
//         const skip_number = (page - 1) * item_per_page;
//         pipeline.push({ $skip: skip_number }, { $limit: item_per_page });
//       }

//       const rows = await collection.aggregate(pipeline).toArray();
//       return this.convertArrayToObject(rows);
//     } catch (error) {
//       console.log(error);
//       throw new Error(error);
//     }
//   };

//   static getByStudentId = async (student_id, page = null, item_per_page = null) => {
//     try {
//       const pipeline = [
//         { $match: { student_id: Number(student_id) } },
//         { $lookup: { from: "students", localField: "student_id", foreignField: "student_id", as: "student_info" } },
//         { $lookup: { from: "subjects", localField: "subject_id", foreignField: "subject_id", as: "subject_info" } },
//         { $project: { _id: 0, register_id: 1, student_id: 1, subject_id: 1, score: 1, "student_info.name": 1, "subject_info.name": 1 } }
//       ];

//       if (page && item_per_page) {
//         item_per_page = Number(item_per_page);
//         const skip_number = (page - 1) * item_per_page;
//         pipeline.push({ $skip: skip_number }, { $limit: item_per_page });
//       }

//       const rows = await collection.aggregate(pipeline).toArray();
//       return this.convertArrayToObject(rows);
//     } catch (error) {
//       console.log(error);
//       throw new Error(error);
//     }
//   };

//   static getBySubjectId = async (subject_id, page = null, item_per_page = null) => {
//     try {
//       const pipeline = [
//         { $match: { subject_id: Number(subject_id) } },
//         { $lookup: { from: "students", localField: "student_id", foreignField: "student_id", as: "student_info" } },
//         { $lookup: { from: "subjects", localField: "subject_id", foreignField: "subject_id", as: "subject_info" } },
//         { $project: { _id: 0, register_id: 1, student_id: 1, subject_id: 1, score: 1, "student_info.name": 1, "subject_info.name": 1 } }
//       ];

//       if (page && item_per_page) {
//         item_per_page = Number(item_per_page);
//         const skip_number = (page - 1) * item_per_page;
//         pipeline.push({ $skip: skip_number }, { $limit: item_per_page });
//       }

//       const rows = await collection.aggregate(pipeline).toArray();
//       return this.convertArrayToObject(rows);
//     } catch (error) {
//       console.log(error);
//       throw new Error(error);
//     }
//   };

//   static save = async (data) => {
//     try {
//       const row = await collection.findOne({}, { sort: { register_id: -1 } });
//       const newInsertId = row ? row.register_id + 1 : 1;
//       await collection.insertOne({
//         register_id: newInsertId,
//         student_id: Number(data.student_id),
//         subject_id: Number(data.subject_id),
//         score: data.score ? Number(data.score) : null
//       });
//       return newInsertId;
//     } catch (error) {
//       throw new Error(error);
//     }
//   };

//   static find = async (id) => {
//     const pipeline = [
//       { $match: { register_id: Number(id) } },
//       { $lookup: { from: "students", localField: "student_id", foreignField: "student_id", as: "student_info" } },
//       { $lookup: { from: "subjects", localField: "subject_id", foreignField: "subject_id", as: "subject_info" } },
//       { $project: { _id: 0, register_id: 1, student_id: 1, subject_id: 1, score: 1, "student_info.name": 1, "subject_info.name": 1 } }
//     ];
//     try {
//       const rows = await collection.aggregate(pipeline).toArray();
//       if (!rows || rows.length === 0) {
//         return null;
//       }
//       const registers = this.convertArrayToObject(rows);
//       const register = registers[0];
//       return register;
//     } catch (error) {
//       console.log(error);
//       throw new Error(error);
//     }
//   };

//   update = async () => {
//     try {
//       await collection.updateOne(
//         { register_id: this.id },
//         { $set: { score: Number(this.score) } }
//       );
//       return true;
//     } catch (error) {
//       throw new Error(error);
//     }
//   };

//   destroy = async () => {
//     try {
//       await collection.deleteOne({ register_id: this.id });
//       return true;
//     } catch (error) {
//       throw new Error(error);
//     }
//   };
// }

// module.exports = Register;
