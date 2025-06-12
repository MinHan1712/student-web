import {
  CloseCircleOutlined,
  PlusCircleOutlined
} from "@ant-design/icons";
import { Button, DatePicker, Flex, Form, Input, InputNumber, Modal, notification, Select } from "antd";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import getApi from "../../apis/get.api";
import postApi from "../../apis/post.api";
import { ClassTypes, DeliveryModes, formItemLayout } from "../../constants/general.constant";
import { IResponseN } from "../../interfaces/common";
import { IClassDTO, ICourseDTO, ICourseFilter, ITeacherDTO, ITeacherFilter } from "../../interfaces/course";

interface IProviderInformationProps {
  open: boolean;
  onCancel: () => void;
}

const ClassesCreate = (props: IProviderInformationProps) => {
  const [form] = Form.useForm<IClassDTO>();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<IResponseN<ICourseDTO[]>>();
  const [teachers, setTeachers] = useState<IResponseN<ITeacherDTO[]>>();
  const [courseReq, setCourseReq] = useState<ICourseFilter>({
    page: 0,
    size: 20
  });
  const [teachersReq, setTeachersReq] = useState<ITeacherFilter>({
    page: 0,
    size: 20
  });
  const eventSummitForm = (formValue: IClassDTO) => {
    create(formValue);
  }

  const create = async (value: IClassDTO) => {
    setLoading(true);
    try {
      const payload = {
        ...value,
        startDate: value.startDate ? dayjs(value.startDate).toDate().toISOString() : undefined,
        endDate: value.endDate ? dayjs(value.endDate).toDate().toISOString() : undefined,
        teachers: { id: value.teachers },
        course: { id: value.course }

      };
      await postApi.createClasses(payload).then((response) => {
        // switch (response) {
        //   case 200:
        notification['success']({
          message: "Thông báo",
          description: 'Cập nhập điểm thành công',
        });
        form.resetFields();
        props.onCancel();
      })
        .catch(() => {
          notification['error']({
            message: "Lỗi",
            description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
          });
        })

    } catch (err) {
      notification['error']({
        message: "Lỗi",
        description: 'Có một lỗi nào đó xảy ra, vui lòng thử lại',
      });
    } finally { setLoading(false); }
  }

  const toQueryString = (params: Record<string, any>): string => {
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return '?' + new URLSearchParams(cleanedParams as any).toString();
  };

  const getListCourse = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(courseReq);
      const response = await getApi.getCourses(fullQuery);
      setCourses(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getListTeachers = async () => {
    setLoading(true);
    try {
      const fullQuery = toQueryString(teachersReq);
      const response = await getApi.getTeachers(fullQuery);
      setTeachers(response);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListCourse();
  }, [courseReq])

  useEffect(() => {
    getListTeachers();
  }, [teachersReq])

  return (
    <>
      <Modal
        open={props.open}
        title="Chi tiết lớp học phần"
        okText="Create"
        maskClosable={false}
        cancelText="Cancel"
        onCancel={() => {
          form.resetFields();
          props.onCancel();
        }}
        width={"70%"}
        footer={[
          <Button
            key="back"
            className="button btn-cancel d-block"
            type="primary"
            onClick={() => {
              form.resetFields();
              props.onCancel();
            }}
          >
            <CloseCircleOutlined style={{ verticalAlign: "baseline" }} />
            <span>Đóng</span>
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={(event) => {
              event.preventDefault();
              form.submit();
            }}
            className="button btn-add d-block"
          >
            <PlusCircleOutlined style={{ verticalAlign: "baseline" }} />
            <span>Thêm mới</span>
          </Button>
        ]}
      >
        <Form
          name="providerCreate"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ width: "100%", padding: '0 10px' }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={eventSummitForm}
        >
          <Flex gap="middle" justify="space-between" align={'flex-start'} style={{ width: '100%' }}>
            <Flex gap="middle" justify="flex-start" vertical align={'flex-start'} style={{ width: '33%' }}>
              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="classCode"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Mã lớp</span>}
                >
                  <Input placeholder="Tự động sinh mã lớp" disabled />
                </Form.Item>
              </div>

              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="className"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Tên lớp</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập tên lớp', whitespace: true }]}
                >
                  <Input placeholder="Nhập tên lớp" />
                </Form.Item>
              </div>

              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="classroom"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Phòng học</span>}
                >
                  <Input placeholder="Nhập phòng học" />
                </Form.Item>
              </div>

              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="credits"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Tín chỉ</span>}

                >
                  <InputNumber placeholder="Nhập số tín chỉ" min={0} style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="academicYear"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Năm học</span>}
                >
                  <Input placeholder="Nhập năm học (vd: 2024-2025)" />
                </Form.Item>
              </div>
            </Flex>
            <Flex gap="middle" justify="flex-start" vertical align={'center'} style={{ width: '33%' }}>
              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="numberOfSessions"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Số buổi học</span>}
                >
                  <InputNumber placeholder="Nhập số buổi" min={0} style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="totalNumberOfStudents"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Số sinh viên</span>}
                >
                  <InputNumber placeholder="Nhập số sinh viên" min={0} style={{ width: '100%' }} />
                </Form.Item>
              </div>

              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="classType"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Loại lớp</span>}
                >
                  <Select placeholder="Chọn hình thức học">
                    {ClassTypes.filter(item => item.value).map((mode) => (
                      <Select.Option key={mode.value} value={mode.value}>
                        {mode.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="deliveryMode"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Hình thức học</span>}
                >
                  <Select placeholder="Chọn hình thức học">
                    {DeliveryModes.filter(item => item.value).map((mode) => (
                      <Select.Option key={mode.value} value={mode.value}>
                        {mode.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="teachers"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Giáo viên</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn giáo viên' }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn giáo viên"
                    optionFilterProp="children"
                    allowClear
                    optionLabelProp="label"
                    onSelect={(value) => {
                      form.setFieldsValue({ teachers: value });
                    }}
                  >
                    {teachers?.data?.map((teacher) => (
                      <Select.Option key={teacher.id} value={teacher.id} label={teacher.name}>
                        {teacher.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="course"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Môn học</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn môn học"
                    optionFilterProp="children"
                    allowClear
                    onSelect={(value) => {
                      form.setFieldsValue({ course: value, credits: value.credits });
                    }}
                  >
                    {courses?.data?.map((course) => (
                      <Select.Option key={course.id} value={course.id} label={course.courseTitle}>
                        {course.courseTitle}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Flex>
            <Flex gap="middle" justify="flex-start" vertical align={'center'} style={{ width: '33%' }}>

              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="startDate"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Ngày bắt đầu</span>}
                >
                  <DatePicker showTime style={{ width: '100%' }} placeholder="Chọn ngày bắt đầu" />
                </Form.Item>
              </div>

              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="endDate"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Ngày kết thúc</span>}
                >
                  <DatePicker showTime style={{ width: '100%' }} placeholder="Chọn ngày kết thúc" />
                </Form.Item>
              </div>

              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="notes"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Ghi chú</span>}
                >
                  <Input.TextArea placeholder="Nhập ghi chú" />
                </Form.Item>
              </div>

              <div className="wrapper-column" style={{ width: '100%' }}>
                <Form.Item
                  {...formItemLayout}
                  name="description"
                  label={<span style={{ fontWeight: "550", fontSize: "14px" }}>Mô tả</span>}
                >
                  <Input.TextArea placeholder="Nhập mô tả" />
                </Form.Item>
              </div>
            </Flex>
          </Flex>
        </Form>
      </Modal>

    </>
  );
};

export default ClassesCreate;