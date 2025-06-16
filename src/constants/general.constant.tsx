import { notification } from "antd";
import { AxiosError } from "axios";
import { NavigateFunction, useNavigate } from "react-router-dom";

export const KEY_LOCAL_STORAGE = {
  AUTHEN: "authen"
}

export const API_STATUS = {
  SUCCESS: 200,
}

export const selectPageSize = [
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: 200, label: "200" },
];

export const formItemLayout = {
  labelCol: { sm: { span: 24 }, md: { span: 24 }, lg: { span: 10 }, xl: { span: 8 } },
  wrapperCol: { sm: { span: 24 }, md: { span: 24 }, lg: { span: 14 }, xl: { span: 16 } }
};

export const formItemLayout1 = {
  labelCol: { sm: { span: 24 }, md: { span: 24 }, lg: { span: 24 }, xl: { span: 24 } },
  wrapperCol: { sm: { span: 24 }, md: { span: 24 }, lg: { span: 24 }, xl: { span: 24 } }
};

export const buttonAction = {
  create: 1,
  delete: 2,
  update: 3
}

export const CustonerType = [
  { value: 'COM', label: 'công ty' },
  { value: 'PER', label: 'Cá nhân' },
];

export const CityType = [
  // { value: "", label: "Tất cả" },
  { value: "Hà Nội", label: "Hà Nội" },
  { value: "Thành phố Hồ Chí Minh", label: "Thành phố Hồ Chí Minh" },
  { value: "Đà Nẵng", label: "Đà Nẵng" },
  { value: "An Giang", label: "An Giang" },
  { value: "Bà Rịa - Vũng Tàu", label: "Bà Rịa - Vũng Tàu" },
  { value: "Bình Dương", label: "Bình Dương" },
  { value: "Bình Phước", label: "Bình Phước" },
  { value: "Bình Thuận", label: "Bình Thuận" },
  { value: "Bình Định", label: "Bình Định" },
  { value: "Bạc Liêu", label: "Bạc Liêu" },
  { value: "Bắc Giang", label: "Bắc Giang" },
  { value: "Bắc Kạn", label: "Bắc Kạn" },
  { value: "Bắc Ninh", label: "Bắc Ninh" },
  { value: "Bến Tre", label: "Bến Tre" },
  { value: "Cao Bằng", label: "Cao Bằng" },
  { value: "Cà Mau", label: "Cà Mau" },
  { value: "Cần Thơ", label: "Cần Thơ" },
  { value: "Gia Lai", label: "Gia Lai" },
  { value: "Hoà Bình", label: "Hoà Bình" },
  { value: "Hà Giang", label: "Hà Giang" },
  { value: "Hà Nam", label: "Hà Nam" },
  { value: "Hà Tĩnh", label: "Hà Tĩnh" },
  { value: "Hưng Yên", label: "Hưng Yên" },
  { value: "Hải Dương", label: "Hải Dương" },
  { value: "Hải Phòng", label: "Hải Phòng" },
  { value: "Hậu Giang", label: "Hậu Giang" },
  { value: "Khánh Hòa", label: "Khánh Hòa" },
  { value: "Kiên Giang", label: "Kiên Giang" },
  { value: "Kon Tum", label: "Kon Tum" },
  { value: "Lai Châu", label: "Lai Châu" },
  { value: "Long An", label: "Long An" },
  { value: "Lào Cai", label: "Lào Cai" },
  { value: "Lâm Đồng", label: "Lâm Đồng" },
  { value: "Lạng Sơn", label: "Lạng Sơn" },
  { value: "Nam Định", label: "Nam Định" },
  { value: "Nghệ An", label: "Nghệ An" },
  { value: "Ninh Bình", label: "Ninh Bình" },
  { value: "Ninh Thuận", label: "Ninh Thuận" },
  { value: "Phú Thọ", label: "Phú Thọ" },
  { value: "Phú Yên", label: "Phú Yên" },
  { value: "Quảng Bình", label: "Quảng Bình" },
  { value: "Quảng Nam", label: "Quảng Nam" },
  { value: "Quảng Ngãi", label: "Quảng Ngãi" },
  { value: "Quảng Ninh", label: "Quảng Ninh" },
  { value: "Quảng Trị", label: "Quảng Trị" },
  { value: "Sóc Trăng", label: "Sóc Trăng" },
  { value: "Sơn La", label: "Sơn La" },
  { value: "Thanh Hóa", label: "Thanh Hóa" },
  { value: "Thái Bình", label: "Thái Bình" },
  { value: "Thái Nguyên", label: "Thái Nguyên" },
  { value: "Thừa Thiên Huế", label: "Thừa Thiên Huế" },
  { value: "Tiền Giang", label: "Tiền Giang" },
  { value: "Trà Vinh", label: "Trà Vinh" },
  { value: "Tuyên Quang", label: "Tuyên Quang" },
  { value: "Tây Ninh", label: "Tây Ninh" },
  { value: "Vĩnh Long", label: "Vĩnh Long" },
  { value: "Vĩnh Phúc", label: "Vĩnh Phúc" },
  { value: "Yên Bái", label: "Yên Bái" },
  { value: "Điện Biên", label: "Điện Biên" },
  { value: "Đắk Lắk", label: "Đắk Lắk" },
  { value: "Đắk Nông", label: "Đắk Nông" },
  { value: "Đồng Nai", label: "Đồng Nai" },
  { value: "Đồng Tháp", label: "Đồng Tháp" },
];

export const DistrictType = [
  { value: "Tất cả", content: [] },
  {
    value: "Hà Nội",
    content: [
      { value: "Quận Ba Đình", label: "Quận Ba Đình" },
      { value: "Quận Hoàn Kiếm", label: "Quận Hoàn Kiếm" },
      { value: "Quận Tây Hồ", label: "Quận Tây Hồ" },
      { value: "Quận Long Biên", label: "Quận Long Biên" },
      { value: "Quận Cầu Giấy", label: "Quận Cầu Giấy" },
      { value: "Quận Đống Đa", label: "Quận Đống Đa" },
      { value: "Quận Hai Bà Trưng", label: "Quận Hai Bà Trưng" },
      { value: "Quận Hoàng Mai", label: "Quận Hoàng Mai" },
      { value: "Quận Thanh Xuân", label: "Quận Thanh Xuân" },
      { value: "Sóc Sơn", label: "Sóc Sơn" },
      { value: "Đông Anh", label: "Đông Anh" },
      { value: "Gia Lâm", label: "Gia Lâm" },
      { value: "Quận Nam Từ Liêm", label: "Quận Nam Từ Liêm" },
      { value: "Thanh Trì", label: "Thanh Trì" },
      { value: "Quận Bắc Từ Liêm", label: "Quận Bắc Từ Liêm" },
      { value: "Mê Linh", label: "Mê Linh" },
      { value: "Quận Hà Đông", label: "Quận Hà Đông" },
      { value: "Thị xã Sơn Tây", label: "Thị xã Sơn Tây" },
      { value: "Ba Vì", label: "Ba Vì" },
      { value: "Phúc Thọ", label: "Phúc Thọ" },
      { value: "Đan Phượng", label: "Đan Phượng" },
      { value: "Hoài Đức", label: "Hoài Đức" },
      { value: "Quốc Oai", label: "Quốc Oai" },
      { value: "Thạch Thất", label: "Thạch Thất" },
      { value: "Chương Mỹ", label: "Chương Mỹ" },
      { value: "Thanh Oai", label: "Thanh Oai" },
      { value: "Thường Tín", label: "Thường Tín" },
      { value: "Phú Xuyên", label: "Phú Xuyên" },
      { value: "Ứng Hòa", label: "Ứng Hòa" },
      { value: "Mỹ Đức", label: "Mỹ Đức" },
    ],
  },
];

export const StatusType = [
  { value: true, label: "Hoạt động", color: 'green' },
  { value: false, label: "Không hoạt động", color: 'red' },
];

export const PositionTeaches = [
  { value: "", label: "Tất cả" },
  { value: "Dean", label: "Trưởng khoa" },
  { value: "ViceDean", label: "Phó trưởng khoa" },
  { value: "Secretary", label: "Thư ký khoa" },
];

export const QualificationTeaches = [
  { value: "", label: "Tất cả" },
  { value: "PhD", label: "Tiến sĩ" },
  { value: "MSc", label: "Thạc sĩ" },
  { value: "AssociateProfessor", label: "Phó giáo sư" },
];

export const StudentStatuses = [
  { value: "", label: "Tất cả" },
  { value: "Studying", label: "Đang học", color: "blue" },
  { value: "Withdrawn", label: "Thôi học", color: "red" },
  { value: "Graduated", label: "Đã tốt nghiệp", color: "green" },
  { value: "Deferment", label: "Tạm hoãn", color: "orange" },
  { value: "Deleted", label: "Đã xóa", color: "gray" },
];

export const ClassTypes = [
  { value: "", label: "Tất cả" },
  { value: "Lecture", label: "Bài giảng" },
  { value: "Lab", label: "Thực hành" },
  { value: "Tutorial", label: "Hướng dẫn" },
];

export const DeliveryModes = [
  { value: "", label: "Tất cả" },
  { value: "Online", label: "Trực tuyến" },
  { value: "Offline", label: "Trực tiếp" },
  { value: "Hybrid", label: "Kết hợp" },
];

export const genderMap = [
  { value: "", label: "Tất cả" },
  { value: "M", label: "Nam" },
  { value: "F", label: "Nữ" },
  { value: "Others", label: "Khác" },
];


export const CourseStatuses = [
  { value: "", label: "Tất cả", color: "#000000" }, // Màu đen cho "Tất cả"
  { value: "Completed", label: "Hoàn thành", color: "#4CAF50" }, // Màu xanh lá cho "Hoàn thành"
  { value: "InProgress", label: "Đang học", color: "#FF9800" }, // Màu cam cho "Đang học"
  { value: "Cancelled", label: "Đã hủy", color: "#F44336" }, // Màu đỏ cho "Đã hủy"
  { value: "Failed", label: "Trượt", color: "#D32F2F" }, // Màu đỏ đậm cho "Trượt"
  { value: "Deferred", label: "Tạm hoãn", color: "#FFC107" }, // Màu vàng cho "Tạm hoãn"
  { value: "ExamPostponed", label: "Hoãn thi", color: "#9E9E9E" }, // Màu xám cho "Hoãn thi"
  { value: "AwaitingGrade", label: "Chờ điểm", color: "#2196F3" }, // Màu xanh dương cho "Chờ điểm"
];


export const letterGradeOptions = [
  { value: 'A', label: 'A' },
  { value: 'APlus', label: 'A+' },
  { value: 'B', label: 'B' },
  { value: 'BPlus', label: 'B+' },
  { value: 'C', label: 'C' },
  { value: 'CPlus', label: 'C+' },
  { value: 'D', label: 'D' },
  { value: 'DPlus', label: 'D+' },
  { value: 'F', label: 'F' },
  { value: 'FPlus', label: 'F+' },
];

export const evaluationOptions = [
  { value: 'Pass', label: 'Đạt' },
  { value: 'Retake', label: 'Học lại' },
  { value: 'Deferment', label: 'Bảo lưu' },
];

export const evaluationMap: Record<string, string> = {
  Excellent: 'Xuất sắc',
  Good: 'Tốt',
  Fair: 'Khá',
  Average: 'Trung bình',
  Weak: 'Yếu',
  Poor: 'Kém',
};

export const classificationMap: Record<number, string> = {
  0: 'Xuất sắc',
  1: 'Tốt',
  2: 'Khá',
  3: 'Trung bình',
  4: 'Yếu',
  5: 'Kém',
};

export const evaluationLabelMap: Record<string, string> = {
  Good: 'Tốt',
  Fair: 'Khá',
  Average: 'Trung bình',
  Poor: 'Yếu',
};

export const typeOptions = [
  { value: 'Scholarship', label: 'Học bổng', color: '#4CAF50' },    // Màu xanh lá
  { value: 'Warning', label: 'Cảnh báo', color: '#FF9800' },        // Màu cam
  { value: 'Graduation', label: 'Tốt nghiệp', color: '#2196F3' },   // Màu xanh dương
  { value: 'Retake', label: 'Học lại', color: '#F44336' }
];

export const genderLabels: Record<string, string> = {
  M: "Nam",
  F: "Nữ",
  O: "Khác",
};

export const courseTypeOptions = [
  { value: "Elective", label: 'Tự chọn', color: '#03A9F4' },
  { value: "Mandatory", label: 'Bắt buộc', color: '#F44336' },
];

export const handleError = (err: any, navigate: NavigateFunction) => {
  const error = err as AxiosError;
  if (err.status === 401) {
    notification.error({
      message: "Lỗi",
      description: "Hết phiên đăng nhập",
    });
    navigate("/login");
  } else {
    notification.error({
      message: "Lỗi",
      description: "Có lỗi xảy ra, vui lòng thử lại",
    });
  }
};