import {
  CloseCircleOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import { Form, Input, Select, Button, DatePicker, Modal, Empty, Row, Col, notification } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { IClassCourseDTO, IConductFacu, IFacultyDTO, IStudentDTO } from '../../interfaces/course';
import { formItemLayout, handleError } from "../../constants/general.constant";
import getDetailsApi from "../../apis/get.details.api";
import { useNavigate } from "react-router-dom";
import postApi from "../../apis/post.api";

const { Option } = Select;

interface Props {
  getList: () => void
  onCancel: () => void;
  open: boolean;
  faculties: IFacultyDTO[]
}

export default function StudentCreate({ getList, onCancel, open, faculties }: Props) {
  const [form] = Form.useForm();
  const [listClassCourse, setListClassCourse] = useState<IClassCourseDTO>();
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<string>();
  const [classOptions, setClassOptions] = useState<{ label: string; value: string }[]>([]);

  const handleFinish = (values: any) => {
    const formatted: IStudentDTO = {
      ...values,
      dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).toDate().toISOString() : undefined,
      dateEnrollment: values.dateEnrollment ? dayjs(values.dateEnrollment).toDate().toISOString() : undefined,
      faculties: values.faculties ? { id: values.faculties } : undefined,
      status: "Studying"
    };
    handleSubmit(formatted);
  };

  const getListClassName = async (id: number) => {
    try {
      const response = await getDetailsApi.getClassCourse(id);
      setListClassCourse(response);
    } catch (err) {
      handleError(err, navigate);
    } finally {
    }
  };

  // Danh sách khóa học
  const courseOptions = listClassCourse?.courses?.map(c => ({
    label: c.course,
    value: c.course!,
  })) || [];

  // Khi chọn khóa học
  const handleSelectCourse = (course: string) => {
    setSelectedCourse(course);
    const matched = listClassCourse?.courses?.find(c => c.course === course);
    const classes = matched?.clasName || [];

    setClassOptions(classes.map(name => ({ label: name, value: name })));
    form.setFieldsValue({ className: undefined });
  };

  const handleSubmit = async (value: IStudentDTO) => {
    try {
      await postApi.createStudents(value);
      notification.success({
        message: "Thông báo",
        description: "Thêm sinh viên thành công",
      });
      onCancel();
      getList();
      form.resetFields();
    } catch (err: any) {
      handleError(err, navigate);
    } finally {
    }
  };

  return (
    <Modal
      open={open}
      title="Tạo mới Khoa"
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      width="50%"
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            form.resetFields();
            onCancel();
          }}
          type="primary"
          className="button btn-cancel"
        >
          <CloseCircleOutlined />
          Đóng
        </Button>,
        <Button className="button btn-add" type="primary" htmlType="submit" onClick={() => form.submit()}>
          Thêm mới
        </Button>
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row>
          <Col span={12} style={{ paddingRight: '15px' }}>
            <Form.Item name="fullName" label="Họ và tên">
              <Input />
            </Form.Item>
            <Form.Item name="dateOfBirth" label="Ngày sinh">
              <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="gender" label="Giới tính">
              <Select>
                <Option value="M">Nam</Option>
                <Option value="F">Nữ</Option>
              </Select>
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
              <Input />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
            <Form.Item name="notes" label="Ghi chú">
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phoneNumber" label="Số điện thoại">
              <Input />
            </Form.Item>
            <div style={{ width: '100%' }}>
              <Form.Item name="dateEnrollment" label="Ngày nhập học">
                <DatePicker
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
            <Form.Item
              {...formItemLayout}
              labelAlign={"left"}
              name={'faculties'}
              style={{ minHeight: '30px' }}
              label={
                <span style={{ fontWeight: "550", fontSize: "14px" }}>Khoa</span>
              }
              rules={[{ required: true, message: 'Vui lòng chọn khoa' }]}
            >
              <Select
                className="d-flex w-100 form-select-search "
                style={{ minHeight: '30px' }}
                size="middle"
                optionLabelProp="label"
                onSelect={(selectedId: number) => {
                  getListClassName(selectedId);
                  form.setFieldsValue({ "course": "", classIName: "", academicYear: "" })
                }}
                notFoundContent={faculties ? <Empty description="Không có dữ liệu" /> : null}
              >
                {faculties?.map((faculty) => (
                  <Select.Option key={faculty.id} value={faculty.id} label={faculty.facultyName}>
                    {faculty.facultyCode + "-" + faculty.facultyName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="courseYear"
              label="Niên khóa"
              rules={[{ required: true, message: 'Vui lòng chọn khóa học' }]}
            >
              <Select
                placeholder="Chọn khóa học"
                className="d-flex w-100 form-select-search "
                style={{ minHeight: '30px' }}
                size="middle"
                optionLabelProp="label"
                disabled={!courseOptions}
                onSelect={handleSelectCourse}
                notFoundContent={courseOptions && courseOptions.length == 0 ? <Empty description="Không có dữ liệu" /> : null}
              >
                {courseOptions.map((item) => (
                  <Select.Option key={item.value} value={item.value} label={item.label}>
                    {item.value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="clasName"
              label="Lớp học"
              rules={[{ required: true, message: 'Vui lòng chọn lớp học' }]}
            >
              <Select
                placeholder="Chọn lớp học"
                options={classOptions}
                disabled={!selectedCourse}
                notFoundContent={<Empty description="Không có lớp học" />}
              />
            </Form.Item>
          </Col>
        </Row>



      </Form>
    </Modal>
  );
}
