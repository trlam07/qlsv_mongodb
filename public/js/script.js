// jqClick
$('button.destroy').click(function (e) { 
	e.preventDefault();
	const data_href = $(this).attr('data-href');
	$('#exampleModal a').attr('href', data_href)
});
const gotoPage = (page) => {
	console.log(`Navigating to page: ${page}`);
	const currentURL = window.location.href;
	const obj = new URL(currentURL);
	obj.searchParams.set('page', page);
	window.location.href = obj.href;
}

$(".form-student-create, .form-student-edit").validate({
	rules: {
	  name: {
		required: true,
		regex: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơẠ-ỹ\s]+$/,
		maxlength: 50,
	  },
	  birthday: {
		required: true,
	  },
	  gender: {
		required: true,
	  }
	},
	messages: {
		name: {
		  required: "Vui lòng nhập họ và tên",
		  regex: 'Vui lòng không sử dụng số hoặc ký tự đặc biệt',
		  maxlength: 'Vui lòng không nhập quá 50 ký tự'
		},
		birthday: {
		  required: 'Vui lòng chọn ngày sinh',
		},
		gender: {
			required: 'Vui lòng chọn giới tính',
		  }
	  }
  });

  $(".form-subject-create, .form-subject-edit").validate({
	rules: {
	  name: {
		required: true,
		maxlength: 50,
	  },
	  number_of_credits: {
		required: true,
		digits: true, //số nguyên
		range: [1, 10]
	  },
	},
	messages: {
		name: {
		  required: "Vui lòng nhập tên môn học",
		  maxlength: 'Vui lòng không nhập quá 50 ký tự'
		},
		number_of_credits: {
		  required: 'Vui lòng nhập số tín chỉ',
		  digits: 'Vui lòng nhập số nguyên',
		  range: 'Vui lòng nhập số từ 1 đến 10'
		},
		gender: {
			required: 'Vui lòng chọn giới tính',
		  }
	  }
  });

  $(".form-register-create").validate({
	rules: {
	  student_id: {
		required: true,
	  },
	  subject_id: {
		required: true,
	  },
	},
	messages: {
		student_id: {
			required: 'Vui lòng chọn sinh viên',
		  },
		  subject_id: {
			required: 'Vui lòng chọn môn học',
		  },
	  }
  });

  $(".form-register-edit").validate({
	rules: {
	  score: {
		required: true,
		range: [0, 10]
	  },
	},
	messages: {
		score: {
			required: 'Vui lòng nhập điểm',
			range: 'Vui lòng nhập từ 0 đến 10'
		  },
	  }
  });

  $.validator.addMethod(
	"regex",
	function(value, element, regexp) {
	  var re = new RegExp(regexp);
	  return this.optional(element) || re.test(value);
	},
	"Please check your input."
  );